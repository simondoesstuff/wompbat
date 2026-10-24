# WOMPBAT

A frontend for exploring polygenic score (PGS)–phecode associations produced by
researchers at the Colorado Center for Personalized Medicine (CCPM) and the
University of Colorado Anschutz Medical Campus.

**Production:** [wompbat.simonwalker.tech](https://wompbat.simonwalker.tech)

The underlying data and scientific analyses are described in:

> Meng Lin et al. (2026). _The landscape of polygenic score prediction accuracy
> and transportability across the phenome in ancestrally diverse populations._
> medRxiv preprint. [Read the paper](https://www.medrxiv.org/content/10.64898/2026.10.08.26365087v1).

This repository provides the browser interface and helpers that package the
research results for display. Refer to the paper for study methods and
interpretation, and cite it when using the underlying research.

## Explore the data

- Search by PGS ID or trait, or by phecode or phenotype name.
- Switch between continuous and thresholded PGS results.
- Inspect association tables, ancestry-specific effects, forest plots, and case rates.
- Filter for low heterogeneity (I² < 20) and download results as TSV.

The site serves precomputed results: by default, up to 20 FDR-passing associations
per query and PGS unit, ranked by mixed-model p-value. The heterogeneity filter
applies to those results without filling in additional rows.

## Local development

Use Bun and Snakemake. The optional [Nix](https://nixos.org/) development shell
provides both, along with `just`:

```sh
nix develop
```

Install dependencies and generate the query assets from the committed data cache:

```sh
bun install --frozen-lockfile
gunzip -k data/precomputed.json.gz
snakemake --snakefile workflow/Snakefile --cores all static/pgs static/phecode
bun run dev
```

Decompress the cache once on a fresh checkout; if `data/precomputed.json` already
exists, skip that step. Snakemake consumes this intermediate file when splitting
the cache into query assets.

The frontend uses SvelteKit, Svelte 5, TypeScript, UnoCSS, and svelteplot. It fetches
static JSON files from `static/pgs/` and `static/phecode/`. Autocomplete reads the
committed `static/autocomplete.db` in the browser using sql.js; `bun install`
copies its WebAssembly runtime into `static/`. No backend service or credentials
are needed to run the frontend.

## Build and deploy

```sh
bun run build
bun run preview
```

or `just dev`

Generate the query assets first, as above. SvelteKit's static adapter writes the
site to `build/`.

Pushes to `main` trigger the [deployment workflow](.github/workflows/deploy.yml),
which expands the committed cache, generates the static query assets, builds the
app, and deploys to GitHub Pages. Production is served at
[wompbat.simonwalker.tech](https://wompbat.simonwalker.tech).

## Validation

```sh
bun run check
bun run test
bunx playwright install chromium
bun run test:integration
```

The database tests and browser integration suite require `data/megatable.db`;
the browser suite also requires generated query assets. Integration tests compare
downloaded TSVs against independent queries of that source database. To check
production:

```sh
INTEGRATION_BASE_URL=https://wompbat.simonwalker.tech bun run test:integration
```

See the [integration test guide](tests/integration/README.md) for prerequisites,
query counts, comparison rules, and reports.

## Data preparation

Frontend development uses the committed `data/precomputed.json.gz` cache and
`static/autocomplete.db`. Rebuilding them requires the research data locally;
the source megatable and `data/megatable.db` are excluded from Git.

The [Snakemake workflow](workflow/Snakefile) includes helpers to build the SQLite
database (`build_ccpm_db`), precompute browser results (`build_precomputed_index`),
compress the cache (`compress_precomputed_index`), split query assets
(`split_precomputed_index`), and rebuild autocomplete (`build_autocomplete_db`).
These package existing research outputs for the viewer. Column mappings are
documented in [docs/columns.md](docs/columns.md).
