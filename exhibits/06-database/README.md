# Exhibit 06 — Database dumps and `.pgpass`

Files: `dump.sql`, `.pgpass`

## Why this is catastrophic
A committed SQL dump leaks real user data (emails, and here even plaintext
passwords) plus the connection strings to reach the live database. `.pgpass`
stores database passwords in the clear.

## Do this instead
- Keep dumps and `.pgpass` out of the repo. Never store user passwords in
  plaintext — hash them with bcrypt/argon2.
- Take dumps to a secured, access-controlled location, not source control.
- Use connection strings assembled from environment variables at runtime.
