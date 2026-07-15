# Do this instead — a secret-hygiene checklist

The opposite of every exhibit, in one place.

## Keep secrets out of git
- `.gitignore` the dangerous paths from commit one: `.env`, `*.pem`, `*.key`,
  `id_rsa`, `id_ed25519`, `.aws/`, `*service-account*.json`, `*.tfstate`,
  `.netrc`, `.pgpass`, `.git-credentials`, `*.bak`, `*~`, `*.swp`,
  `claude_desktop_config.json`, `.cursor/mcp.json` (unless it holds only
  `${VAR}` references).
- Commit a `.env.example` with names and empty values — never the real `.env`.
- Read secrets from environment variables or a secret manager at runtime.

## Use the right storage
- Secret managers / KMS: HashiCorp Vault, AWS/GCP/Azure secret managers,
  1Password, Doppler.
- Encrypt-in-repo only with tools built for it: SOPS (+ age/KMS), git-crypt,
  Sealed Secrets for Kubernetes. Base64 is NOT encryption.
- Prefer short-lived, least-privilege credentials and OIDC over long-lived keys.

## Block leaks before they happen
- Pre-commit hook with a scanner: gitleaks or trufflehog.
- Enable your host's push protection (GitHub secret scanning push protection).
- Scan the whole tree and history in CI, not just source files.

## When a secret is committed anyway
1. Rotate it immediately — deletion does not undo exposure.
2. Remove from the tree, add `.gitignore` rules.
3. Rewrite history with `git filter-repo` / BFG if required, force-push,
   re-clone everywhere.

## Handy references
- gitleaks: https://github.com/gitleaks/gitleaks
- trufflehog: https://github.com/trufflesecurity/trufflehog
- git-filter-repo: https://github.com/newren/git-filter-repo
- SOPS: https://github.com/getsops/sops
