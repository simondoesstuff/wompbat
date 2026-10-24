# Manual TSV download validation — 2026-10-23

All 24 checked exports passed: 10 queries in Continuous mode with the
heterogeneity filter off and on, followed by two queries in Thresholded mode
with the filter off and on. No discrepancies were found between the downloaded
TSVs and the rendered result tables, accounting for UI formatting and rounding.

This record is reconstructed from session observations.

## Environment and procedure

- Built with `bun run build` and served with
  `bun run preview --host 127.0.0.1 --port 5187 --strictPort`.
- Used Google Chrome Dev at `http://localhost:5187`, clicking **Export TSV**
  for each state to test actual browser downloads.
- For the Continuous sample, used Python `Random(20261023)` to sample five
  files without replacement from each sorted `static/pgs/*.json` and
  `static/phecode/*.json` catalog. No sampled queries were substituted.
- Manually compared rendered-table screenshots with downloads at UI precision:
  row counts, identifiers, row order, labels, p-values, meta OR, both CI
  endpoints, I², AUC, and prevalence or CCPM variant count.
- Tested **Low Heterogeneity (I² < 20%)** off and on. Filtered exports matched
  the displayed subset and order, excluding I² ≥ 20% rows.
- Parsed downloads to check all nine fields against local static query data.
  Text and order matched; numeric comparisons used relative tolerance `1e-14`.
  Headers and nine-column TSV structure also passed.

Comparisons used the production preview. One duplicate download was excluded
from the 24 checked exports.

## Continuous mode: 10 sampled queries

Counts exclude headers. UI and TSV counts agreed for every state.

| Search direction | Query     | Filter off | Filter on |
| ---------------- | --------- | ---------: | --------: |
| PGS → phecodes   | PGS001370 |         20 |        11 |
| PGS → phecodes   | PGS001416 |         19 |        11 |
| PGS → phecodes   | PGS003673 |         11 |         6 |
| PGS → phecodes   | PGS001111 |         18 |        12 |
| PGS → phecodes   | PGS002568 |         20 |        11 |
| Phecode → PGS    | 500       |         20 |        15 |
| Phecode → PGS    | 374.2     |         20 |        10 |
| Phecode → PGS    | 714       |         20 |         5 |
| Phecode → PGS    | 514.2     |         20 |         4 |
| Phecode → PGS    | 172.21    |         20 |        12 |

Total: 20 exports and 285 data rows (188 unfiltered, 97 filtered).

## Thresholded mode: two follow-up queries

Selected one query from each search direction in the original sample.

| Search direction | Query     | Filter off | Filter on |
| ---------------- | --------- | ---------: | --------: |
| PGS → phecodes   | PGS001370 |         11 |         7 |
| Phecode → PGS    | 714       |         20 |        13 |

All four downloads matched the Thresholded UI and static data after rounding.

Total: four additional exports and 51 data rows. Combined with Continuous mode,
the checks covered 24 exports, 336 data rows, and 3,024 exported cells.

## Formatting observations and limits

- TSVs retain numeric precision; the UI rounds values, combines CI endpoints
  into one cell, and adds commas to variant counts. These differences were
  expected and did not indicate mismatched data.
- EFO labels are visually capitalized and have publication-year annotations
  in the UI. The TSV exports the label without the publication year.
- Download names are generic: `phecode_associations.tsv` for a PGS search and
  `pgs_associations.tsv` for a phecode search; they omit query, unit, and filter.
- This was a sampled export-consistency check, not independent validation of
  the underlying scientific dataset. The supplementary comparison used the
  same static query assets consumed by the app, not the source SQLite database.
- No empty-result cases appeared in the sample. Browser coverage was limited
  to Google Chrome Dev, and only two queries were checked in Thresholded mode.
