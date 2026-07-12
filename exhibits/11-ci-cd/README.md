# Exhibit 11 — CI/CD workflow leaks

File: `deploy.yml.sample` (renamed so it does not execute)

## Why this is catastrophic
Hardcoding tokens in a workflow puts them in the repo; `run: env` (or `echo`ing a
secret) prints them into build logs, which are often world-readable on public
projects and retained for a long time.

## Do this instead
- Store secrets in the CI provider's encrypted secret store; reference them, do
  not inline them.
- Never print environment variables. Prefer OIDC to cloud providers so no
  long-lived key exists at all.
- Restrict which branches/PRs can access secrets.
