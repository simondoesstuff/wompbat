"""Split precomputed.json into one JSON file per PGS/phecode ID."""

import json
import os
import sys

INPUT: str = snakemake.input[0]  # noqa: F821
PGS_DIR: str = snakemake.output[0]  # noqa: F821
PHECODE_DIR: str = snakemake.output[1]  # noqa: F821

print(f"Reading {INPUT}...", file=sys.stderr)
with open(INPUT) as f:
    data = json.load(f)

os.makedirs(PGS_DIR, exist_ok=True)
os.makedirs(PHECODE_DIR, exist_ok=True)

pgs_entries = data["pgs"]
print(f"Writing {len(pgs_entries)} PGS files...", file=sys.stderr)
for pgs_id, entry in pgs_entries.items():
    with open(f"{PGS_DIR}/{pgs_id}.json", "w") as f:
        json.dump(entry, f, separators=(",", ":"))

phecode_entries = data["phecode"]
print(f"Writing {len(phecode_entries)} phecode files...", file=sys.stderr)
for phecode_id, entry in phecode_entries.items():
    with open(f"{PHECODE_DIR}/{phecode_id}.json", "w") as f:
        json.dump(entry, f, separators=(",", ":"))

print(f"Done. {len(pgs_entries) + len(phecode_entries)} files written.", file=sys.stderr)
