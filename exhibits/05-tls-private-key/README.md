# Exhibit 05 — TLS private key

Files: `server.key` (PRIVATE KEY), `server.crt`

The key here is a throwaway self-signed demo key.

## Why this is catastrophic
The private half of a TLS certificate lets an attacker impersonate your site and
decrypt traffic. Committing `server.key` alongside the cert defeats the entire
point of TLS.

## Do this instead
- Store private keys in a secrets manager / KMS, never in the repo.
- Commit only the public certificate if anything, and issue certs automatically
  (ACME / Let's Encrypt) so keys stay on the server.
- On leak, revoke the certificate and reissue.
