# The good example — the same project, done right

This is how the exhibits should have been handled. The secrets live outside git;
the repo commits only names, placeholders, and the tooling that keeps real
secrets out.

- `.env.example` — keys with placeholder values, safe to commit. The real `.env`
  is git-ignored.
- `config.js` — reads every secret from `process.env`, no literals.
- `.gitignore` — actually ignores the dangerous paths.
- `.pre-commit-config.yaml` — runs a secret scanner before every commit.

See `../DO-THIS-INSTEAD.md` for the full checklist.
