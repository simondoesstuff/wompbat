set dotenv-load

dev:
	bun dev

install:
	bun i

test:
	bun run test

tofu-init:
	cd terraform && tofu init

tofu-plan:
	cd terraform && tofu plan

tofu-apply:
	cd terraform && tofu apply

upload-db:
	#!/usr/bin/env bash
	set -euo pipefail
	for f in data/megatable_sql/*.sql; do
		echo "uploading $f..."
		bunx wrangler d1 execute ccpm-megatable --remote --file="$f" --yes
	done

alias i := install
alias d := dev
alias t := test
