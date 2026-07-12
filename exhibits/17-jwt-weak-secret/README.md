# Exhibit 17 — JWT signed with a weak/known secret

Files: `auth.js`, `sample-token.txt`

Note: no secret scanner flags this — a generic HS256 secret and a JWT are not
"provider patterns". This exhibit shows a scanner is not a safety net.

## Why this is catastrophic
Signing JWTs with `HS256` and a short, guessable, or copied-from-a-tutorial
secret means anyone who obtains a single token can brute-force the secret offline
in seconds (hashcat does exactly this), then forge arbitrary tokens — e.g.
`{"role":"admin"}` — and impersonate any user. Committing the secret removes even
the brute-force step. A related footgun is accepting `alg: none`.

## Do this instead
- Use a long (>=32 bytes) random secret from a secret manager; rotate on leak.
- Prefer asymmetric `RS256`/`ES256` so verifiers never hold a signing key.
- Pin the expected `alg` on verification and reject `none`. Keep expirations short.
