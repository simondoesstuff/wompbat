dev:
	bun dev

install:
	bun i
	uv sync

test:
	bun run test

alias i := install
alias d := dev
alias t := test
