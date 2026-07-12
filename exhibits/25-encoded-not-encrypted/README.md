# Exhibit 25 — "Encoded" is not "encrypted"

Files: `credentials.b64`, `config.yml`

## Why this is catastrophic
A pervasive misconception: base64 (or URL-encoding, or an unsigned JWT payload)
is not encryption. It is reversible with zero key — `base64 -d` or any decoder
reveals the plaintext instantly. People commit "encoded" secrets, embed
credentials in URLs, and trust base64'd config believing it is protected. It is
obfuscation at best, and scanners and attackers decode it routinely.

## Do this instead
- Encode is not encrypt. Store secrets in a secret manager; for data at rest use
  real authenticated encryption (libsodium / AES-GCM) with a managed key.
- Never put credentials in URLs (they leak via logs, referrers, history).
- Treat any base64 / JWT-payload value in a repo as plaintext.
