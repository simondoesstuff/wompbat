"""Independent, read-only TSV oracle. Never imports app/exporter code or JSON assets."""

import json
import math
import sqlite3
import sys
from itertools import zip_longest
from pathlib import Path
from statistics import NormalDist


def confidence_interval(odds_ratio, p_value):
    # Audit the exporter's numerical contract: two-sided p capped at .9999,
    # inverse-normal tail floored at 1e-15. Use the stdlib inverse CDF rather
    # than copying the production approximation. This is not a validation of
    # whether FE_OR and pMix are an appropriate statistical pair.

    if odds_ratio <= 0:
        return [None, None]

    p = min(max(p_value, 1e-300), 0.9999)
    tail = max(1 - (1 - p / 2), 1e-15)
    z = -NormalDist().inv_cdf(tail)
    margin = 1.96 * abs(math.log(odds_ratio)) / z

    try:
        return [
            math.exp(math.log(odds_ratio) - margin),
            math.exp(math.log(odds_ratio) + margin),
        ]
    except OverflowError:
        return [None, None]


def main():
    path = Path(sys.argv[1]).resolve(strict=True)
    with sqlite3.connect(path.as_uri() + "?mode=ro", uri=True) as db:
        db.row_factory = sqlite3.Row

        if len(sys.argv) == 2:
            # Alternate directions so even a small count exercises both pages.
            ids = [
                [
                    {"kind": kind, "id": row[0]}
                    for row in db.execute(
                        f"SELECT DISTINCT {kind} FROM associations ORDER BY {kind}"
                    )
                ]
                for kind in ("pgs", "phecode")
            ]
            print(
                json.dumps(
                    [
                        query
                        for pair in zip_longest(*ids)
                        for query in pair
                        if query is not None
                    ]
                )
            )

            return

        _, _, kind, id, unit, filtered, k = sys.argv
        assert kind in ("pgs", "phecode")
        assert unit in ("continuous", "thresholded")
        suffix, flag = (
            ("qPGS", "qPGS") if unit == "continuous" else ("top10pPGS", "bPGS")
        )
        rows = db.execute(
            f"""
            SELECT a.*, d.phenotype FROM associations a
            LEFT JOIN phecode_defs d ON a.phecode = d.phecode
            WHERE a.{kind} = ? AND a.passFDR10p_{flag} = 1
            ORDER BY a.meta_{suffix}_pMix ASC LIMIT ?
        """,
            (id, int(k)),
        ).fetchall()
        if kind == "pgs":
            headers = [
                "Phecode",
                "Phenotype Name",
                "Meta OR",
                "CI Lower",
                "CI Upper",
                "P-Value",
                "I2",
                "AUC",
                "Prevalence",
            ]
        else:
            headers = [
                "PGS ID",
                "EFO Label",
                "CCPM Variants",
                "Meta OR",
                "CI Lower",
                "CI Upper",
                "P-Value",
                "I2",
                "AUC",
            ]

        print("\t".join(headers))

        for row in rows:
            if filtered == "true" and (row[f"meta_{suffix}_i2"] or 0) >= 20:
                continue

            odds = row[f"meta_{suffix}_FE_OR"]
            odds = odds if odds is not None else 1.0
            pval = row[f"meta_{suffix}_pMix"]
            pval = pval if pval is not None else 1.0
            lower, upper = confidence_interval(odds, pval)
            common = [
                odds,
                lower,
                upper,
                pval,
                row[f"meta_{suffix}_i2"] or 0,
                row[f"avg_auc_pgs_{suffix}"] or 0,
            ]

            if kind == "pgs":
                values = [
                    row["phecode"],
                    row["phenotype"] or row["phecode"],
                    *common,
                    row["preval_ccpm"] or 0,
                ]
            else:
                label = row["efo_label"] or row["pgs"]
                values = [
                    row["pgs"],
                    label[0].upper() + label[1:],
                    row["Nvar"] or 0,
                    *common,
                ]

            print("\t".join("" if value is None else str(value) for value in values))


if __name__ == "__main__":
    main()
