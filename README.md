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

The [`good-example/`](./good-example) directory shows the same project done
right, and [`DO-THIS-INSTEAD.md`](./DO-THIS-INSTEAD.md) is the checklist.

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
