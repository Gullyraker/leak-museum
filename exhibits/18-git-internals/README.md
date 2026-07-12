# Exhibit 18 — Secrets inside git internals

Files: `dot-git-config.sample`, `hooks/pre-push.sample`

## Why this is catastrophic
Secrets hide inside `.git/` itself. (1) `git remote add origin
https://<token>@github.com/...` writes the credential into `.git/config` in
plaintext — and people paste that file into gists, issues, and backups. (2) Git
hooks are ordinary scripts developers stuff tokens into for "quick" deploys.
`.git/` is not committed, but it is copied by `cp -r`, captured in archives, and
shipped when someone deploys a whole working tree.

## Do this instead
- Never embed credentials in remote URLs; use a credential helper
  (`git credential-osxkeychain`, `gh auth`) or SSH keys.
- Keep hook logic secret-free — read tokens from the environment at run time.
- Do not deploy or archive the `.git` directory.
