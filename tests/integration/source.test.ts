import { test, expect } from "bun:test";
import { Database } from "bun:sqlite";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sourceResult } from "./source";

test("source emits top-K TSV, then filters I² without refilling", () => {
  const directory = mkdtempSync(join(tmpdir(), "ccpm-source-"));
  const previous = process.env.INTEGRATION_SOURCE_DB;
  const path = join(directory, "source.db");
  const db = new Database(path);
  try {
    db.run(`CREATE TABLE associations (
      pgs TEXT, phecode TEXT, passFDR10p_qPGS INTEGER,
      meta_qPGS_FE_OR REAL, meta_qPGS_pMix REAL, meta_qPGS_i2 REAL,
      avg_auc_pgs_qPGS REAL, preval_ccpm REAL, Nvar INTEGER, efo_label TEXT
    )`);
    db.run("CREATE TABLE phecode_defs (phecode TEXT, phenotype TEXT)");
    const insert = db.prepare(
      "INSERT INTO associations VALUES ('PGS1', ?, ?, 1.2, ?, ?, .7, .1, 42, 'label')",
    );
    insert.run("250.2", 1, 0.01, 19.999);
    insert.run("401.1", 1, 0.02, 20);
    insert.run("500.1", 1, 0.03, 0);
    insert.run("600.1", 0, 0.001, 0);
    db.run("INSERT INTO phecode_defs VALUES ('250.2', 'Diabetes')");
    process.env.INTEGRATION_SOURCE_DB = path;

    const query = { kind: "pgs" as const, id: "PGS1" };
    const unfiltered = sourceResult(query, "continuous", false, 2)
      .trimEnd().split("\n");
    const filtered = sourceResult(query, "continuous", true, 2)
      .trimEnd().split("\n");
    expect(unfiltered[0]).toBe(
      "Phecode\tPhenotype Name\tMeta OR\tCI Lower\tCI Upper\tP-Value\tI2\tAUC\tPrevalence",
    );
    expect(unfiltered.slice(1).map((row) => row.split("\t")[0])).toEqual([
      "250.2", "401.1",
    ]);
    expect(unfiltered[1].split("\t").slice(0, 2)).toEqual(["250.2", "Diabetes"]);
    expect(filtered).toEqual(unfiltered.slice(0, 2));
    expect(sourceResult(query, "continuous", false, 0).trimEnd()).toBe(unfiltered[0]);
  } finally {
    db.close();
    if (previous === undefined) delete process.env.INTEGRATION_SOURCE_DB;
    else process.env.INTEGRATION_SOURCE_DB = previous;
    rmSync(directory, { recursive: true });
  }
});
