# Exhibit 16 — Mobile app secrets (Firebase + signing keystore)

Files: `android/app/google-services.json`, `ios/GoogleService-Info.plist`,
`android/app/release.keystore` (placeholder), `android/app/keystore.properties`

## Why this is catastrophic
Mobile repos routinely commit the Firebase config (a Google API key + project
identifiers) and, far worse, the app-signing keystore and its passwords. The
keystore is the app's identity: leak it plus its password and an attacker can
sign malware as you and ship it to your users. A Firebase key with lax Security
Rules allows direct reads/writes to your backend.

## Do this instead
- Keep the keystore out of git; store it in the CI secret store / a KMS and
  inject at build time. Put signing passwords in environment secrets, not
  `gradle.properties`/`keystore.properties`.
- Treat `google-services.json` as low-sensitivity config, but back it with
  strict Firebase Security Rules and App Check so the key alone is useless.
