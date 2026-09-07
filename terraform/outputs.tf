output "d1_database_id" {
  description = "D1 database ID — paste into wrangler.toml database_id"
  value       = cloudflare_d1_database.megatable.id
}

output "pages_url" {
  description = "Cloudflare Pages production URL"
  value       = "https://${cloudflare_pages_project.app.name}.pages.dev"
}
