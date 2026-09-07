variable "cloudflare_api_token" {
  description = "Cloudflare API token with D1 Edit and Cloudflare Pages Edit permissions"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type        = string
}
