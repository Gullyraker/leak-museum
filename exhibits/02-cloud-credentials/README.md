# Exhibit 02 — Cloud provider credentials

Files: `.aws/credentials`, `gcp-service-account.json`

## Why this is catastrophic
A leaked cloud key is a leaked cloud account. AWS access keys and GCP
service-account JSON files can spin up resources (crypto miners are the classic
abuse), read your data, and rack up huge bills within minutes of exposure.
Bots scan public GitHub for these patterns continuously.

## Do this instead
- Never put long-lived keys in files. Use short-lived credentials: AWS IAM
  roles / SSO / OIDC, GCP Workload Identity Federation.
- Keep `~/.aws/` and `*service-account*.json` out of every repo via `.gitignore`.
- Scope keys to least privilege and rotate on any suspicion.
