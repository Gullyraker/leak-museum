# Exhibit 10 — Terraform state and tfvars

Files: `terraform.tfstate`, `secrets.auto.tfvars`

## Why this is catastrophic
Terraform state records every resource attribute in plaintext — including
passwords Terraform generated for you. `*.auto.tfvars` is auto-loaded and often
holds the real secret values. Committing either leaks your whole infrastructure's
credentials.

## Do this instead
- Use a remote backend (S3 + DynamoDB, Terraform Cloud) with encryption and
  access control; never commit local state.
- Keep `*.tfvars` with secrets out of the repo; pass secrets via env
  (`TF_VAR_*`) or a secrets manager.
