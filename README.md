# Terminal-Inspired Portfolio

A terminal-style portfolio template you can clone and customize for your own personal site.

This project supports **two visual terminal modes**:

- **zsh mode**: dark, warm shell feel (similar to a dark mode experience)
- **pwsh mode**: light/blue PowerShell-inspired feel (similar to a light mode experience)

The mode switch changes both styling and shell voice (prompt style + command strings), so the UI feels like a real terminal profile swap.

## Project Layout

- `react/` - main Vite + React portfolio app
- `Arvind Acharya - Portfolio.html` and related `.dc.html` files - design/source snapshots
- `screenshots/`, `uploads/`, and `_ds/` - supporting assets/data

## Quick Start

1. Go to the React app:

```bash
cd react
```

2. Install dependencies:

```bash
npm install
```

3. Run locally:

```bash
npm run dev
```

4. Build production bundle:

```bash
npm run build
```

## How To Make This Your Own

Most customization is in `react/src/data.js`.

- Update your name, roles, projects, links, and content collections.
- Edit `THEMES` to tune colors, fonts, and terminal chrome.
- Edit `SHELL` to control command labels/prompts in each mode.
- Keep both mode keys (`zsh`, `pwsh`) in `THEMES` and `SHELL` so switching stays consistent.

Then update one-off UI text in `react/src/App.jsx` (hero/about/contact sections).

## Two Terminal Modes

Think of this as **terminal-inspired dark vs light mode**, but with behavior-level flavor too:

- `zsh` mode:
  - darker palette
  - zsh-style command voice
  - best for classic hacker-terminal aesthetics
- `pwsh` mode:
  - brighter PowerShell-style palette
  - pwsh command voice and console cues
  - best for a cleaner, productivity-terminal vibe

## Deploy

From `react/`:

- `npm run build` creates `dist/`
- Deploy `dist/` to Netlify, Vercel, GitHub Pages, or any static host

## Push To GitHub

From the workspace root:

```bash
git init
git add .
git commit -m "Initial commit: terminal-inspired portfolio"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

Example remote URL formats:

- HTTPS: `https://github.com/<username>/<repo>.git`
- SSH: `git@github.com:<username>/<repo>.git`

If you already created a remote, skip `git remote add origin ...` and use:

```bash
git remote set-url origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```
