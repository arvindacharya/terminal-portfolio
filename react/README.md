# Arvind Acharya — Portfolio (React)

Terminal-themed portfolio. Two shells — **zsh** (warm black, Geist Mono, lime) and
**pwsh** (navy PowerShell console, Consolas, gold) — and switching shells rewrites
every command on the page, not just the colours.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview    # serve the build locally
```

Requires Node 18+.

## Deploy

`npm run build` produces a static `dist/` folder — no server needed.

- **Vercel** — `vercel` in this directory, or import the repo. Framework preset: Vite.
- **Netlify** — build command `npm run build`, publish directory `dist`.
- **GitHub Pages** — push `dist/` to a `gh-pages` branch. `base: './'` is already set
  in `vite.config.js`, so it works from a subpath.

## Structure

```
index.html            Google Fonts link + root div
src/main.jsx          React entry
src/index.css         Theme tokens (:root) + keyframes + resets
src/App.jsx           The entire UI, one component
src/data.js           All content: THEMES, SHELL, PROJECTS, BELIEFS, STACK, ROLES, NAVITEMS
src/assets/           Portrait, résumé PDF
```

### Where to edit what

Almost everything you'll want to change lives in **`src/data.js`**:

| Export | What it controls |
| --- | --- |
| `THEMES` | The two shells' colour ramps, fonts, radii. `zsh` and `pwsh`. |
| `SHELL` | Every command string per shell — `whoami`, `ls`, `cat()`, `tree`, `trace()`, prompt, tree glyphs, comment markers. Add a shell by adding a key to both `THEMES` and `SHELL`. |
| `PROJECTS` | The five case files. Each has `metrics`, `chapters`, and five `stages` (the architecture walkthrough). |
| `BELIEFS` | The philosophy section. |
| `STACK` | The `tree stack/` groups. |
| `ROLES` | The `git log` experience entries. |
| `NAVITEMS` | `[navLabel, sectionId, description]` — drives the desktop strip, the phone sheet, and scroll-spy. |

Hero copy, the About paragraphs and contact links are inline in `App.jsx`
(they're one-offs, not lists).

## How the theming works

`useShell()` writes all 15 `--t-*` custom properties onto `:root` **and** `body`
whenever the shell changes, then persists the choice to `localStorage` under
`portfolio-shell`. Every style in `App.jsx` reads `var(--t-*)`, so a shell switch
is one state update — no re-styling, no class swapping.

Writing to both `:root` and `body` is deliberate: `body` carries its own copy so
the page background can't be left stale by a re-render.

## Responsive behaviour

`useNarrow()` flips at 720px. Below it:

- Desktop command strip → floating bottom bar that opens a full-screen `help` sheet
- Project rows go two-line (filename + year, then description) so every row's left edge aligns
- Architecture stage tabs become a 2-column grid with no vertical dividers
- Title bar drops decorative chrome (traffic lights / window buttons) and pwsh shows the path only
- The phone bar shows `cat <file>.md` rather than `cat projects/<file>.md` so long names don't truncate

All of these are ternaries on `narrow` — search the file for it.

## Known gaps

- **Project screenshots** — the HTML original had two drop slots per case file. They
  aren't in this build; add `<img>` tags in the case-file section when you have images.
- **Architecture stage copy** was written from one résumé line per project and is
  inferred, not documented. Verify before an interview.
- The résumé PDF is imported as an asset, so Vite fingerprints it in the build. If you
  want a stable `/resume.pdf` URL instead, move it to `public/` and reference it as
  `/Arvind_Acharya_Resume.pdf`.
