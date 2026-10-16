import { describe, expect, test } from "bun:test";
import { compareExport } from "./compare";

const header = "Phecode\tPhenotype Name\tP-Value\tCI Lower\tCCPM Variants";
const tsv = `${header}\n250.2\tDiabetes\t1e-100\t1.25\t42`;

describe("TSV comparison", () => {
  test("accepts exact text, equivalent numbers, CRLF, and header-only exports", () => {
    compareExport(tsv.replace(/\n/g, "\r\n") + "\r\n", tsv);
    compareExport(tsv.replace("1e-100", "1.0e-100"), tsv);
    compareExport(header, header);
  });

  test("preserves numeric-looking IDs and exact labels", () => {
    for (const actual of [tsv.replace("250.2", "250.20"), tsv.replace("Diabetes", "diabetes")]) {
      expect(() => compareExport(actual, tsv)).toThrow();
    }
  });

  test("rejects incorrect tiny p-values, blank cells, and nonfinite numbers", () => {
    for (const value of ["0", "1.1e-100", "", "NaN", "Infinity"]) {
      expect(() => compareExport(tsv.replace("1e-100", value), tsv)).toThrow("P-Value");
    }
  });

  test("uses relative tolerance for numeric fields and wider tolerance for CIs", () => {
    compareExport(tsv.replace("1e-100", "1.0000000000001e-100"), tsv);
    compareExport(tsv.replace("1.25", "1.2505"), tsv);
    expect(() => compareExport(tsv.replace("1.25", "1.26"), tsv)).toThrow("CI Lower");
    expect(() => compareExport(tsv.replace("42", "42.000000000001"), tsv)).toThrow("CCPM Variants");
  });

  test("accepts empty CI bounds only when the source also has empty bounds", () => {
    const empty = tsv.replace("1.25", "");
    compareExport(empty, empty);
    expect(() => compareExport(tsv, empty)).toThrow("CI Lower");
    expect(() => compareExport(empty, tsv)).toThrow("CI Lower");
  });

  test("rejects header, row count, column count, and row order mismatches", () => {
    for (const actual of [tsv.replace("Phecode", "Wrong"), header, `${tsv}\nextra`, `${tsv}\textra`]) {
      expect(() => compareExport(actual, tsv)).toThrow();
    }
    const second = "401.1\tHypertension\t1e-99\t1.3\t43";
    expect(() => compareExport(`${header}\n${second}\n${tsv.split("\n")[1]}`, `${tsv}\n${second}`)).toThrow();
  });
});
