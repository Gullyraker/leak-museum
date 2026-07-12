# Exhibit 01 — The committed `.env`

Files: `.env`, `.env.production`

## Why this is catastrophic
`.env` files hold exactly the values that must never enter version control:
database URLs with passwords, signing secrets, third-party API keys. Committing
one hands every past and future collaborator (and anyone who clones a public
repo) a working set of credentials. `.env.production` is worse — it leaks the
keys to your live systems.

## Do this instead
- Add `.env` to `.gitignore` from commit one. Commit a `.env.example` with keys
  and empty/placeholder values only.
- Load secrets from the environment or a secret manager at runtime.
- If it was ever committed, rotate every value — deleting the file does not
  remove it from history (see exhibit 14).
