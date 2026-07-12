# Planted secrets manifest

This is the answer key for using leak-museum as a secret-scanner benchmark. Every
value below is fake (documented example, throwaway demo key, or placeholder).

## By exhibit

| # | Exhibit | Planted secret types |
| --- | --- | --- |
| 01 | dotenv | Postgres/Redis URLs w/ password, JWT/session secret, Stripe test key, SendGrid key, OpenAI key |
| 02 | cloud-credentials | AWS access key + secret (docs EXAMPLE), GCP service-account JSON |
| 03 | hardcoded-in-source | Stripe key, GitHub token, Slack token, Google API key, Django SECRET_KEY, Twilio token, DB password |
| 04 | ssh-keys | OpenSSH private key (throwaway), internal hostnames/users |
| 05 | tls-private-key | RSA private key (throwaway self-signed) |
| 06 | database | Plaintext user passwords, DB connection string, `.pgpass` line |
| 07 | plaintext-passwords | Assorted account/Wi-Fi passwords |
| 08 | kubernetes | base64-encoded db-password and jwt-secret |
| 09 | package-registry-tokens | npm, PyPI, Docker registry auth, `.netrc`, `.git-credentials` |
| 10 | terraform-state | Generated DB password in state, Cloudflare token in tfvars |
| 11 | ci-cd | AWS keys in `env:`, GitHub token echoed to logs |
| 12 | dangerous-leftovers | Exported API key in history, secrets in `.bak` and `.swp` |
| 13 | dockerfile | npm token (ARG), Stripe key + DB URL (ENV) |
| 14 | still-in-history | An API key removed from the tree but present in git history |
| 15 | frontend-bundle | Stripe `sk_live_` (mangled) and admin token in a shipped JS bundle + source map |
| 16 | mobile-app-secrets | Google API keys (mangled) in Firebase config, keystore passwords |
| 17 | jwt-weak-secret | HS256 secret `secret` + a real JWT signed with it (scanner-invisible) |
| 18 | git-internals | GitHub PAT in a remote URL, bearer token in a git hook |
| 19 | editor-ide-settings | DB passwords / auth headers in `.vscode` and JetBrains config |
| 20 | dotnet-appsettings | SQL connection string, Azure Storage key (mangled), SendGrid key |
| 21 | rails-secrets | `master.key`, `secret_key_base`, DB password (scanner-invisible) |
| 22 | wordpress-wp-config | DB creds, auth salts, plugin key (scanner-invisible) |
| 23 | ansible-vault | AES256 vault blob + committed weak vault password |
| 24 | cloud-cli-cache | `gho_` GitHub token, `ya29.` Google refresh token (mangled) |
| 25 | encoded-not-encrypted | base64-encoded credentials, creds in a URL |
| 26 | api-debug-artifacts | Bearer tokens / cookies in a HAR, Postman + `.http` keys |

## Provider tokens deliberately mangled (so this repo can be published)

Because printemps-tokyo enforces GitHub push protection org-wide, provider values
that GitHub detects with high confidence are kept in a broken form (prefix
preserved, structure broken) so regex-based scanners still match but the push is
allowed: Stripe (`sk_test_`/`sk_live_`), Slack (`xoxb-`), Google (`AIza`/`ya29.`),
GitHub (`ghp_`/`gho_`), Azure Storage `AccountKey`. The "scanner-invisible"
exhibits (17, 21, 22) are the strongest teaching cases: no scanner flags them,
proving a scanner is not a safety net.

## Notes for scanner authors
- Exhibit 14 is only findable when scanning **history** (e.g. `gitleaks detect`
  without `--no-git`), not the working tree. It is the key differentiator.
- A few provider tokens are deliberately slightly malformed so that GitHub push
  protection would allow this repo to be published; regex-based scanners still
  match them, but validity-checking scanners may (correctly) treat them as
  inactive. That gap is itself a teaching point.
