# Exhibit 09 — Package registry and auth tokens

Files: `.npmrc`, `.pypirc`, `.netrc`, `docker-config.json`, `.git-credentials`

## Why this is catastrophic
These files hold publish/auth tokens. A leaked npm/PyPI token lets an attacker
push a malicious version of your package to every user — a supply-chain attack.
`.git-credentials` stores your git password/token in the clear.

## Do this instead
- Keep these dotfiles out of the repo; use per-project env vars or CI secrets.
- Prefer short-lived, scoped tokens and OIDC-based "trusted publishing".
- Use a credential helper (osxkeychain, libsecret) instead of `.git-credentials`.
