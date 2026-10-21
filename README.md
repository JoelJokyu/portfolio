# Joel Ojukwu — Developer Portfolio

A React and TypeScript portfolio focused on backend engineering, relational databases, real-time communication, and infrastructure. Shared content powers two presentations:

- **Professional:** warm, minimal single-page layout with expandable engineering notes.
- **Terminal:** dark, green-accented interface with clickable navigation, a docked command console, and a browser-local number game.

Work in progress. There is no production deployment or automatic deployment workflow.

## Run locally

Install **Node.js 24** (recorded in `.nvmrc`), then open this repository folder in VS Code:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. Professional mode is the default; append `?mode=terminal` to open Terminal mode directly. The header switches between modes; browser back/forward supports mode changes.

## Checks and build

```sh
npm run check
```

This runs command-parser tests, TypeScript checking, and the Vite production build. Generated output is in `dist/` and excluded from Git. Preview that build with `npm run preview`.

GitHub Actions runs the same checks on pushes to `main` and pull requests. It does not deploy a website. Automated tests cover command resolution, public/private repository handling, malformed arguments, aliases, and game-command validation; they do not constitute browser interaction or layout tests.

## Terminal commands

All content is accessible by clicking; typing is optional.

| Command | Action |
| --- | --- |
| `help` | Command reference |
| `projects` / `ls -la` | Project directory |
| `open 1` / `open rt-chat` | Read a project |
| `open 1 --source` | Open its public repository; `-source` also works |
| `open 5 --tutorial` | Open the credited Go API tutorial |
| `about` / `skills` / `background` / `contact` | Portfolio sections |
| `cat about.md` | File-style navigation; help lists other aliases |
| `hello` / `bye` / `ping` / `coffee` / `fortune` | Interactive extras |
| `time` / `date` | Device-local clock |
| `game` / `guess 50` / `game stop` | Number Hunt: find a number from 1–100 |
| `history` / `clear` | View history or clear recent output |
| `exit` | Return to Professional mode |

Up/down recalls commands; Tab completes a unique command; Ctrl+L clears output. Results auto-scroll within the console. Navigation collapses output to preserve reading space.

Commands are parsed locally, never executed as shell code. External links come from curated data. No public-IP lookup or network ping is performed. Game and command history reset on reload.

## Editing

| File | Purpose |
| --- | --- |
| `src/projects.ts` | Shared projects, contribution notes, attribution, and links |
| `src/profile.ts` | Shared experience, tools, education, and contact details |
| `src/main.tsx` | Mode selection and professional presentation |
| `src/Terminal.tsx` | Terminal interface and interaction state |
| `src/commands.ts` | Pure command resolver |
| `src/styles.css`, `refinements.css`, `motion.css` | Professional styling and motion |
| `src/terminal*.css` | Terminal styling and responsive console |
| `tests/commands.test.mjs` | Command resolver tests |

Add entries to `src/projects.ts`; Professional mode initially shows three, with the remainder under See more. Terminal mode lists all entries. Keep shared personal information in `src/profile.ts` and update professional introductory prose when changing positioning.

## Content and attribution

RT Chat is the featured independent backend project. EventApp extends a tutorial-based Go API, credited in its project notes. Professional entries describe scoped contributions using anonymized titles. They contain no client records, private repository links, or proprietary source. Do not add internal briefs, credentials, customer details, biometric media, or private deployment information to this repository.

The site needs no environment variables or backend. Google Fonts provides professional typography with system fallbacks. Email uses `mailto:`; there is no contact-form service, analytics integration, or application database. Dependencies retain their respective licenses.

Reduced-motion preferences disable decorative animation. Both modes support clickable navigation and keyboard controls. Mobile layout has received manual review; full browser and assistive-technology testing remain launch tasks.

## Before deployment

- Complete final content/confidentiality review; confirm education details and add a resume when ready.
- Check both modes on desktop/mobile, keyboard navigation, reduced motion, and external links.
- Choose hosting and a domain. Hosting at a subdirectory may require a matching Vite base-path setting.

No open-source license has been selected. Package metadata is marked `UNLICENSED`; no third-party licensing terms are changed.
