# Column Subset for the CCPM Browser

Reference for which columns from `all_megatable_v2_w_header.txt.gz` (137 columns, 5.7 M rows) the browser uses, and how they map to the TypeScript types in `src/lib/types.ts`.

The two PGS units share the same column structure with different suffixes:
- **continuous** → `_qPGS`
- **thresholded** → `_top10pPGS`

The six ancestry groups encoded in column names:
`Africa` · `America` · `Central_South_Asian` · `East_Asian` · `Europe` · `Middle_East`  
(mapped in the app to `AFR` · `AMR` · `CSA` · `EAS` · `EUR` · `MLE`)

---

## Tier 1 — Used in the current UI

### Identifiers

| Column | Type | Maps to |
|--------|------|---------|
| `phecode` | char | `PhecodeRow.phecodeId`, `PhecodeInfo.phecodeId` |
| `pgs` | char | `PgsRow.pgsId`, `PgsInfo.pgsId` |

### Significance & ranking

| Column | Type | Use |
|--------|------|-----|
| `passFDR10p_qPGS` | 0/1 | FDR filter for continuous unit |
| `passFDR10p_bPGS` | 0/1 | FDR filter for thresholded unit |
| `bestPGS_qPGS` | 0/1 | Flag: best PGS for this trait (continuous) |
| `bestPGS_bPGS` | 0/1 | Flag: best PGS for this trait (thresholded) |

### Per-ancestry association (× 6 ancestries, × 2 units = 24 columns)

Pattern: `{Ancestry}_{unit}_OR` and `{Ancestry}_{unit}_pval`

| Example columns | Maps to |
|-----------------|---------|
| `Europe_qPGS_OR`, `Europe_qPGS_pval` | `AncestryEffect.or` + `AncestryEffect.ci_lower/ci_upper` (CI derived) |
| `Africa_top10pPGS_OR`, `Africa_top10pPGS_pval` | same pattern for thresholded unit |

CI bounds are **not stored** in the megatable. They are derived in the API layer:

```
SE  = |log(OR)| / Φ⁻¹(1 - p/2)
95% CI = exp(log(OR) ± 1.96 · SE)
```

See `deriveCI()` in `src/lib/utils.ts`.

### Meta-analysis summary (× 2 units)

| Column | Maps to |
|--------|---------|
| `meta_qPGS_FE_OR` | `PhecodeRow.metaOR` / `PgsRow.metaOR` (continuous) |
| `meta_top10pPGS_FE_OR` | same for thresholded |
| `meta_qPGS_pMix` | `PhecodeRow.pValue` / `PgsRow.pValue` (chosen p: FE or RE based on I²) |
| `meta_top10pPGS_pMix` | same for thresholded |
| `meta_qPGS_i2` | `PhecodeRow.i2` / `PgsRow.i2` (continuous) |
| `meta_top10pPGS_i2` | same for thresholded — drives the low-heterogeneity filter |

`meta_*_FE_OR` and `meta_*_pMix` are also the source for computing `ciLower`/`ciUpper` on the row types (via `deriveCI`).

### Average AUC (× 2 units)

| Column | Maps to |
|--------|---------|
| `avg_auc_pgs_qPGS` | `PhecodeRow.auc` / `PgsRow.auc` (continuous) |
| `avg_auc_pgs_top10pPGS` | same for thresholded |

### Sample sizes (14 columns)

| Columns | Maps to |
|---------|---------|
| `ncase_{Ancestry}`, `ncontrol_{Ancestry}` (× 6) | `AncestryStats.cases` / `.sample` per ancestry |
| `ncase_meta`, `ncontrol_meta` | `PhecodeInfo.totalCases` / `.totalSample` |

### Phecode metadata

| Column | Maps to |
|--------|---------|
| `phecode_domain` | `PhecodeInfo.domain` |
| `preval_ccpm` | `PhecodeRow.prevalence` |

> **Note:** Phecode names (e.g. "Type 2 diabetes mellitus") are **not in the megatable**. They must come from a separate phecode reference lookup keyed on `phecode`.

### PGS metadata

| Column | Maps to |
|--------|---------|
| `Nvar` | `PgsInfo.ccpmVariants` / `PgsRow.ccpmVariants` |
| `efo_label` | `PgsInfo.corePhenotype`, `PgsRow.efoLabel` |
| `efo_id` | Construct `PgsInfo.catalogUrl`: `https://www.pgscatalog.org/score/{pgs}/` |

---

## Tier 2 — Useful for future table columns / filters

| Column | Description |
|--------|-------------|
| `prop_nvar` | Proportion of variants from score found in CCPM |
| `method_type2` | Scoring method: GWAS, P&T, Lasso-type, Ridge-type |
| `pubyear` | Publication year |
| `ngwas` | GWAS training sample size |
| `is_multi_gwas` | Whether the training GWAS was multi-ancestry |
| `Neths_qPGS`, `Neths_top10pPGS` | Number of ancestry groups analyzed |
| `phecode_3d` | 3-digit phecode grouping (for category browsing) |

---

## Skipped for MVP

| Group | Columns |
|-------|---------|
| Per-ancestry AUC (24 cols) | `{Ancestry}_auc_{pgs,all}_{unit}` — only averages needed |
| Non-EUR average AUC | `avg_noEUR_auc_*` |
| Advanced heterogeneity | `meta_*_Q`, `meta_*_tau2` |
| Random-effects stats | `meta_*_RE2_STAT1/2`, `meta_*_RE2_pval` |
| Population genetics | `avg_pwFst_*`, `wfst_*` |
| Variant quality | `cadd_mean`, `cadd_median`, `avg_maf_pgs` |
| Score construction | `method_sparse`, `ntrain`, `is_multi_training` |
| Statistical genetics | `sindex_gwas`, `sindex_training`, `var_preval_eths` |
| EFO metadata | `is_single_efo` |
