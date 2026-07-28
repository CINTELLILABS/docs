# Norm Claude Code Plugin + Bland MCP Server Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish two new docs pages on docs.bland.ai: "Norm for Claude Code" (the plugin) and "Bland MCP Server" (the endpoint), wired into navigation, the Norm tutorial, and llms.txt.

**Architecture:** Two new MDX pages under `sdks/`, added to the existing "SDKs & Tools" navigation group in `docs.json`. The plugin page is the recommended path and links to the MCP page for direct connections. All commands and endpoints come from the verified plugin source (spec: `.superpowers/specs/2026-07-28-norm-mcp-plugin-docs-design.md`).

**Tech Stack:** Mintlify (MDX + docs.json), `mint` CLI for verification.

**House style (applies to every task):** second person, NO em dashes or en dashes anywhere, straight quotes, language tags on code blocks, relative internal links, frontmatter with title + description.

**Repo root:** `/Users/blandai/Documents/blandai_src/docs/.claude/worktrees/mcp-plugin-docs-15058f`

---

### Task 1: Create the "Norm for Claude Code" page

**Files:**
- Create: `sdks/norm-claude-code.mdx`

- [ ] **Step 1: Write the page**

Create `sdks/norm-claude-code.mdx` with exactly this content:

````mdx
---
title: "Norm for Claude Code"
description: "Install the Norm plugin for Claude Code to build, test, and ship Bland voice agents from your terminal."
---

