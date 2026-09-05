/// <reference types="bun-types" />
import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { Database } from "bun:sqlite";

const DB_PATH = new URL("../data/megatable.db", import.meta.url).pathname;

// Known fixture values sampled from the megatable
const KNOWN_PGS = "PGS000063"; // passes passFDR10p_qPGS, i2 ≈ 0
const KNOWN_PHECODE = "250.2"; // T2D — 3994 total rows, 1491 pass FDR
const HIGH_I2_PGS = "PGS002046"; // passFDR10p_qPGS=1, meta_qPGS_i2 ≥ 72 for all FDR-passing rows
const LOW_I2_THRESHOLD = 25;
const HIGH_I2_THRESHOLD = 50;

let db: Database;

beforeAll(() => {
  db = new Database(DB_PATH, { readonly: true });
});

afterAll(() => {
  db.close();
});

describe("schema", () => {
  test("associations table exists with expected columns", () => {
    const cols = new Set(
      db.query("PRAGMA table_info(associations)").all().map((r: any) => r.name),
    );
    for (const expected of [
      "phecode", "pgs",
      "passFDR10p_qPGS", "passFDR10p_bPGS", "bestPGS_qPGS", "bestPGS_bPGS",
      "Europe_qPGS_OR", "Europe_qPGS_pval",
      "Africa_top10pPGS_OR", "Africa_top10pPGS_pval",
      "meta_qPGS_FE_OR", "meta_qPGS_pMix",
      "meta_top10pPGS_FE_OR", "meta_top10pPGS_pMix",
      "meta_qPGS_i2", "meta_top10pPGS_i2",
      "avg_auc_pgs_qPGS", "avg_auc_pgs_top10pPGS",
      "ncase_meta", "ncontrol_meta",
      "phecode_domain", "preval_ccpm",
      "Nvar", "efo_id", "efo_label",
    ]) {
      expect(cols.has(expected), `missing column: ${expected}`).toBe(true);
    }
  });

  test("indices exist on pgs and phecode", () => {
    const names = db
      .query(
        "SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='associations'",
      )
      .all()
      .map((r: any) => r.name);
    expect(names).toContain("idx_pgs");
    expect(names).toContain("idx_phecode");
  });

  test("row count is in expected range", () => {
    const { n } = db.query("SELECT COUNT(*) AS n FROM associations").get() as {
      n: number;
    };
    expect(n).toBeGreaterThan(4_000_000);
    expect(n).toBeLessThan(8_000_000);
  });
});

