# leak-museum

> A guided tour of how NOT to manage secrets in git. Every "exhibit" is a real anti-pattern, planted with fake credentials, paired with why it is catastrophic and what to do instead.

> [!WARNING]
> This repository is **intentionally insecure** and exists for education and for
> testing secret scanners. **Every credential here is fake** — a documented
> example value, a throwaway demo key generated for this repo, or an obvious
> placeholder. None has ever been valid. Do not report them to any bug-bounty
> program. Do not copy these patterns into a real project.

## What this is

`leak-museum` collects the classic ways developers leak secrets through git —
committed `.env` files, cloud keys, SSH/TLS private keys, database dumps,
Kubernetes `Secret` manifests, Terraform state, CI logs, and the leftovers you
forget about — into one walk-through. Each exhibit is a small directory with the
bad files and a `README.md` explaining the damage and the fix.

It doubles as a **test corpus for secret scanners**: point `gitleaks`,
`trufflehog`, or [`redact`](https://github.com/printemps-tokyo/redact) at it and
see how many of the planted secrets they catch (see [`PLANTED.md`](./PLANTED.md)).

## The exhibits

| # | Exhibit | The anti-pattern |
| --- | --- | --- |
| 01 | [dotenv](./exhibits/01-dotenv) | Committing `.env` / `.env.production` |
| 02 | [cloud-credentials](./exhibits/02-cloud-credentials) | AWS keys, GCP service-account JSON |
| 03 | [hardcoded-in-source](./exhibits/03-hardcoded-in-source) | Keys literal in code |
| 04 | [ssh-keys](./exhibits/04-ssh-keys) | Private key + internal host config |
| 05 | [tls-private-key](./exhibits/05-tls-private-key) | Committing `server.key` |
| 06 | [database](./exhibits/06-database) | SQL dump + `.pgpass` |
| 07 | [plaintext-passwords](./exhibits/07-plaintext-passwords) | The shared `passwords.txt` |
| 08 | [kubernetes](./exhibits/08-kubernetes) | `Secret` manifests (base64 is not encryption) |
| 09 | [package-registry-tokens](./exhibits/09-package-registry-tokens) | `.npmrc` / `.pypirc` / `.netrc` tokens |
| 10 | [terraform-state](./exhibits/10-terraform-state) | Plaintext `terraform.tfstate` |
| 11 | [ci-cd](./exhibits/11-ci-cd) | Hardcoded tokens, `env` dumped to logs |
| 12 | [dangerous-leftovers](./exhibits/12-dangerous-leftovers) | `.bash_history`, `.swp`, `.bak` |
| 13 | [dockerfile](./exhibits/13-dockerfile) | Secrets in `ENV`/`ARG`/`COPY .env` |
| 14 | [still-in-history](./exhibits/14-still-in-history) | "I deleted it" — but git history keeps it |
| 15 | [frontend-bundle](./exhibits/15-frontend-bundle) | Secrets in the JS bundle + source map |
| 16 | [mobile-app-secrets](./exhibits/16-mobile-app-secrets) | Firebase config + signing keystore |
| 17 | [jwt-weak-secret](./exhibits/17-jwt-weak-secret) | JWT signed with a weak/known secret |
| 18 | [git-internals](./exhibits/18-git-internals) | Token in `.git/config` / a git hook |
| 19 | [editor-ide-settings](./exhibits/19-editor-ide-settings) | `.vscode` / JetBrains connection strings |
| 20 | [dotnet-appsettings](./exhibits/20-dotnet-appsettings) | `appsettings.json` secrets |
| 21 | [rails-secrets](./exhibits/21-rails-secrets) | `master.key` + `secrets.yml` |
| 22 | [wordpress-wp-config](./exhibits/22-wordpress-wp-config) | `wp-config.php` creds + salts |
| 23 | [ansible-vault](./exhibits/23-ansible-vault) | Vault blob + committed weak password |
| 24 | [cloud-cli-cache](./exhibits/24-cloud-cli-cache) | Cached `gh`/`gcloud` session tokens |
| 25 | [encoded-not-encrypted](./exhibits/25-encoded-not-encrypted) | base64 mistaken for encryption |
| 26 | [api-debug-artifacts](./exhibits/26-api-debug-artifacts) | HAR / Postman / `.http` with live auth |
| 27 | [ai-tool-configs](./exhibits/27-ai-tool-configs) | API keys inline in `.mcp.json` / Claude / Cursor configs |

The [`good-example/`](./good-example) directory shows the same project done
right, and [`DO-THIS-INSTEAD.md`](./DO-THIS-INSTEAD.md) is the checklist.

## Exhibits in full

The full text of every exhibit is reproduced below (the same content also lives
in each exhibit's own `README.md`) so the whole museum is searchable and
readable at a glance on this page.

### 01 — The committed `.env`

Directory: [`exhibits/01-dotenv`](./exhibits/01-dotenv) — Files: `.env`, `.env.production`

Why this is catastrophic: `.env` files hold exactly the values that must never
enter version control: database URLs with passwords, signing secrets, third-party
API keys. Committing one hands every past and future collaborator (and anyone who
clones a public repo) a working set of credentials. `.env.production` is worse —
it leaks the keys to your live systems.

Do this instead:
- Add `.env` to `.gitignore` from commit one. Commit a `.env.example` with keys
  and empty/placeholder values only.
- Load secrets from the environment or a secret manager at runtime.
- If it was ever committed, rotate every value — deleting the file does not
  remove it from history (see exhibit 14).

### 02 — Cloud provider credentials

Directory: [`exhibits/02-cloud-credentials`](./exhibits/02-cloud-credentials) — Files: `.aws/credentials`, `gcp-service-account.json`

Why this is catastrophic: A leaked cloud key is a leaked cloud account. AWS
access keys and GCP service-account JSON files can spin up resources (crypto
miners are the classic abuse), read your data, and rack up huge bills within
minutes of exposure. Bots scan public GitHub for these patterns continuously.

Do this instead:
- Never put long-lived keys in files. Use short-lived credentials: AWS IAM
  roles / SSO / OIDC, GCP Workload Identity Federation.
- Keep `~/.aws/` and `*service-account*.json` out of every repo via `.gitignore`.
- Scope keys to least privilege and rotate on any suspicion.

### 03 — Secrets hardcoded in source

Directory: [`exhibits/03-hardcoded-in-source`](./exhibits/03-hardcoded-in-source) — Files: `config.js`, `settings.py`

Why this is catastrophic: Putting keys directly in code means the secret ships
everywhere the code goes: the repo, every fork, every build artifact, every
developer's laptop. It also guarantees the secret shows up in `git blame` and
diffs forever.

Do this instead:
- Read secrets from environment variables or a secrets manager.
- Keep config code free of literal keys; commit only names/placeholders.
- Add a pre-commit secret scanner (gitleaks / trufflehog) so a hardcoded key is
  blocked before it is ever committed.

### 04 — SSH keys and config

Directory: [`exhibits/04-ssh-keys`](./exhibits/04-ssh-keys) — Files: `id_ed25519` (PRIVATE KEY), `id_ed25519.pub`, `config`, `known_hosts`

Note: the private key here was generated fresh for this museum and is used
nowhere. Never commit a real one.

Why this is catastrophic: A committed private key is a committed identity —
anyone with the file can log in as you. The `config` and `known_hosts` files
additionally leak your internal hostnames, bastions, and usernames, which is a
gift to an attacker mapping your network.

Do this instead:
- Keep `~/.ssh/` out of every repo. Private keys never belong in git.
- Protect keys with a passphrase and prefer per-host, short-lived certificates.
- If a private key leaks, remove the key from every `authorized_keys` and
  generate a new one; rotation is the only real fix.

### 05 — TLS private key

Directory: [`exhibits/05-tls-private-key`](./exhibits/05-tls-private-key) — Files: `server.key` (PRIVATE KEY), `server.crt`

The key here is a throwaway self-signed demo key.

Why this is catastrophic: The private half of a TLS certificate lets an attacker
impersonate your site and decrypt traffic. Committing `server.key` alongside the
cert defeats the entire point of TLS.

Do this instead:
- Store private keys in a secrets manager / KMS, never in the repo.
- Commit only the public certificate if anything, and issue certs automatically
  (ACME / Let's Encrypt) so keys stay on the server.
- On leak, revoke the certificate and reissue.

### 06 — Database dumps and `.pgpass`

Directory: [`exhibits/06-database`](./exhibits/06-database) — Files: `dump.sql`, `.pgpass`

Why this is catastrophic: A committed SQL dump leaks real user data (emails, and
here even plaintext passwords) plus the connection strings to reach the live
database. `.pgpass` stores database passwords in the clear.

Do this instead:
- Keep dumps and `.pgpass` out of the repo. Never store user passwords in
  plaintext — hash them with bcrypt/argon2.
- Take dumps to a secured, access-controlled location, not source control.
- Use connection strings assembled from environment variables at runtime.

### 07 — Plaintext password notes

Directory: [`exhibits/07-plaintext-passwords`](./exhibits/07-plaintext-passwords) — Files: `passwords.txt`, `wifi.txt`

Why this is catastrophic: The "shared team password file" is a single document
that compromises every account it lists. In a repo, it is copied to every clone
and preserved in history forever.

Do this instead:
- Use a real password manager (1Password, Bitwarden, KeePass) with sharing.
- Never keep credentials in a flat file in a repo.
- Turn on MFA so a leaked password alone is not enough.

### 08 — Kubernetes Secret manifests

Directory: [`exhibits/08-kubernetes`](./exhibits/08-kubernetes) — File: `secret.yaml`

Why this is catastrophic: The most common and dangerous misconception in
Kubernetes: `data:` values are base64-encoded, not encrypted.
`echo aHVudGVyMg== | base64 -d` gives back `hunter2` instantly. Committing a
`Secret` manifest is committing plaintext.

Do this instead:
- Never commit raw `Secret` manifests. Use Sealed Secrets, SOPS (with age/KMS),
  or an external secrets operator that pulls from Vault / cloud secret managers.
- Enable encryption at rest for etcd.

### 09 — Package registry and auth tokens

Directory: [`exhibits/09-package-registry-tokens`](./exhibits/09-package-registry-tokens) — Files: `.npmrc`, `.pypirc`, `.netrc`, `docker-config.json`, `.git-credentials`

Why this is catastrophic: These files hold publish/auth tokens. A leaked npm/PyPI
token lets an attacker push a malicious version of your package to every user — a
supply-chain attack. `.git-credentials` stores your git password/token in the
clear.

Do this instead:
- Keep these dotfiles out of the repo; use per-project env vars or CI secrets.
- Prefer short-lived, scoped tokens and OIDC-based "trusted publishing".
- Use a credential helper (osxkeychain, libsecret) instead of `.git-credentials`.

### 10 — Terraform state and tfvars

Directory: [`exhibits/10-terraform-state`](./exhibits/10-terraform-state) — Files: `terraform.tfstate`, `secrets.auto.tfvars`

Why this is catastrophic: Terraform state records every resource attribute in
plaintext — including passwords Terraform generated for you. `*.auto.tfvars` is
auto-loaded and often holds the real secret values. Committing either leaks your
whole infrastructure's credentials.

Do this instead:
- Use a remote backend (S3 + DynamoDB, Terraform Cloud) with encryption and
  access control; never commit local state.
- Keep `*.tfvars` with secrets out of the repo; pass secrets via env
  (`TF_VAR_*`) or a secrets manager.

### 11 — CI/CD workflow leaks

Directory: [`exhibits/11-ci-cd`](./exhibits/11-ci-cd) — File: `deploy.yml.sample` (renamed so it does not execute)

Why this is catastrophic: Hardcoding tokens in a workflow puts them in the repo;
`run: env` (or `echo`ing a secret) prints them into build logs, which are often
world-readable on public projects and retained for a long time.

Do this instead:
- Store secrets in the CI provider's encrypted secret store; reference them, do
  not inline them.
- Never print environment variables. Prefer OIDC to cloud providers so no
  long-lived key exists at all.
- Restrict which branches/PRs can access secrets.

### 12 — Dangerous leftovers

Directory: [`exhibits/12-dangerous-leftovers`](./exhibits/12-dangerous-leftovers) — Files: `.bash_history`, `config.php.bak`, `.env.swp`

Why this is catastrophic: Secrets leak through files you forget exist: shell
history with an exported API key, editor swap files (`.swp`) holding the buffer
of a secret file, and `.bak`/`~` backups of a config you "cleaned up". Scanners
and attackers look for exactly these.

Do this instead:
- Add broad ignore rules: `*.bak`, `*~`, `*.swp`, `.*history`.
- Do not paste secrets into interactive shells; use `env`-file loaders that are
  git-ignored.
- Run a secret scanner across the whole tree, not just source files.

### 13 — Secrets in a Dockerfile

Directory: [`exhibits/13-dockerfile`](./exhibits/13-dockerfile) — File: `Dockerfile`

Why this is catastrophic: `ENV` and `ARG` values, and any `COPY .env`, are baked
into image layers and visible via `docker history` to anyone who can pull the
image. The secret lives in the image forever, even if a later layer "deletes" it.

Do this instead:
- Use BuildKit secret mounts (`RUN --mount=type=secret`) so secrets never land
  in a layer.
- Inject runtime config as environment variables at `docker run` time or via an
  orchestrator's secret store.
- Keep `.env` out of the build context with `.dockerignore`.

### 14 — "I deleted it, so it's gone" (it isn't)

Directory: [`exhibits/14-still-in-history`](./exhibits/14-still-in-history)

This exhibit is built from the repository's own commit history, not just a file.
A file named `leaked_once.txt` containing an API key was added in one commit and
"removed" in a later commit. It is not in the current tree — but it is still in
history:

```bash
git log --oneline -- exhibits/14-still-in-history/leaked_once.txt
git show <the-adding-commit>:exhibits/14-still-in-history/leaked_once.txt
```

Why this is catastrophic: `git rm` (or deleting and committing) removes a file
from the latest snapshot, not from history. Every clone still carries the secret,
and anyone can read it with a one-line `git show`. This is the single most common
way "fixed" leaks stay exploitable.

Do this instead:
- Treat any committed secret as compromised: rotate it immediately. Rotation,
  not deletion, is the fix.
- To scrub history (after rotating), rewrite it with `git filter-repo` (or BFG),
  then force-push and have everyone re-clone.
- Prevent it up front with a pre-commit secret scanner and push protection.

### 15 — Secrets in the frontend bundle (and source maps)

Directory: [`exhibits/15-frontend-bundle`](./exhibits/15-frontend-bundle) — Files: `dist/app.min.js`, `dist/app.min.js.map`

Why this is catastrophic: Anything the browser needs, the browser receives. A
secret hardcoded (or put in a `VITE_`/`REACT_APP_`/`NEXT_PUBLIC_` variable) is
compiled into the JS and served publicly to every visitor. "It's minified" is not
protection: a committed `.map` source map de-minifies the bundle back to original
variable names and file paths, handing an attacker a labeled map of every
embedded key.

Do this instead:
- Only ship publishable/anon keys to the browser (Stripe `pk_`, Supabase anon).
  Every privileged call goes through a backend you control.
- Do not emit source maps to the web root in production (upload them privately to
  your error tracker instead).
- Scope any client-visible key server-side with allow-lists and rate limits.

### 16 — Mobile app secrets (Firebase + signing keystore)

Directory: [`exhibits/16-mobile-app-secrets`](./exhibits/16-mobile-app-secrets) — Files: `android/app/google-services.json`, `ios/GoogleService-Info.plist`, `android/app/release.keystore` (placeholder), `android/app/keystore.properties`

Why this is catastrophic: Mobile repos routinely commit the Firebase config (a
Google API key + project identifiers) and, far worse, the app-signing keystore
and its passwords. The keystore is the app's identity: leak it plus its password
and an attacker can sign malware as you and ship it to your users. A Firebase key
with lax Security Rules allows direct reads/writes to your backend.

Do this instead:
- Keep the keystore out of git; store it in the CI secret store / a KMS and
  inject at build time. Put signing passwords in environment secrets, not
  `gradle.properties`/`keystore.properties`.
- Treat `google-services.json` as low-sensitivity config, but back it with
  strict Firebase Security Rules and App Check so the key alone is useless.

### 17 — JWT signed with a weak/known secret

Directory: [`exhibits/17-jwt-weak-secret`](./exhibits/17-jwt-weak-secret) — Files: `auth.js`, `sample-token.txt`

Note: no secret scanner flags this — a generic HS256 secret and a JWT are not
"provider patterns". This exhibit shows a scanner is not a safety net.

Why this is catastrophic: Signing JWTs with `HS256` and a short, guessable, or
copied-from-a-tutorial secret means anyone who obtains a single token can
brute-force the secret offline in seconds (hashcat does exactly this), then forge
arbitrary tokens — e.g. `{"role":"admin"}` — and impersonate any user. Committing
the secret removes even the brute-force step. A related footgun is accepting
`alg: none`.

Do this instead:
- Use a long (>=32 bytes) random secret from a secret manager; rotate on leak.
- Prefer asymmetric `RS256`/`ES256` so verifiers never hold a signing key.
- Pin the expected `alg` on verification and reject `none`. Keep expirations short.

### 18 — Secrets inside git internals

Directory: [`exhibits/18-git-internals`](./exhibits/18-git-internals) — Files: `dot-git-config.sample`, `hooks/pre-push.sample`

Why this is catastrophic: Secrets hide inside `.git/` itself. (1) `git remote add
origin https://<token>@github.com/...` writes the credential into `.git/config`
in plaintext — and people paste that file into gists, issues, and backups. (2)
Git hooks are ordinary scripts developers stuff tokens into for "quick" deploys.
`.git/` is not committed, but it is copied by `cp -r`, captured in archives, and
shipped when someone deploys a whole working tree.

Do this instead:
- Never embed credentials in remote URLs; use a credential helper
  (`git credential-osxkeychain`, `gh auth`) or SSH keys.
- Keep hook logic secret-free — read tokens from the environment at run time.
- Do not deploy or archive the `.git` directory.

### 19 — Editor / IDE settings

Directory: [`exhibits/19-editor-ide-settings`](./exhibits/19-editor-ide-settings) — Files: `.vscode/settings.json`, `dataSources.local.xml` (JetBrains)

Why this is catastrophic: IDE and extension config is auto-generated and quietly
committed because `.vscode/` and `.idea/` are easy to forget in `.gitignore`.
Extensions (SQLTools, Database Tools, REST Client, Remote SSH) persist live
connection strings and tokens into these files, and teammates commit them without
realizing the credentials rode along.

Do this instead:
- Gitignore `.idea/` and machine-specific `.vscode/*`; commit only a shared,
  secret-free `settings.json`/`extensions.json`.
- Store DB passwords in the OS keychain, not the data-source config.
- Use `${env:VAR}` references in REST-client / `.vscode` files, never literals.

### 20 — .NET appsettings.json

Directory: [`exhibits/20-dotnet-appsettings`](./exhibits/20-dotnet-appsettings) — Files: `appsettings.json`, `appsettings.Development.json`

Why this is catastrophic: The .NET convention reads config from `appsettings*.json`,
and the default templates ship these files committed. Teams drop production
connection strings, an Azure Storage `AccountKey`, and service API keys straight
into them. Environment-suffixed variants (`.Development`, `.Production`) multiply
the exposure and are rarely gitignored.

Do this instead:
- Keep only non-secret defaults in `appsettings.json`.
- Use User Secrets (`dotnet user-secrets`) locally and environment variables /
  Azure Key Vault (`AddAzureKeyVault`) in deployed environments — the config
  system overlays them automatically.
- Gitignore any `appsettings.*.json` that holds real values.

### 21 — Rails master.key and secrets.yml

Directory: [`exhibits/21-rails-secrets`](./exhibits/21-rails-secrets) — Files: `config/master.key`, `config/credentials.yml.enc`, `config/secrets.yml`

Note: these are generic strings, so secret scanners do not flag them — another
"the scanner won't save you" case.

Why this is catastrophic: Rails encrypts `credentials.yml.enc`, but committing
`master.key` alongside it hands over the decryption key and makes the encryption
pointless. Older apps used `secrets.yml` with plaintext values people commit
directly. Leaking `secret_key_base` lets an attacker forge signed/encrypted
session cookies and, on vulnerable versions, achieve RCE via crafted cookies.

Do this instead:
- Gitignore `config/master.key` and `config/credentials/*.key`; deliver the key
  only via the `RAILS_MASTER_KEY` env in each environment.
- Rotate `secret_key_base` immediately on leak (invalidates sessions).
- Migrate `secrets.yml` literals into encrypted credentials with per-environment
  key files.

### 22 — WordPress wp-config.php

Directory: [`exhibits/22-wordpress-wp-config`](./exhibits/22-wordpress-wp-config) — File: `wp-config.php`

Note: WordPress DB creds and salts are not provider patterns, so scanners stay
quiet here.

Why this is catastrophic: WordPress's core config is a single PHP file at the web
root containing DB credentials and the auth salts. Guides tell people to edit and
commit it as-is, so it constantly lands in public repos and downloadable site
backups. DB creds give database access; leaked salts let an attacker forge auth
cookies and hijack logged-in sessions without the password.

Do this instead:
- Keep `wp-config.php` out of version control; commit only `wp-config-sample.php`.
- Load secrets from environment variables / a `.env` outside the web root.
- Regenerate salts from the WordPress secret-key API on any suspected leak;
  restrict DB users to least privilege and non-public hosts.

### 23 — Ansible Vault with a committed/weak password

Directory: [`exhibits/23-ansible-vault`](./exhibits/23-ansible-vault) — Files: `group_vars/all/vault.yml`, `.vault_pass`, `ansible.cfg`

Why this is catastrophic: Ansible Vault is only as strong as its password. Teams
commit the password file next to the encrypted vault "for CI convenience," or
pick a weak dictionary password. The AES256 blob is public in the repo, so a
leaked or guessable password decrypts every production secret — and weak
passwords fall to offline brute force since the ciphertext is right there.

Do this instead:
- Never commit the vault password; supply it at run time via
  `--vault-password-file` outside the repo, a script that pulls from a secret
  manager, or `ANSIBLE_VAULT_PASSWORD_FILE`.
- Use a long random password; rotate and re-key (`ansible-vault rekey`) on
  exposure. Consider a real secrets backend (HashiCorp Vault) over static files.

### 24 — Cloud CLI session cache

Directory: [`exhibits/24-cloud-cli-cache`](./exhibits/24-cloud-cli-cache) — Files: `dot-config/gh/hosts.yml`, `dot-config/gcloud/application_default_credentials.json`

These live under `~/.config` / home, not the project — shown here with `dot-`
prefixes. They differ from exhibit 02 (static long-lived key files): these are
ambient, auto-created session caches people do not know exist.

Why this is catastrophic: CLIs cache live session/refresh tokens in
home-directory files (`~/.config/gh`, `~/.config/gcloud`, `~/.azure`,
`~/.databrickscfg`). These get swept into a repo when someone `COPY . .` in a
Dockerfile, commits their dotfiles, or archives a home dir — capturing tokens
that are often still valid and grant the full scope the user authorized.

Do this instead:
- Add home-dir credential paths to global gitignore and Docker `.dockerignore`;
  never `COPY` a whole home/context blindly.
- Prefer short-lived, auto-refreshed auth (workload identity / OIDC).
- Run `gh auth logout` / `gcloud auth revoke` on shared machines; scan build
  contexts for `~/.config`, `.azure`, `.netrc`.

### 25 — "Encoded" is not "encrypted"

Directory: [`exhibits/25-encoded-not-encrypted`](./exhibits/25-encoded-not-encrypted) — Files: `credentials.b64`, `config.yml`

Why this is catastrophic: A pervasive misconception: base64 (or URL-encoding, or
an unsigned JWT payload) is not encryption. It is reversible with zero key —
`base64 -d` or any decoder reveals the plaintext instantly. People commit
"encoded" secrets, embed credentials in URLs, and trust base64'd config believing
it is protected. It is obfuscation at best, and scanners and attackers decode it
routinely.

Do this instead:
- Encode is not encrypt. Store secrets in a secret manager; for data at rest use
  real authenticated encryption (libsodium / AES-GCM) with a managed key.
- Never put credentials in URLs (they leak via logs, referrers, history).
- Treat any base64 / JWT-payload value in a repo as plaintext.

### 26 — API debug artifacts (HAR / Postman / .http)

Directory: [`exhibits/26-api-debug-artifacts`](./exhibits/26-api-debug-artifacts) — Files: `session.har`, `MyAPI.postman_environment.json`, `requests.http`

Why this is catastrophic: Debugging and API-testing tools produce files stuffed
with live auth. HAR captures record every request header verbatim — bearer
tokens, session cookies, CSRF tokens — and developers attach them to bug reports
or commit them for "repro". Postman environment exports and `.http` scratch files
carry API keys as plain values. Because they are treated as throwaway artifacts,
they skip review and land in the repo.

Do this instead:
- Gitignore `*.har`, `*.postman_environment.json`, and REST scratch files.
- Sanitize HARs before sharing (strip `Authorization`/`Cookie` headers).
- Use Postman variables backed by a vault, and `{{token}}` / env references in
  `.http` files instead of literals.
- Rotate any token that appeared in a shared HAR — assume it is compromised.

### 27 — AI / MCP tool configs

Directory: [`exhibits/27-ai-tool-configs`](./exhibits/27-ai-tool-configs) — Files: `.mcp.json`, `claude_desktop_config.json`, `.cursor/mcp.json`

Why this is catastrophic: The 2025-2026 wave of leaks: AI coding tools and MCP
servers are configured through JSON files whose `env` blocks take credentials as
literal values, and nearly every setup tutorial shows the key pasted inline.
Some of these files (`.mcp.json`, `.cursor/mcp.json`) are project-scoped by
design — meant to be committed and shared with the team — so the inline key
rides straight into the repo; others (`claude_desktop_config.json`) get copied
in "so everyone has the same setup". One MCP config routinely aggregates keys
for several providers at once (Anthropic, OpenAI, GitHub, Slack, a database
URL), making a single file a denser leak than any classic `.env`.

Do this instead:
- Use environment-variable interpolation where the tool supports it: Claude
  Code's `.mcp.json` expands `${VAR}` (and `${VAR:-default}`) inside `env`,
  `args`, and headers, so the committed file holds only variable names.
- Keep the real values in environment variables or the OS keychain (macOS
  Keychain, secret-service on Linux) and have a small wrapper script export
  them at launch.
- Never commit desktop-app configs: `claude_desktop_config.json` lives under
  the app's support directory, not the project — if a copy exists in the tree,
  gitignore it. Gitignore `.cursor/mcp.json` too when it must carry literals.
- Rotate any key that was ever committed in one of these files — bots grep
  public GitHub for `mcpServers` env blocks the same way they grep for `.env`.

## Try a scanner

```bash
git clone https://github.com/printemps-tokyo/leak-museum
cd leak-museum

# with gitleaks
gitleaks detect --source . --no-git   # scan the working tree
gitleaks detect --source .            # scan the full history (finds exhibit 14)
```

Compare the hit count to [`PLANTED.md`](./PLANTED.md). A good scanner should also
flag the secret that only exists in history (exhibit 14).

## If you have actually leaked a secret

1. **Rotate it now.** Assume it is compromised the moment it is pushed. Rotation,
   not deletion, is the real fix.
2. Remove it from the working tree and add proper `.gitignore` rules.
3. If needed, rewrite history with `git filter-repo` (or BFG), force-push, and
   have collaborators re-clone.
4. Add a pre-commit scanner and enable your host's push protection so it cannot
   happen again.

## License

[MIT](./LICENSE) (c) printemps.tokyo — the educational text and layout. The fake
credentials are not secrets.
