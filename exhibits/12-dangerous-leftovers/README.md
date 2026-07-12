# Exhibit 12 — Dangerous leftovers

Files: `.bash_history`, `config.php.bak`, `.env.swp`

## Why this is catastrophic
Secrets leak through files you forget exist: shell history with an exported API
key, editor swap files (`.swp`) holding the buffer of a secret file, and
`.bak`/`~` backups of a config you "cleaned up". Scanners and attackers look for
exactly these.

## Do this instead
- Add broad ignore rules: `*.bak`, `*~`, `*.swp`, `.*history`.
- Do not paste secrets into interactive shells; use `env`-file loaders that are
  git-ignored.
- Run a secret scanner across the whole tree, not just source files.