describe("query by PGS ID", () => {
  test("returns rows for a known PGS", () => {
    const rows = db
      .query("SELECT * FROM associations WHERE pgs = ?")
      .all(KNOWN_PGS) as Record<string, unknown>[];
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => r.pgs === KNOWN_PGS)).toBe(true);
  });

  test("uses the pgs index (EXPLAIN QUERY PLAN)", () => {
    const plan = db
      .query("EXPLAIN QUERY PLAN SELECT * FROM associations WHERE pgs = ?")
      .all(KNOWN_PGS) as Array<{ detail: string }>;
    const detail = plan.map((r) => r.detail).join(" ");
    expect(detail.toLowerCase()).toMatch(/idx_pgs|index/);
  });

  test("FDR filter returns subset of PGS rows", () => {
    const { n: all } = db
      .query("SELECT COUNT(*) AS n FROM associations WHERE pgs = ?")
      .get(KNOWN_PGS) as { n: number };
    const { n: fdr } = db
      .query(
        "SELECT COUNT(*) AS n FROM associations WHERE pgs = ? AND passFDR10p_qPGS = 1",
      )
      .get(KNOWN_PGS) as { n: number };
    expect(fdr).toBeLessThanOrEqual(all);
  });

  test("i2 filter: continuous unit low heterogeneity", () => {
    const rows = db
      .query(
        `SELECT pgs, phecode, passFDR10p_qPGS, meta_qPGS_i2
         FROM associations
         WHERE pgs = ? AND passFDR10p_qPGS = 1 AND meta_qPGS_i2 < ?`,
      )
      .all(KNOWN_PGS, LOW_I2_THRESHOLD) as Array<{ meta_qPGS_i2: number }>;
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => r.meta_qPGS_i2 < LOW_I2_THRESHOLD)).toBe(true);
  });

  test("i2 filter excludes high-heterogeneity row", () => {
    const rows = db
      .query(
        `SELECT pgs, phecode, meta_qPGS_i2
         FROM associations
         WHERE pgs = ? AND passFDR10p_qPGS = 1 AND meta_qPGS_i2 < ?`,
      )
      .all(HIGH_I2_PGS, HIGH_I2_THRESHOLD) as Array<{ meta_qPGS_i2: number }>;
    expect(rows.length).toBe(0);
  });

  test("thresholded unit query (top10pPGS)", () => {
    const rows = db
      .query(
        `SELECT * FROM associations
         WHERE pgs = ? AND passFDR10p_bPGS = 1 AND meta_top10pPGS_i2 < ?`,
      )
      .all(KNOWN_PGS, LOW_I2_THRESHOLD) as Record<string, unknown>[];
    for (const row of rows) {
      expect(row.pgs).toBe(KNOWN_PGS);
      expect(row.passFDR10p_bPGS).toBe(1);
      expect(row.meta_top10pPGS_i2 as number).toBeLessThan(LOW_I2_THRESHOLD);
    }
  });
});

describe("query by phecode", () => {
  test("returns rows for a known phecode", () => {
    const rows = db
      .query("SELECT * FROM associations WHERE phecode = ?")
      .all(KNOWN_PHECODE) as Record<string, unknown>[];
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => r.phecode === KNOWN_PHECODE)).toBe(true);
  });

  test("uses the phecode index (EXPLAIN QUERY PLAN)", () => {
    const plan = db
      .query(
        "EXPLAIN QUERY PLAN SELECT * FROM associations WHERE phecode = ?",
      )
      .all(KNOWN_PHECODE) as Array<{ detail: string }>;
    const detail = plan.map((r) => r.detail).join(" ");
    expect(detail.toLowerCase()).toMatch(/idx_phecode|index/);
  });

  test("phecode with FDR filter returns fewer rows than unfiltered", () => {
    const { n: all } = db
      .query("SELECT COUNT(*) AS n FROM associations WHERE phecode = ?")
      .get(KNOWN_PHECODE) as { n: number };
    const { n: fdr } = db
      .query(
        "SELECT COUNT(*) AS n FROM associations WHERE phecode = ? AND passFDR10p_qPGS = 1",
      )
      .get(KNOWN_PHECODE) as { n: number };
    expect(fdr).toBeGreaterThan(0);
    expect(fdr).toBeLessThan(all);
  });

  test("phecode with i2 filter", () => {
    const rows = db
      .query(
        `SELECT pgs, phecode, meta_qPGS_i2
         FROM associations
         WHERE phecode = ? AND passFDR10p_qPGS = 1 AND meta_qPGS_i2 < ?`,
      )
      .all(KNOWN_PHECODE, LOW_I2_THRESHOLD) as Array<{ meta_qPGS_i2: number }>;
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => r.meta_qPGS_i2 < LOW_I2_THRESHOLD)).toBe(true);
  });

  test("phecode rows carry expected metadata columns", () => {
    const row = db
      .query("SELECT * FROM associations WHERE phecode = ? LIMIT 1")
      .get(KNOWN_PHECODE) as Record<string, unknown>;
    expect(row).toHaveProperty("phecode_domain");
    expect(row).toHaveProperty("preval_ccpm");
    expect(row).toHaveProperty("ncase_meta");
    expect(row).toHaveProperty("ncontrol_meta");
    expect(row).toHaveProperty("efo_label");
    expect(row).toHaveProperty("Nvar");
  });
});
