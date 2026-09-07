"""Dump megatable.db to D1-compatible SQL chunks using multi-row INSERTs.

Single-row INSERTs from sqlite3 .dump produce ~5.7M statements, which causes
D1's API session to timeout mid-upload. Multi-row INSERTs reduce that to ~11k.

Outputs: OUT_DIR/00_schema.sql + OUT_DIR/data_NNNN.sql (one per ROWS_PER_FILE rows).
"""

import os
import sqlite3

DB_PATH = snakemake.input[0]  # noqa: F821
OUT_DIR = snakemake.output[0]  # noqa: F821

ROWS_PER_INSERT = 500   # rows per INSERT VALUES (...), (...) statement
ROWS_PER_FILE = 50_000  # rows per output file (~100 statements each)

os.makedirs(OUT_DIR, exist_ok=True)


def sql_literal(v):
    if v is None:
        return "NULL"
    if isinstance(v, str):
        return "'" + v.replace("'", "''") + "'"
    if isinstance(v, (bytes, bytearray)):
        return "X'" + v.hex() + "'"
    return str(v)


conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# Schema: all user tables and indexes (no SQLite internals)
with open(f"{OUT_DIR}/00_schema.sql", "w") as f:
    for (sql,) in cur.execute(
        "SELECT sql FROM sqlite_master "
        "WHERE type IN ('table', 'index') AND sql IS NOT NULL "
        "AND name NOT LIKE 'sqlite_%'"
    ):
        f.write(sql + ";\n")

tables = cur.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
).fetchall()

file_idx = 0
row_count = 0
out = None


def next_file():
    global out, file_idx, row_count
    if out:
        out.close()
    file_idx += 1
    out = open(f"{OUT_DIR}/data_{file_idx:04d}.sql", "w")
    row_count = 0


next_file()

for (table_name,) in tables:
    cols = [c[1] for c in cur.execute(f"PRAGMA table_info('{table_name}')")]
    col_list = ", ".join(f'"{c}"' for c in cols)
    batch = []

    for row in cur.execute(f'SELECT * FROM "{table_name}"'):
        batch.append(row)
        if len(batch) >= ROWS_PER_INSERT:
            vals = ", ".join("(" + ", ".join(sql_literal(v) for v in r) + ")" for r in batch)
            out.write(f'INSERT INTO "{table_name}" ({col_list}) VALUES {vals};\n')
            row_count += len(batch)
            batch = []
            if row_count >= ROWS_PER_FILE:
                next_file()

    if batch:
        vals = ", ".join("(" + ", ".join(sql_literal(v) for v in r) + ")" for r in batch)
        out.write(f'INSERT INTO "{table_name}" ({col_list}) VALUES {vals};\n')
        row_count += len(batch)
        if row_count >= ROWS_PER_FILE:
            next_file()

if out:
    out.close()

conn.close()
print(f"Generated schema + {file_idx} data files in {OUT_DIR}/")
