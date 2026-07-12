# Exhibit 04 — SSH keys and config

Files: `id_ed25519` (PRIVATE KEY), `id_ed25519.pub`, `config`, `known_hosts`

Note: the private key here was generated fresh for this museum and is used
nowhere. Never commit a real one.

## Why this is catastrophic
A committed private key is a committed identity — anyone with the file can log in
as you. The `config` and `known_hosts` files additionally leak your internal
hostnames, bastions, and usernames, which is a gift to an attacker mapping your
network.

## Do this instead
- Keep `~/.ssh/` out of every repo. Private keys never belong in git.
- Protect keys with a passphrase and prefer per-host, short-lived certificates.
- If a private key leaks, remove the key from every `authorized_keys` and
  generate a new one; rotation is the only real fix.
