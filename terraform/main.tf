terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_d1_database" "megatable" {
  account_id = var.cloudflare_account_id
  name       = "ccpm-megatable"
}

resource "cloudflare_pages_project" "app" {
  account_id        = var.cloudflare_account_id
  name              = "wompbat"
  production_branch = "main"

  build_config = {
    build_command   = "bun install && bun run build"
    destination_dir = ".svelte-kit/cloudflare"
  }

  deployment_configs = {
    preview = {
      compatibility_date = "2025-01-01"
      d1_databases = {
        DB = { id = cloudflare_d1_database.megatable.id }
      }
    }
    production = {
      compatibility_date = "2025-01-01"
      d1_databases = {
        DB = { id = cloudflare_d1_database.megatable.id }
      }
    }
  }
}
