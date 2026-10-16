# Browser TSV versus on-disk data

The suite opens query URLs in Chromium and compares downloaded TSVs with
independent, read-only queries against `data/megatable.db`. Each query checks
both units and the heterogeneity filter off/on.
It uses no mocked responses, production mapping functions, or JSON expectations.
`web-vs-source.pw.ts` handles browser actions and requires a successful query-data
response so a failed request cannot pass as an empty result. `compare.ts` checks
the downloaded TSV against top-K TSV expectations from `source.py`.

Prerequisites: Bun, Node.js, Python 3.8+ (standard library only), the source
database, and generated static query assets. Generate missing data with the
existing Snakemake rules (`build_ccpm_db`, then `split_precomputed_index`).
Tests use existing assets so stale or incorrect artifacts fail the comparison.

```sh
bun install
bunx playwright install chromium

# Build and serve a local preview; check 5 queries (20 downloads).
bun run test:integration

# Set the total number of queries, or check every source ID.
INTEGRATION_QUERY_COUNT=20 bun run test:integration
INTEGRATION_QUERY_COUNT=all bun run test:integration

# Check a deployment without starting a local server.
INTEGRATION_BASE_URL=https://your-deployment.example bun run test:integration

# Optional source database / Python overrides.
INTEGRATION_SOURCE_DB=/absolute/path/megatable.db INTEGRATION_PYTHON=python3 bun run test:integration

bun run test:integration:report
```

Queries alternate between sorted PGS IDs and sorted phecodes from the source,
continuing with the remaining direction when one runs out. The count must be a
positive integer or `all`; counts above the catalog size check the whole catalog.
Runs use one worker to limit site load. `bun test` runs source/comparator unit
tests and database tests; it does not run Chromium.

See the [full-catalog run results](../../docs/integration-test-results.md).

The comparison checks FDR-passing rows ranked by the unit's mixed-model p-value,
the first 20 rows, then optionally I² < 20 with no refill. The source helper
produces the expected TSV directly using the same SQL ordering and limit as the
static-data query. Rows, including ties, must match that source order; there is
no separate tie-selection or membership-matching logic.

Headers, text, membership, order, and counts are exact. Numeric fields use relative
tolerance `1e-12` with no absolute floor; variant counts are exact. CIs use an
independent Python `NormalDist` calculation with 0.1% tolerance for the production
approximation, including its tail floor and clamp. This checks export consistency,
not the scientific validity of pairing FE OR with a mixed-model p-value or the
raw-data-to-SQLite ingestion.

TSVs, source expectations, reports, and failure traces/screenshots are saved under
ignored `data/integration-test-results/`. Field differences appear in assertion
failures. The suite does not check rounded table cells, charts, autocomplete, or
cross-links. It is not part of deployment CI because CI lacks the source database.
