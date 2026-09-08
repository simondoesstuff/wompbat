"""Pre-compute top-K FDR-passing query results for every PGS and Phecode."""

import json
import math
import sqlite3
import sys

K: int = snakemake.params.k  # noqa: F821
INPUT: str = snakemake.input[0]  # noqa: F821
OUTPUT: str = snakemake.output[0]  # noqa: F821

ANCESTRY_COLS: list[tuple[str, str]] = [
    ("AFR", "Africa"),
    ("AMR", "America"),
    ("CSA", "Central_South_Asian"),
    ("EAS", "East_Asian"),
    ("EUR", "Europe"),
    ("MLE", "Middle_East"),
]


def qnorm(p: float) -> float:
    """Beasley-Springer-Moro approximation of the inverse normal CDF."""
    q = p if p < 0.5 else 1 - p
    t = math.sqrt(-2 * math.log(max(q, 1e-15)))
    num = 2.515517 + t * (0.802853 + t * 0.010328)
    den = 1 + t * (1.432788 + t * (0.189269 + t * 0.001308))
    return (-1 if p < 0.5 else 1) * (t - num / den)


def derive_ci(or_: float, pval: float) -> tuple[float | None, float | None]:
    try:
        log_or = math.log(or_) if or_ > 0 else 0.0
        z = qnorm(1 - min(max(pval, 1e-300), 0.9999) / 2)
        se = abs(log_or) / z if z > 0 else 0
        return math.exp(log_or - 1.96 * se), math.exp(log_or + 1.96 * se)
    except (OverflowError, ValueError):
        return None, None


def extract_effects(row: dict, sfx: str) -> list[dict]:
    effects = []
    for anc, col in ANCESTRY_COLS:
        or_ = row.get(f"{col}_{sfx}_OR")
        pval = row.get(f"{col}_{sfx}_pval")
        if or_ is not None and pval is not None and or_ > 0:
            ci_lower, ci_upper = derive_ci(or_, pval)
            effects.append({"ancestry": anc, "or": or_, "ci_lower": ci_lower, "ci_upper": ci_upper})
    meta_or = row.get(f"meta_{sfx}_FE_OR")
    meta_pval = row.get(f"meta_{sfx}_pMix")
    if meta_or is not None and meta_pval is not None and meta_or > 0:
        ci_lower, ci_upper = derive_ci(meta_or, meta_pval)
        effects.append({"ancestry": "Meta", "or": meta_or, "ci_lower": ci_lower, "ci_upper": ci_upper})
    return effects


def extract_stats(row: dict) -> list[dict]:
    stats = []
    for anc, col in ANCESTRY_COLS:
        cases = row.get(f"ncase_{col}")
        controls = row.get(f"ncontrol_{col}")
        if cases is not None and controls is not None:
            stats.append({"ancestry": anc, "cases": cases, "sample": cases + controls})
    return stats


def cap(s: str | None, fallback: str) -> str:
    s = s or fallback
    return s[0].upper() + s[1:] if s else s


def to_phecode_row(row: dict, unit: str) -> dict:
    sfx = "qPGS" if unit == "continuous" else "top10pPGS"
    meta_or = row.get(f"meta_{sfx}_FE_OR") if row.get(f"meta_{sfx}_FE_OR") is not None else 1.0
    pval = row.get(f"meta_{sfx}_pMix") if row.get(f"meta_{sfx}_pMix") is not None else 1.0
    ci_lower, ci_upper = derive_ci(meta_or, pval)
    return {
        "phecodeId": row["phecode"],
        "phenotypeName": row.get("phenotype") or row["phecode"],
        "metaOR": meta_or,
        "ciLower": ci_lower,
        "ciUpper": ci_upper,
        "pValue": pval,
        "i2": row.get(f"meta_{sfx}_i2") or 0,
        "auc": row.get(f"avg_auc_pgs_{sfx}") or 0,
        "prevalence": row.get("preval_ccpm") or 0,
        "effects": extract_effects(row, sfx),
        "ancestryStats": extract_stats(row),
    }


