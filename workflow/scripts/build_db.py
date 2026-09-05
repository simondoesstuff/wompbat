"""Build a Turso/SQLite database from the CCPM megatable (Tier 1 columns only)."""

import csv
import gzip
import sqlite3
import sys

TIER1_COLUMNS = [
    # Identifiers
    "phecode",
    "pgs",
    # Significance & ranking
    "passFDR10p_qPGS",
    "passFDR10p_bPGS",
    "bestPGS_qPGS",
    "bestPGS_bPGS",
    # Per-ancestry associations: continuous unit (qPGS)
    "Africa_qPGS_OR",
    "Africa_qPGS_pval",
    "America_qPGS_OR",
    "America_qPGS_pval",
    "Central_South_Asian_qPGS_OR",
    "Central_South_Asian_qPGS_pval",
    "East_Asian_qPGS_OR",
    "East_Asian_qPGS_pval",
    "Europe_qPGS_OR",
    "Europe_qPGS_pval",
    "Middle_East_qPGS_OR",
    "Middle_East_qPGS_pval",
    # Per-ancestry associations: thresholded unit (top10pPGS)
    "Africa_top10pPGS_OR",
    "Africa_top10pPGS_pval",
    "America_top10pPGS_OR",
    "America_top10pPGS_pval",
    "Central_South_Asian_top10pPGS_OR",
    "Central_South_Asian_top10pPGS_pval",
    "East_Asian_top10pPGS_OR",
    "East_Asian_top10pPGS_pval",
    "Europe_top10pPGS_OR",
    "Europe_top10pPGS_pval",
    "Middle_East_top10pPGS_OR",
    "Middle_East_top10pPGS_pval",
    # Meta-analysis summary
    "meta_qPGS_FE_OR",
    "meta_qPGS_pMix",
    "meta_top10pPGS_FE_OR",
    "meta_top10pPGS_pMix",
    "meta_qPGS_i2",
    "meta_top10pPGS_i2",
    # Average AUC
    "avg_auc_pgs_qPGS",
    "avg_auc_pgs_top10pPGS",
    # Sample sizes
    "ncase_Africa",
    "ncontrol_Africa",
    "ncase_America",
    "ncontrol_America",
    "ncase_Central_South_Asian",
    "ncontrol_Central_South_Asian",
    "ncase_East_Asian",
    "ncontrol_East_Asian",
    "ncase_Europe",
    "ncontrol_Europe",
    "ncase_Middle_East",
    "ncontrol_Middle_East",
    "ncase_meta",
    "ncontrol_meta",
    # Phecode metadata
    "phecode_domain",
    "preval_ccpm",
    # PGS metadata
    "Nvar",
    "efo_id",
    "efo_label",
]

INT_COLUMNS = frozenset(
    {
        "passFDR10p_qPGS",
        "passFDR10p_bPGS",
        "bestPGS_qPGS",
        "bestPGS_bPGS",
        "ncase_Africa",
        "ncontrol_Africa",
        "ncase_America",
        "ncontrol_America",
        "ncase_Central_South_Asian",
        "ncontrol_Central_South_Asian",
        "ncase_East_Asian",
        "ncontrol_East_Asian",
        "ncase_Europe",
        "ncontrol_Europe",
        "ncase_Middle_East",
        "ncontrol_Middle_East",
        "ncase_meta",
        "ncontrol_meta",
        "Nvar",
    }
)

TEXT_COLUMNS = frozenset({"phecode", "pgs", "phecode_domain", "efo_id", "efo_label"})


def col_type(col: str) -> str:
    if col in INT_COLUMNS:
        return "INTEGER"
    if col in TEXT_COLUMNS:
        return "TEXT"
    return "REAL"


def parse_val(val: str, col: str):
    if val == "NA" or val == "":
        return None
    if col in TEXT_COLUMNS:
        return val
    if col in INT_COLUMNS:
        try:
            return int(float(val))
        except ValueError:
            return None
    try:
        return float(val)
    except ValueError:
        return None


INPUT = snakemake.input[0]  # noqa: F821  (snakemake injects this)
OUTPUT = snakemake.output[0]  # noqa: F821

BATCH_SIZE = 50_000

con = sqlite3.connect(OUTPUT)
# page_size must be set before the first write to take effect.
# 4096 bytes aligns with D1's native page size and the OS VM page boundary,
# giving the best read efficiency for a D1-deployed read-only database.
con.execute("PRAGMA page_size=4096")
# Use in-memory journal during the build for speed; no WAL/SHM files created.
con.execute("PRAGMA journal_mode=MEMORY")
con.execute("PRAGMA synchronous=OFF")
con.execute("PRAGMA cache_size=-524288")  # 512 MB page cache

col_defs = ", ".join(f'"{c}" {col_type(c)}' for c in TIER1_COLUMNS)
con.execute(f"CREATE TABLE associations ({col_defs})")

placeholders = ", ".join("?" * len(TIER1_COLUMNS))
insert_sql = f"INSERT INTO associations VALUES ({placeholders})"

with gzip.open(INPUT, "rt") as f:
    reader = csv.DictReader(f, delimiter="\t")
    batch = []
    n = 0
    for row in reader:
        batch.append(tuple(parse_val(row[c], c) for c in TIER1_COLUMNS))
        if len(batch) >= BATCH_SIZE:
            con.executemany(insert_sql, batch)
            n += len(batch)
            batch = []
            print(f"  {n:,} rows loaded", file=sys.stderr)
    if batch:
        con.executemany(insert_sql, batch)
        n += len(batch)

print(f"Total: {n:,} rows", file=sys.stderr)
print("Building indices...", file=sys.stderr)

con.execute("CREATE INDEX idx_pgs ON associations(pgs)")
con.execute("CREATE INDEX idx_phecode ON associations(phecode)")

con.commit()

# Switch to DELETE journal (standard, single-file) before vacuuming.
# VACUUM rewrites the entire file: pages become dense and sequentially ordered,
# which benefits HTTP range-request prefetching.
print("Vacuuming...", file=sys.stderr)
con.execute("PRAGMA journal_mode=DELETE")
con.execute("VACUUM")
# Bake in query-planner statistics so the first query doesn't cold-start.
con.execute("PRAGMA optimize")
# Database is read-only after this point; disable journaling so no rollback
# file is ever created and D1 doesn't attempt to manage one.
con.execute("PRAGMA journal_mode=OFF")
con.close()
print("Done.", file=sys.stderr)
