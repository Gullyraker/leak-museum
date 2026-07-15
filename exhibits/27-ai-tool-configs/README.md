# Exhibit 27 — AI / MCP tool configs

Files: `.mcp.json`, `claude_desktop_config.json`, `.cursor/mcp.json`

## Why this is catastrophic
The 2025-2026 wave of leaks: AI coding tools and MCP servers are configured
through JSON files whose `env` blocks take credentials as literal values, and
nearly every setup tutorial shows the key pasted inline. Some of these files
(`.mcp.json`, `.cursor/mcp.json`) are project-scoped by design — meant to be
committed and shared with the team — so the inline key rides straight into the
repo; others (`claude_desktop_config.json`) get copied in "so everyone has the
same setup". One MCP config routinely aggregates keys for several providers at
once (Anthropic, OpenAI, GitHub, Slack, a database URL), making a single file a
denser leak than any classic `.env`.

## Do this instead
- Use environment-variable interpolation where the tool supports it: Claude
  Code's `.mcp.json` expands `${VAR}` (and `${VAR:-default}`) inside `env`,
  `args`, and headers, so the committed file holds only variable names.
- Keep the real values in environment variables or the OS keychain (macOS
  Keychain, secret-service on Linux) and have a small wrapper script export
  them at launch.
- Never commit desktop-app configs: `claude_desktop_config.json` lives under
  the app's support directory, not the project — if a copy exists in the tree,
  gitignore it. Gitignore `.cursor/mcp.json` too when it must carry literals.
- Rotate any key that was ever committed in one of these files — bots grep
  public GitHub for `mcpServers` env blocks the same way they grep for `.env`.
