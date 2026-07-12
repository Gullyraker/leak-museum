# Exhibit 20 — .NET appsettings.json

Files: `appsettings.json`, `appsettings.Development.json`

## Why this is catastrophic
The .NET convention reads config from `appsettings*.json`, and the default
templates ship these files committed. Teams drop production connection strings,
an Azure Storage `AccountKey`, and service API keys straight into them.
Environment-suffixed variants (`.Development`, `.Production`) multiply the
exposure and are rarely gitignored.

## Do this instead
- Keep only non-secret defaults in `appsettings.json`.
- Use User Secrets (`dotnet user-secrets`) locally and environment variables /
  Azure Key Vault (`AddAzureKeyVault`) in deployed environments — the config
  system overlays them automatically.
- Gitignore any `appsettings.*.json` that holds real values.
