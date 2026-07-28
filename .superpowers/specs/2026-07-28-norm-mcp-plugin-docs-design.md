# Norm Claude Code plugin + Bland MCP server docs: design

Date: 2026-07-28
Branch: kyle/mcp-plugin-docs-15058f
Status: approved by user (structure, scope) 2026-07-28

## Goal

Public docs on docs.bland.ai for:

1. The **Norm Claude Code plugin** (`norm@bland` from the public `CINTELLILABS/bland-plugins` marketplace): how to install it, connect it to a Bland account, and run the build-to-production flow from Claude Code or Claude Desktop.
2. The **Bland MCP server** (`https://api.bland.ai/v1/mcp`): how to connect any MCP-capable agent directly (Claude Code without the plugin, Cursor, generic HTTP MCP clients), what it exposes, and how auth works.

User decisions (via Q&A):

- Two separate pages, both in the "SDKs & Tools" group.
- Cover Claude Code + Claude Desktop AND generic MCP clients (raw endpoint).
- No external ticket requirements; build from plugin source of truth.

## Sources of truth (verified, no invention)

- Plugin README, CHEATSHEET, `.claude-plugin/plugin.json`, `.mcp.json` at
  `~/.claude/plugins/cache/bland/norm/1.13.1/` (ships in public repo
  `github.com/CINTELLILABS/bland-plugins`, visibility confirmed PUBLIC).
- Verified facts to use verbatim:
  - Install (in Claude Code): `/plugin marketplace add CINTELLILABS/bland-plugins` then `/plugin install norm@bland`.
  - Install (terminal / scripted): `claude plugin marketplace add CINTELLILABS/bland-plugins` then `claude plugin install norm@bland --config bland_api_key=YOUR_KEY`.
  - Desktop installs do not prompt for config; enter key with `/plugin configure norm@bland`.
  - API key: from app.bland.ai, declared `sensitive`, masked on entry, stored encrypted in the OS keychain, flows only into the MCP Authorization header.
  - Restart the session after install so the MCP client connects.
  - Verify: `/norm:status`, full self-test `/norm:smoke`.
  - MCP server: HTTP MCP at `${bland_api_url}/v1/mcp`, default `https://api.bland.ai/v1/mcp`.
  - Auth header: `Authorization: Bearer <BLAND_API_KEY>` (bare `Authorization: <BLAND_API_KEY>` also accepted).
  - HTTPS required by Claude's HTTP-MCP transport (no `http://localhost`; use a tunnel).
  - Reads are free; state-changing tools (writes, `create_call`, `create_eval_run`) are confirmation-gated.
  - `get_bland_mcp_setup` tool reports auth/session state and the exposed tool surface.
  - Lifecycle flow and command list from CHEATSHEET.md and command descriptions.

## Deliverable 1: `sdks/norm-claude-code.mdx` ("Norm for Claude Code")

Sections:

1. Frontmatter: title "Norm for Claude Code"; description about building, testing, and shipping Bland voice agents from Claude Code.
2. Intro: Norm as a Claude Code plugin; one-command install; powered by the Bland MCP server (link `/sdks/mcp`); dashboard version at `/tutorials/norm`.
3. Prerequisites: Claude Code (or Claude Desktop); Bland API key from app.bland.ai.
4. Install (Steps component): marketplace add + install (interactive key prompt), terminal one-liner, Desktop configure note, restart, verify with `/norm:status` / `/norm:smoke`.
5. The flow: numbered lifecycle (build -> tools -> converge via /norm:loop -> outcomes -> auto-score -> monitor -> iterate from real calls) plus the edit workspace loop (clone -> edit files -> validate -> test -> commit).
6. Command reference: single table, all `/norm:*` commands, one line each.
7. Safety and key handling: confirmation gates; keychain; rotate via `/plugin configure norm@bland`; short Advanced note that `bland_api_url` / `/norm:config` can point at a non-production server (kept brief, dev-focused).
8. Related links: `/sdks/mcp`, `/tutorials/norm`, `/tutorials/pathways`.

## Deliverable 2: `sdks/mcp.mdx` ("Bland MCP Server")

Sections:

1. Frontmatter: title "Bland MCP Server"; description about connecting any MCP-capable agent to Bland.
2. Intro + endpoint + auth (code block with both header forms).
3. Connect from Claude Code: recommended = Norm plugin (link); direct = `claude mcp add --transport http bland https://api.bland.ai/v1/mcp --header "Authorization: Bearer YOUR_KEY"`.
4. Connect from other MCP clients: generic JSON config for HTTP-MCP clients (Cursor-style `mcpServers` block). HTTPS required.
5. What's exposed: categories (docs search, read-only pathway/call/analytics tools, generic REST passthrough, gated write tools); confirmation-gating; `get_bland_mcp_setup` for the authoritative surface. No exhaustive per-tool table (avoids drift).

## Wiring

- `docs.json`: append `"sdks/norm-claude-code"`, `"sdks/mcp"` to the "SDKs & Tools" group after `sdks/web-agent-sdk`.
- `tutorials/norm.mdx`: add a "Claude Code" card to "Where to find Norm" (CardGroup) linking to `/sdks/norm-claude-code`.
- `llms.txt`: two bullets under `## SDKs & Tools` matching each page's title/description.

## Constraints

- House style: second person, no em dashes or en dashes, straight quotes, short sentences, language tags on code blocks, relative internal links, frontmatter on every page.
- Accuracy: only commands/endpoints from the sources above; nothing invented.
- Match component usage of sibling pages (Steps, CardGroup, tables).

## Out of scope

- Changelog entry (separate workflow).
- Deep documentation of dev tunnels, key-rotation keychain edge cases, or the stdio desktop bridge (`bin/bland-mcp-desktop`); at most a one-line mention.
- Enumerating every MCP tool by name.

## Verification

- `mint dev`: both pages render without errors.
- `mint broken-links`: clean.
- `mint a11y` on touched pages.
- New pages present in docs.json nav and llms.txt.

Note: spec lives in `.superpowers/specs/` (dot-directory) instead of `docs/superpowers/specs/` because this repo is the published Mintlify site and non-navigation pages can still be served.
