# Mintlify documentation

## Working relationship
- You can push back on ideas. This can lead to better documentation. Cite sources and explain your reasoning when you do
- ALWAYS ask for clarification rather than making assumptions
- NEVER lie, guess, or make up anything

## Project context
- Format: MDX files with YAML frontmatter
- Config: docs.json for navigation, theme, settings
- Components: Mintlify components
- `llms.txt` at the repo root is a hand-maintained index of every page (one bullet per page) plus a curated "About Bland" intro and "Instructions for AI Agents" section. It is not auto-generated. Keep it in sync (see below)

## Content strategy
- Document just enough for user success. Not too much, not too little
- Prioritize accuracy and usability
- Make content evergreen when possible
- Search for existing content before adding anything new. Avoid duplication unless it is done for a strategic reason
- Check existing patterns for consistency
- Start by making the smallest reasonable changes

## docs.json
- Refer to the [docs.json schema](https://mintlify.com/docs.json) when building the docs.json file and site navigation
- Every new page must be added to `docs.json` navigation. A page not in navigation is unreachable

## llms.txt maintenance
Update `llms.txt` whenever you make a structural change to the docs, so AI tools and crawlers stay in sync with the site:
- **Add a page**: add a bullet under the matching section in the format `- [Title](https://docs.bland.ai/<path>.md): one-line description.` Match the page's frontmatter title and description
- **Remove a page**: delete its bullet
- **Rename, move, or repurpose a page**: update the affected URL, title, and description
- Keep the section a page lives under in `llms.txt` consistent with its group in `docs.json`
- You do not need to touch `llms.txt` for copy-only edits (typos, rewording) that leave the page's title, description, and path unchanged
- Changelog pages (`changelog/*`) are intentionally excluded from `llms.txt`. Do not add them

## Frontmatter requirements for pages
- title: Clear, descriptive page title
- description: Concise summary for SEO/navigation

## Writing standards
- Second-person voice ("you")
- Prerequisites at start of procedural content
- Test all code examples before publishing
- Match style and formatting of existing pages
- Include both basic and advanced use cases
- Language tags on all code blocks
- Alt text on all images
- Relative paths for internal links

## Punctuation and house style
- NEVER use em dashes (`—`) or the `&mdash;` entity. Rewrite the sentence, or use a colon, period, comma, or parentheses instead
- Avoid en dashes (`–`) in prose; use "to" for ranges (for example "5 to 10 minutes")
- Use straight quotes and apostrophes, not curly ones
- Prefer short, direct sentences over long ones stitched together with dashes or semicolons

## Verify before committing
- Run `mint dev` locally and confirm changed pages render without errors (install with `npm i -g mint`)
- Run `mint broken-links` and fix any broken internal links before opening a PR
- Run `mint a11y` to catch missing alt text and contrast issues on pages you touched
- Confirm new pages appear in the navigation and in `llms.txt`

## Git workflow
- NEVER use --no-verify when committing
- Ask how to handle uncommitted changes before starting
- Create a new branch when no clear branch exists for changes
- Commit frequently throughout development
- NEVER skip or disable pre-commit hooks

## Do not
- Skip frontmatter on any MDX file
- Use absolute URLs for internal links
- Use em dashes anywhere in docs content
- Include untested code examples
- Leave a new page out of docs.json navigation or llms.txt
- Make assumptions. Always ask for clarification
