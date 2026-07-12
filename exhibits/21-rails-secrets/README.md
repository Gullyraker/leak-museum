# Exhibit 21 — Rails master.key and secrets.yml

Files: `config/master.key`, `config/credentials.yml.enc`, `config/secrets.yml`

Note: these are generic strings, so secret scanners do not flag them — another
"the scanner won't save you" case.

## Why this is catastrophic
Rails encrypts `credentials.yml.enc`, but committing `master.key` alongside it
hands over the decryption key and makes the encryption pointless. Older apps used
`secrets.yml` with plaintext values people commit directly. Leaking
`secret_key_base` lets an attacker forge signed/encrypted session cookies and, on
vulnerable versions, achieve RCE via crafted cookies.

## Do this instead
- Gitignore `config/master.key` and `config/credentials/*.key`; deliver the key
  only via the `RAILS_MASTER_KEY` env in each environment.
- Rotate `secret_key_base` immediately on leak (invalidates sessions).
- Migrate `secrets.yml` literals into encrypted credentials with per-environment
  key files.