def to_pgs_row(row: dict) -> dict:
    meta_or = row.get("meta_qPGS_FE_OR") if row.get("meta_qPGS_FE_OR") is not None else 1.0
    pval = row.get("meta_qPGS_pMix") if row.get("meta_qPGS_pMix") is not None else 1.0
    ci_lower, ci_upper = derive_ci(meta_or, pval)
    return {
        "pgsId": row["pgs"],
        "efoLabel": cap(row.get("efo_label"), row["pgs"]),
        "ccpmVariants": row.get("Nvar") or 0,
        "metaOR": meta_or,
        "ciLower": ci_lower,
        "ciUpper": ci_upper,
        "pValue": pval,
        "i2": row.get("meta_qPGS_i2") or 0,
        "auc": row.get("avg_auc_pgs_qPGS") or 0,
        "pubYear": row.get("pubyear"),
        "effects": extract_effects(row, "qPGS"),
    }


con = sqlite3.connect(f"file:{INPUT}?mode=ro", uri=True)
con.row_factory = sqlite3.Row

# --- PGS index ---
pgs_ids: list[str] = [
    r[0] for r in con.execute("SELECT DISTINCT pgs FROM associations ORDER BY pgs").fetchall()
]
print(f"Building PGS index ({len(pgs_ids)} IDs, K={K})...", file=sys.stderr)

pgs_index: dict = {}
for i, pgs_id in enumerate(pgs_ids):
    if i % 500 == 0:
        print(f"  {i}/{len(pgs_ids)}", file=sys.stderr)

    info_row = con.execute(
        "SELECT efo_label, Nvar, pubyear FROM associations WHERE pgs = ? LIMIT 1", (pgs_id,)
    ).fetchone()

    info = {
        "pgsId": pgs_id,
        "corePhenotype": cap(info_row["efo_label"] if info_row else None, pgs_id),
        "ccpmVariants": (info_row["Nvar"] or 0) if info_row else 0,
        "catalogUrl": f"https://www.pgscatalog.org/score/{pgs_id}/",
        "pubYear": info_row["pubyear"] if info_row else None,
    }

    rows_cont = con.execute(
        """SELECT a.*, d.phenotype FROM associations a
           LEFT JOIN phecode_defs d ON a.phecode = d.phecode
           WHERE a.pgs = ? AND a.passFDR10p_qPGS = 1
           ORDER BY a.meta_qPGS_pMix ASC LIMIT ?""",
        (pgs_id, K),
    ).fetchall()

    rows_thresh = con.execute(
        """SELECT a.*, d.phenotype FROM associations a
           LEFT JOIN phecode_defs d ON a.phecode = d.phecode
           WHERE a.pgs = ? AND a.passFDR10p_bPGS = 1
           ORDER BY a.meta_top10pPGS_pMix ASC LIMIT ?""",
        (pgs_id, K),
    ).fetchall()

    pgs_index[pgs_id] = {
        "info": info,
        "continuous": [to_phecode_row(dict(r), "continuous") for r in rows_cont],
        "thresholded": [to_phecode_row(dict(r), "thresholded") for r in rows_thresh],
    }

# --- Phecode index ---
phecode_ids: list[str] = [
    r[0] for r in con.execute("SELECT DISTINCT phecode FROM associations ORDER BY phecode").fetchall()
]
print(f"Building phecode index ({len(phecode_ids)} IDs, K={K})...", file=sys.stderr)

phecode_index: dict = {}
for i, phecode_id in enumerate(phecode_ids):
    if i % 500 == 0:
        print(f"  {i}/{len(phecode_ids)}", file=sys.stderr)

    rows = con.execute(
        """SELECT a.*, d.phenotype FROM associations a
           LEFT JOIN phecode_defs d ON a.phecode = d.phecode
           WHERE a.phecode = ? AND a.passFDR10p_qPGS = 1
           ORDER BY a.meta_qPGS_pMix ASC LIMIT ?""",
        (phecode_id, K),
    ).fetchall()

    first = dict(rows[0]) if rows else {}

    phecode_index[phecode_id] = {
        "info": {
            "phecodeId": phecode_id,
            "phenotypeName": first.get("phenotype") or phecode_id,
            "domain": first.get("phecode_domain") or "",
            "totalCases": first.get("ncase_meta") or 0,
            "totalSample": (first.get("ncase_meta") or 0) + (first.get("ncontrol_meta") or 0),
        },
        "rows": [to_pgs_row(dict(r)) for r in rows],
        "ancestryStats": extract_stats(first),
    }

con.close()

print(f"Writing {OUTPUT}...", file=sys.stderr)
with open(OUTPUT, "w") as f:
    json.dump({"pgs": pgs_index, "phecode": phecode_index}, f, separators=(",", ":"))
print("Done.", file=sys.stderr)
