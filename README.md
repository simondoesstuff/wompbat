# phescore viewer

SvelteKit app hosted on Cloudflare Pages with a D1 database backend.

## Prerequisites

- [bun](https://bun.sh)
- [just](https://just.systems)
- [OpenTofu](https://opentofu.org) (`tofu`)
- [snakemake](https://snakemake.readthedocs.io) (for one-time DB build)
- [wrangler](https://developers.cloudflare.com/workers/wrangler/) (`bunx wrangler` works)

## Local development

```sh
cp .env.example .env   # fill in credentials (see Infrastructure below)
just install
snakemake build_local_d1 --cores all   # seeds local miniflare D1 — one time per machine
just dev
```

## Infrastructure (one-time)

Fill in `.env` with a Cloudflare API token (needs **D1: Edit** and **Cloudflare Pages: Edit** permissions) and your account ID. See `.env.example` for the full template — both `TF_VAR_*` (Terraform) and `CLOUDFLARE_*` (wrangler) names are needed:

Provision the D1 database and Pages project:

```sh
just tofu-init
just tofu-apply
```

Copy the printed `d1_database_id` into `wrangler.toml` under `database_id`.

### Build and upload the database (one-time)

D1 requires a SQL dump split into chunks — a single multi-million-row import hits the
API session limit. Chunks are 100k rows each:

```sh
snakemake build_ccpm_db --cores all       # produces data/megatable.db
snakemake dump_megatable_sql --cores all  # produces data/megatable_sql/{00_schema,data_??}.sql
just upload-db                            # uploads schema then each chunk; stops on first error
```

## Continuous deployment

Push to `main` — GitHub Actions builds the app and deploys to Cloudflare Pages via wrangler. No database operations run in CI.

Add these two secrets to the GitHub repo settings:

| Secret                  | Value                             |
| ----------------------- | --------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Same token as above (Pages: Edit) |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID        |
