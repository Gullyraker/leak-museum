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

## Notes for scanner authors
- Exhibit 14 is only findable when scanning **history** (e.g. `gitleaks detect`
  without `--no-git`), not the working tree. It is the key differentiator.
- A few provider tokens are deliberately slightly malformed so that GitHub push
  protection would allow this repo to be published; regex-based scanners still
  match them, but validity-checking scanners may (correctly) treat them as
  inactive. That gap is itself a teaching point.
