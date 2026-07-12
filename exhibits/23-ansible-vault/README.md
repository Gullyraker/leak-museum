# Exhibit 23 — Ansible Vault with a committed/weak password

Files: `group_vars/all/vault.yml`, `.vault_pass`, `ansible.cfg`

## Why this is catastrophic
Ansible Vault is only as strong as its password. Teams commit the password file
next to the encrypted vault "for CI convenience," or pick a weak dictionary
password. The AES256 blob is public in the repo, so a leaked or guessable
password decrypts every production secret — and weak passwords fall to offline
brute force since the ciphertext is right there.

## Do this instead
- Never commit the vault password; supply it at run time via
  `--vault-password-file` outside the repo, a script that pulls from a secret
  manager, or `ANSIBLE_VAULT_PASSWORD_FILE`.
- Use a long random password; rotate and re-key (`ansible-vault rekey`) on
  exposure. Consider a real secrets backend (HashiCorp Vault) over static files.
