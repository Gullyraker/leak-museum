# Exhibit 26 — API debug artifacts (HAR / Postman / .http)

Files: `session.har`, `MyAPI.postman_environment.json`, `requests.http`

## Why this is catastrophic
Debugging and API-testing tools produce files stuffed with live auth. HAR
captures record every request header verbatim — bearer tokens, session cookies,
CSRF tokens — and developers attach them to bug reports or commit them for
"repro". Postman environment exports and `.http` scratch files carry API keys as
plain values. Because they are treated as throwaway artifacts, they skip review
and land in the repo.

## Do this instead
- Gitignore `*.har`, `*.postman_environment.json`, and REST scratch files.
- Sanitize HARs before sharing (strip `Authorization`/`Cookie` headers).
- Use Postman variables backed by a vault, and `{{token}}` / env references in
  `.http` files instead of literals.
- Rotate any token that appeared in a shared HAR — assume it is compromised.
