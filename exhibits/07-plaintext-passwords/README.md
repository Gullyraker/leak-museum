# Exhibit 07 — Plaintext password notes

Files: `passwords.txt`, `wifi.txt`

## Why this is catastrophic
The "shared team password file" is a single document that compromises every
account it lists. In a repo, it is copied to every clone and preserved in
history forever.

## Do this instead
- Use a real password manager (1Password, Bitwarden, KeePass) with sharing.
- Never keep credentials in a flat file in a repo.
- Turn on MFA so a leaked password alone is not enough.
