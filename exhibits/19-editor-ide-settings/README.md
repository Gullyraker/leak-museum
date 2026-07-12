# Exhibit 19 — Editor / IDE settings

Files: `.vscode/settings.json`, `dataSources.local.xml` (JetBrains)

## Why this is catastrophic
IDE and extension config is auto-generated and quietly committed because
`.vscode/` and `.idea/` are easy to forget in `.gitignore`. Extensions (SQLTools,
Database Tools, REST Client, Remote SSH) persist live connection strings and
tokens into these files, and teammates commit them without realizing the
credentials rode along.

## Do this instead
- Gitignore `.idea/` and machine-specific `.vscode/*`; commit only a shared,
  secret-free `settings.json`/`extensions.json`.
- Store DB passwords in the OS keychain, not the data-source config.
- Use `${env:VAR}` references in REST-client / `.vscode` files, never literals.
