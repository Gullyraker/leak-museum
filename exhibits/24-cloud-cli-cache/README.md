# Exhibit 24 — Cloud CLI session cache

Files: `dot-config/gh/hosts.yml`, `dot-config/gcloud/application_default_credentials.json`

These live under `~/.config` / home, not the project — shown here with `dot-`
prefixes. They differ from exhibit 02 (static long-lived key files): these are
ambient, auto-created session caches people do not know exist.

## Why this is catastrophic
CLIs cache live session/refresh tokens in home-directory files (`~/.config/gh`,
`~/.config/gcloud`, `~/.azure`, `~/.databrickscfg`). These get swept into a repo
when someone `COPY . .` in a Dockerfile, commits their dotfiles, or archives a
home dir — capturing tokens that are often still valid and grant the full scope
the user authorized.

## Do this instead
- Add home-dir credential paths to global gitignore and Docker `.dockerignore`;
  never `COPY` a whole home/context blindly.
- Prefer short-lived, auto-refreshed auth (workload identity / OIDC).
- Run `gh auth logout` / `gcloud auth revoke` on shared machines; scan build
  contexts for `~/.config`, `.azure`, `.netrc`.
