# Exhibit 22 — WordPress wp-config.php

File: `wp-config.php`

Note: WordPress DB creds and salts are not provider patterns, so scanners stay
quiet here.

## Why this is catastrophic
WordPress's core config is a single PHP file at the web root containing DB
credentials and the auth salts. Guides tell people to edit and commit it as-is,
so it constantly lands in public repos and downloadable site backups. DB creds
give database access; leaked salts let an attacker forge auth cookies and hijack
logged-in sessions without the password.

## Do this instead
- Keep `wp-config.php` out of version control; commit only `wp-config-sample.php`.
- Load secrets from environment variables / a `.env` outside the web root.
- Regenerate salts from the WordPress secret-key API on any suspected leak;
  restrict DB users to least privilege and non-public hosts.
