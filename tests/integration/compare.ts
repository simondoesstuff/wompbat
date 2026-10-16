import assert from "node:assert/strict";

function parseTsv(text: string): string[][] {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n$/, "")
    .split("\n")
    .map((line) => line.split("\t"));
}

/**
 * Compare exported and source top-K TSVs in order.
 * Headers and the first two columns (IDs and labels) match exactly, as do empty
 * cells. Remaining columns are numeric: relative tolerance is 1e-12, or 1e-3
 * for CI bounds; variant counts are exact. No absolute tolerance floor is used.
 * Throws AssertionError on the first mismatch, including blank/nonfinite numbers.
 */
export function compareExport(actualTsv: string, expectedTsv: string): void {
  const [headers, ...actual] = parseTsv(actualTsv);
  const [expectedHeaders, ...expected] = parseTsv(expectedTsv);
  assert.deepEqual(headers, expectedHeaders, "TSV headers");
  assert.equal(actual.length, expected.length, "TSV row count");

  for (const [index, cells] of actual.entries()) {
    assert.equal(
      cells.length,
      headers.length,
      `Row ${index + 1}: column count`,
    );
    for (const [col, value] of expected[index].entries()) {
      const cell = cells[col];
      const field = headers[col];
      const label = `Row ${index + 1}, ${field}`;

      if (col < 2 || value === "") {
        assert.equal(cell, value, label);
        continue;
      }

      const number = cell.trim() ? Number(cell) : NaN;
      const expectedNumber = value.trim() ? Number(value) : NaN;
      const tolerance =
        field === "CCPM Variants"
          ? 0
          : Math.abs(expectedNumber) * (field.startsWith("CI ") ? 1e-3 : 1e-12);
      assert(
        Number.isFinite(number) &&
          Number.isFinite(expectedNumber) &&
          Math.abs(number - expectedNumber) <= tolerance,
        `${label}: expected ${value}, got ${JSON.stringify(cell)}`,
      );
    }
  }
}
