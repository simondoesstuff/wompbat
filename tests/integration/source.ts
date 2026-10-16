import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

export type Query = {
  kind: "pgs" | "phecode";
  id: string;
};

function readSource(...args: string[]): string {
  return execFileSync(
    process.env.INTEGRATION_PYTHON ?? "python3",
    [
      "tests/integration/source.py",
      resolve(process.env.INTEGRATION_SOURCE_DB ?? "data/megatable.db"),
      ...args,
    ],
    { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
  );
}

export function queries(): Query[] {
  const configured = process.env.INTEGRATION_QUERY_COUNT ?? "5";
  const count = configured === "all" ? Infinity : Number(configured);

  if (configured !== "all" && (!Number.isSafeInteger(count) || count < 1)) {
    throw new Error(
      'INTEGRATION_QUERY_COUNT must be a positive integer or "all"',
    );
  }

  return (JSON.parse(readSource()) as Query[]).slice(0, count);
}

/** Produce source TSV after top-K selection and optional I² filtering. */
export function sourceResult(
  { kind, id }: Query,
  unit: string,
  filtered: boolean,
  k = 20,
): string {
  return readSource(kind, id, unit, String(filtered), String(k));
}
