# Exhibit 08 — Kubernetes Secret manifests

File: `secret.yaml`

## Why this is catastrophic
The most common and dangerous misconception in Kubernetes: `data:` values are
base64-**encoded**, not encrypted. `echo aHVudGVyMg== | base64 -d` gives back
`hunter2` instantly. Committing a `Secret` manifest is committing plaintext.

## Do this instead
- Never commit raw `Secret` manifests. Use Sealed Secrets, SOPS (with age/KMS),
  or an external secrets operator that pulls from Vault / cloud secret managers.
- Enable encryption at rest for etcd.
