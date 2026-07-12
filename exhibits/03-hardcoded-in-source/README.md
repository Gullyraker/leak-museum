# Exhibit 03 — Secrets hardcoded in source

Files: `config.js`, `settings.py`

## Why this is catastrophic
Putting keys directly in code means the secret ships everywhere the code goes:
the repo, every fork, every build artifact, every developer's laptop. It also
guarantees the secret shows up in `git blame` and diffs forever.

## Do this instead
- Read secrets from environment variables or a secrets manager.
- Keep config code free of literal keys; commit only names/placeholders.
- Add a pre-commit secret scanner (gitleaks / trufflehog) so a hardcoded key is
  blocked before it is ever committed.
