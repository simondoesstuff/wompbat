"""Extract autocomplete lookup tables into a small static SQLite database."""

import sqlite3
import sys

INPUT = snakemake.input[0]  # noqa: F821
OUTPUT = snakemake.output[0]  # noqa: F821

src = sqlite3.connect(f"file:{INPUT}?mode=ro", uri=True)
con = sqlite3.connect(OUTPUT)
con.execute("PRAGMA page_size=4096")
con.execute("PRAGMA journal_mode=MEMORY")
con.execute("PRAGMA synchronous=OFF")

con.execute("CREATE TABLE pgs_labels (pgs TEXT PRIMARY KEY, efo_label TEXT)")
rows = src.execute("SELECT pgs, efo_label FROM pgs_labels ORDER BY pgs").fetchall()
con.executemany("INSERT INTO pgs_labels VALUES (?, ?)", rows)
print(f"  {len(rows):,} PGS labels", file=sys.stderr)

con.execute("CREATE TABLE phecode_defs (phecode TEXT PRIMARY KEY, phenotype TEXT)")
rows = src.execute("SELECT phecode, phenotype FROM phecode_defs ORDER BY phecode").fetchall()
con.executemany("INSERT INTO phecode_defs VALUES (?, ?)", rows)
print(f"  {len(rows):,} phecode definitions", file=sys.stderr)

con.commit()
con.execute("PRAGMA journal_mode=DELETE")
con.execute("VACUUM")
con.execute("PRAGMA journal_mode=OFF")
con.close()
src.close()
print("Done.", file=sys.stderr)