Norm runs inside [Claude Code](https://claude.com/claude-code) as a plugin. Describe what you want in plain English, and Norm builds, tests, and publishes Bland voice agents without leaving your terminal. The plugin connects to your account through the [Bland MCP server](/sdks/mcp) and adds `/norm` commands for the full agent lifecycle.

Norm is also built into the Bland dashboard. See [Norm](/tutorials/norm) for the in-app version.

## Prerequisites

- [Claude Code](https://claude.com/claude-code) (CLI or desktop app)
- A Bland API key from the [dashboard](https://app.bland.ai)

## Install

<Steps>
  <Step title="Add the marketplace and install the plugin">
    Inside a Claude Code session, run:

    ```text
    /plugin marketplace add CINTELLILABS/bland-plugins
    /plugin install norm@bland
    ```

    The installer prompts for your Bland API key. The key is masked on entry, stored encrypted in your OS keychain, and used only to authenticate the MCP connection. It never appears in files or chat.

    You can also install from your terminal:

    ```bash
    claude plugin marketplace add CINTELLILABS/bland-plugins
    claude plugin install norm@bland --config bland_api_key=YOUR_KEY
    ```
  </Step>
  <Step title="Desktop app only: enter your key">
    Installing from the desktop app's plugin browser does not prompt for configuration. Enter your key in-session with:

    ```text
    /plugin configure norm@bland
    ```
  </Step>
  <Step title="Restart and verify">
    Restart your session so the MCP client connects, then check the connection:

    ```text
    /norm:status
    ```

    For a full self-test of the connection, config, and every read surface, run `/norm:smoke`.
  </Step>
</Steps>

<Warning>
  Never paste your API key into the chat. The interactive prompt and the `--config` flag keep it out of the model context and in your OS keychain. To rotate the key later, run `/plugin configure norm@bland`.
</Warning>

## The flow

From first prompt to production:

1. **Build it.** `/norm:norm build me a booking flow that collects name, callback number, and a time, then confirms it back`. Norm designs the pathway, validates it with the real compiler, and saves it.
2. **Give it tools.** `/norm:tools build a tool that checks availability in our booking API`. Norm builds the tool, test-runs it against the real endpoint, and attaches it to the node that needs it.
3. **Prove it works.** `/norm:loop <pathway_id> --goal 'caller books an appointment and gets it confirmed back'`. Norm simulates the customer, grades every outcome with evidence, fixes what fails, and repeats until the call passes.
4. **Define what to measure.** `/norm:analytics define an outcome schema: booked yes/no, appointment time, reason if not booked`. Verified on real calls before you trust it.
5. **Score every call.** `/norm:evals build a scorecard for this pathway and attach it to calls`. Every production call auto-scores after it ends.
6. **Watch it.** `/norm:analytics build me an ops dashboard`. A live board in the Bland UI: volume, completion, outcomes, score trends.
7. **Iterate from reality.** `/norm:review <call_id>` shows the exact turn a call broke. `/norm:loop <pathway_id> --from-call <call_id>` fixes the flow against that real call.

## Edit an existing pathway

Norm turns a pathway into local files you can read and edit: prompts as Markdown, configuration as YAML.

```text
/norm:list                    # find the pathway id
/norm:clone <pathway_id>      # pull it into a local workspace
# edit the pathway/ files, or tell Norm what to change
/norm:validate                # structural pre-check
/norm:test                    # simulated conversation, no real dial
/norm:commit                  # save as a new version on the server
```

Committing saves a new working version. Production is unchanged until you publish. Ask Norm to publish when you want the new version on live traffic.

## Command reference

| Command | What it does |
|---------|--------------|
| `/norm:norm` | Build, edit, test, and publish agents end to end. The main entry point. |
| `/norm:list` | List the pathways on your account. |
| `/norm:clone` | Pull a pathway into a local file workspace, or scaffold a new one with `new`. |
| `/norm:validate` | Validate the local workspace with the server compiler. |
| `/norm:test` | Run a simulated conversation against the local pathway, or test a single node. |
| `/norm:commit` | Save the workspace back to the server as a new version. |
| `/norm:loop` | Convergence loop: simulate, grade outcomes, fix, and repeat until the goal passes. |
| `/norm:status` | Show workspace state: active pathway, local changes, drift from the server. |
| `/norm:tools` | Build and test custom REST tools and the secrets they reference. |
| `/norm:evals` | Build judges and scorecards, run evals, and check pass rates. |
| `/norm:analytics` | Query call analytics, define outcome schemas, and build dashboards. |
| `/norm:review` | Fetch and debug a real call with evidence from its logs. |
| `/norm:persona` | Manage voices, call configuration, and persona-to-pathway routing. |
| `/norm:knowledge` | Build knowledge bases the agent can cite mid-call. |
| `/norm:automations` | Build event-driven triggers and pipelines that place calls. |
| `/norm:triage` | File and track issues found in your agents. |
| `/norm:api` | Call any Bland REST endpoint directly, guided by the docs. |
| `/norm:debug` | Systematic root-cause debugging for anything misbehaving. |
| `/norm:config` | Show or switch the API URL the plugin points at. |
| `/norm:smoke` | Self-test the install: MCP connection, config, and read surfaces. |

## Safety

- Reads are free. Anything that mutates state, costs money, or dials a phone asks for confirmation first.
- Norm never invents numbers or verdicts. Every claim is backed by a query, a read-back, or a transcript quote.
- Your API key stays in the OS keychain and flows only to the MCP connection.

<Info>
  Advanced: `/norm:config` can point the plugin at a non-production API URL, for example a staging server. The MCP transport requires `https`, so expose local servers through a tunnel.
</Info>

## Related

<CardGroup cols={2}>
  <Card title="Bland MCP Server" icon="server" href="/sdks/mcp">
    The hosted MCP endpoint behind the plugin. Connect any MCP client directly.
  </Card>
  <Card title="Norm" icon="message" href="/tutorials/norm">
    The in-app version of Norm in the Bland dashboard.
  </Card>
  <Card title="Conversational Pathways" icon="diagram-project" href="/tutorials/pathways">
    The flow graph Norm builds and edits.
  </Card>
  <Card title="Tools" icon="screwdriver-wrench" href="/tutorials/tools/overview">
    The tool library Norm authors and attaches to nodes.
  </Card>
</CardGroup>

---

Docs for agents: [llms.txt](/llms.txt)
````

- [ ] **Step 2: Style check**

Run: `grep -nE '—|–|&mdash;' sdks/norm-claude-code.mdx`
Expected: no output (no em or en dashes).

- [ ] **Step 3: Commit**

```bash
git add sdks/norm-claude-code.mdx
git commit -m "Add Norm for Claude Code plugin docs page"
```

---

### Task 2: Create the "Bland MCP Server" page

**Files:**
- Create: `sdks/mcp.mdx`

- [ ] **Step 1: Write the page**

Create `sdks/mcp.mdx` with exactly this content:

````mdx
---
title: "Bland MCP Server"
description: "Connect Claude Code, Cursor, or any MCP client to Bland's hosted MCP server to build and manage voice agents."
---

Bland hosts a [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server that gives AI agents direct access to your Bland account: pathways, calls, analytics, and documentation search.

| | |
|---|---|
| **Endpoint** | `https://api.bland.ai/v1/mcp` |
| **Transport** | HTTP. `https` is required. |
| **Auth** | Your Bland API key in the `Authorization` header. |

```text
Authorization: Bearer YOUR_BLAND_API_KEY
```

The header is also accepted without the `Bearer` prefix. Get your API key from the [dashboard](https://app.bland.ai).

## Connect from Claude Code

The recommended path is the [Norm plugin](/sdks/norm-claude-code). It configures this connection for you, stores your key in the OS keychain, and adds `/norm` commands for the full agent lifecycle.

To connect directly without the plugin:

```bash
claude mcp add --transport http bland https://api.bland.ai/v1/mcp --header "Authorization: Bearer YOUR_KEY"
```

## Connect from other MCP clients

Any client that supports HTTP MCP servers can connect. The configuration file location varies by client (for example `.cursor/mcp.json` for Cursor), but the shape is the same:

```json
{
  "mcpServers": {
    "bland": {
      "url": "https://api.bland.ai/v1/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_BLAND_API_KEY"
      }
    }
  }
}
```

<Warning>
  Your API key grants full access to your Bland account. Store it in your client's secret manager where one is available, and never commit configuration files that contain it.
</Warning>

## What the server exposes

The tool surface covers the Bland platform in a few categories:

- **Documentation search.** Search and read these docs so your agent answers from the source.
- **Read tools.** Pathway structure and validation, call logs, and analytics queries.
- **API passthrough.** Generic read and write access to the [Bland REST API](/api-v1/get/calls) for everything else.
- **High-impact actions.** Tools that place calls, run evals, or change state carry explicit confirmation guidance, so well-behaved agents ask before acting.

Call the `get_bland_mcp_setup` tool after connecting to see auth state and the full list of exposed tools for your account.

## Related

<CardGroup cols={2}>
  <Card title="Norm for Claude Code" icon="terminal" href="/sdks/norm-claude-code">
    The packaged Claude Code experience built on this server.
  </Card>
  <Card title="API Reference" icon="code" href="/api-v1/post/calls">
    The REST API the MCP passthrough tools call.
  </Card>
</CardGroup>

---

Docs for agents: [llms.txt](/llms.txt)
````

- [ ] **Step 2: Style check**

Run: `grep -nE '—|–|&mdash;' sdks/mcp.mdx`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add sdks/mcp.mdx
git commit -m "Add Bland MCP server docs page"
```

---

### Task 3: Wire navigation, Norm tutorial, and llms.txt

**Files:**
- Modify: `docs.json` (SDKs & Tools group, around line 75)
- Modify: `tutorials/norm.mdx` (Where to find Norm CardGroup, lines 31-41)
- Modify: `llms.txt` (SDKs & Tools section, after line 67)
- Modify: `sdks/cli.mdx` (MCP Server section, lines 248-250)

- [ ] **Step 1: Add pages to docs.json**

In `docs.json`, replace:

```json
              {
                "group": "SDKs & Tools",
                "pages": [
                  "sdks/cli",
                  "sdks/bland-tts",
                  "sdks/dev-terminal",
                  "sdks/web-agent-sdk"
                ]
              },
```

with:

```json
              {
                "group": "SDKs & Tools",
                "pages": [
                  "sdks/cli",
                  "sdks/bland-tts",
                  "sdks/dev-terminal",
                  "sdks/web-agent-sdk",
                  "sdks/norm-claude-code",
                  "sdks/mcp"
                ]
              },
```

- [ ] **Step 2: Add the Claude Code card to tutorials/norm.mdx**

In `tutorials/norm.mdx`, replace the "Where to find Norm" CardGroup:

```jsx
<CardGroup cols={3}>
  <Card title="Norm chat" icon="message" href="https://app.bland.ai/dashboard/norm">
    The main chat surface in the [Bland dashboard](https://app.bland.ai/dashboard/norm). Use it for any task across your org.
  </Card>
  <Card title="Pathway editor" icon="diagram-project">
    Norm is embedded inside the pathway editor as an assistant panel, scoped to the pathway you have open.
  </Card>
  <Card title="iMessage" icon="comment-sms" href="/tutorials/messaging/imessage">
    Text Norm at **+1 (321) 424-0172** to build, test, and monitor agents from your phone. See [Norm over iMessage](/tutorials/messaging/imessage#norm-over-imessage).
  </Card>
</CardGroup>
```

with:

```jsx
<CardGroup cols={2}>
  <Card title="Norm chat" icon="message" href="https://app.bland.ai/dashboard/norm">
    The main chat surface in the [Bland dashboard](https://app.bland.ai/dashboard/norm). Use it for any task across your org.
  </Card>
  <Card title="Pathway editor" icon="diagram-project">
    Norm is embedded inside the pathway editor as an assistant panel, scoped to the pathway you have open.
  </Card>
  <Card title="iMessage" icon="comment-sms" href="/tutorials/messaging/imessage">
    Text Norm at **+1 (321) 424-0172** to build, test, and monitor agents from your phone. See [Norm over iMessage](/tutorials/messaging/imessage#norm-over-imessage).
  </Card>
  <Card title="Claude Code" icon="terminal" href="/sdks/norm-claude-code">
    Install the [Norm plugin](/sdks/norm-claude-code) to build, test, and ship agents without leaving your terminal.
  </Card>
</CardGroup>
```

- [ ] **Step 3: Add llms.txt bullets**

In `llms.txt`, directly after the Web Agent SDK bullet (line 67), add:

```text
- [Norm for Claude Code](https://docs.bland.ai/sdks/norm-claude-code.md): Install the Norm plugin for Claude Code to build, test, and ship Bland voice agents from your terminal.
- [Bland MCP Server](https://docs.bland.ai/sdks/mcp.md): Connect Claude Code, Cursor, or any MCP client to Bland's hosted MCP server to build and manage voice agents.
```

(These match each page's frontmatter title and description exactly.)

- [ ] **Step 4: Disambiguate the CLI's local MCP server in sdks/cli.mdx**

The CLI page documents a different, local MCP server (`bland mcp`). Cross-reference the hosted server so the "SDKs & Tools" group does not offer two unexplained ways to connect. In `sdks/cli.mdx`, replace:

```mdx
## MCP Server

The CLI includes an [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server, which lets AI coding tools like Claude Code and Cursor interact with your Bland account through natural language.
```

with:

```mdx
## MCP Server

The CLI includes a local [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server, which lets AI coding tools like Claude Code and Cursor interact with your Bland account through natural language.

<Info>
  This runs the CLI's own MCP server on your machine. Bland also hosts a remote MCP server that needs no local install. See [Bland MCP Server](/sdks/mcp), or install the [Norm plugin](/sdks/norm-claude-code) for the full Claude Code experience.
</Info>
```

- [ ] **Step 5: Commit**

```bash
git add docs.json tutorials/norm.mdx llms.txt sdks/cli.mdx
git commit -m "Wire Norm plugin and MCP server pages into nav, Norm tutorial, and llms.txt"
```

---

### Task 4: Verify with the mint CLI

**Files:** none created; fixes applied to the files above if verification fails.

- [ ] **Step 1: Ensure mint is installed**

Run: `mint --version`
If missing: `npm i -g mint`

- [ ] **Step 2: Broken links**

Run from repo root: `mint broken-links`
Expected: no broken links reported. If any are in the new/edited pages, fix and re-run.

- [ ] **Step 3: Render check**

Run: `mint dev --port 3333` in the background, then:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3333/sdks/norm-claude-code
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3333/sdks/mcp
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3333/tutorials/norm
```

Expected: `200` for all three, and no MDX parse errors in the dev server output.

A 200 alone does not prove the MDX parsed (both new pages nest fenced code inside JSX components, a classic MDX trap). Assert on content too:

```bash
curl -s http://localhost:3333/sdks/norm-claude-code | grep -c "<pre"
curl -s http://localhost:3333/sdks/norm-claude-code | grep -c '```'
curl -s http://localhost:3333/sdks/mcp | grep -c "<pre"
curl -s http://localhost:3333/sdks/mcp | grep -c '```'
```

Expected: `<pre` count of 5 or more for norm-claude-code and 3 or more for mcp; backtick-fence count `0` for both (no leaked fences). Stop the server afterwards.

Note: port 3333 avoids the local Bland API server that may occupy port 3000.

- [ ] **Step 4: Accessibility check**

Run: `mint a11y`
Expected: no new issues on the two new pages or `tutorials/norm`. Fix any that appear (alt text, contrast).

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "Fix issues found by mint verification"
```

Only commit if fixes were needed.

---

## Self-review notes

- Spec coverage: page 1 sections 1-8 map to Task 1; page 2 sections 1-5 map to Task 2; wiring (docs.json, tutorial card, llms.txt) maps to Task 3; verification maps to Task 4. No gaps.
- All commands verified against plugin source and `claude mcp add --help`; the 20-command table matches `commands/` in the plugin exactly.
- llms.txt descriptions match page frontmatter verbatim.
