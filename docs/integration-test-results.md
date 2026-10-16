# Integration test results — 2026-10-23

Full-catalog run against a local production preview:

```sh
INTEGRATION_QUERY_COUNT=all bun run test:integration
```

**5,433 queries passed; 0 failures.** Checked 21,732 browser TSV downloads
across both units and both heterogeneity filter states. Runtime: about 1.1 hours.

Downloads matched independently generated top-20 TSVs from `data/megatable.db`.
Text and row order matched exactly; numeric fields used relative tolerance
`1e-12`, CI bounds `1e-3`, and variant counts matched exactly. Non-numeric fields
matched literally.

Reports and downloads are under ignored `data/integration-test-results/`. See the
[suite README](../tests/integration/README.md) for setup and comparison rules.
