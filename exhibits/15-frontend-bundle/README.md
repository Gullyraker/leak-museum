# Exhibit 15 — Secrets in the frontend bundle (and source maps)

Files: `dist/app.min.js`, `dist/app.min.js.map`

## Why this is catastrophic
Anything the browser needs, the browser receives. A secret hardcoded (or put in a
`VITE_`/`REACT_APP_`/`NEXT_PUBLIC_` variable) is compiled into the JS and served
publicly to every visitor. "It's minified" is not protection: a committed
`.map` source map de-minifies the bundle back to original variable names and file
paths, handing an attacker a labeled map of every embedded key.

## Do this instead
- Only ship publishable/anon keys to the browser (Stripe `pk_`, Supabase anon).
  Every privileged call goes through a backend you control.
- Do not emit source maps to the web root in production (upload them privately to
  your error tracker instead).
- Scope any client-visible key server-side with allow-lists and rate limits.
