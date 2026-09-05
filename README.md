# akanimates

Personal portfolio and digital archive for ak.

A custom-built website bringing together my work across automotive photography and 3D CGI.

## About

This repository contains the source code for my personal portfolio website.

The site serves as a central hub for selected work, projects, collaborations, and information about my practice.

## Work

The portfolio covers:

* Automotive photography
* 3D CGI and animation
* Personal projects
* Commercial and collaborative work

## Stack

* Next.js
* React
* TypeScript
* CSS
* Vercel

## Development

Clone the repository and install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Status

Currently in active development.

The site structure, interface, motion system, and project archive are being developed and refined.

## Repository

This repository contains the website source, components, assets, and supporting files for the portfolio.

© ak

## Portfolio architecture

Home leads to About and Work. `/work` defaults to Stills; `/work?mode=stills` and `/work?mode=cgi` are shareable mode URLs. The existing switch updates browser history without a document reload.

`src/data/work-projects.ts` consolidates the preserved photography and CGI records. Its filtered project arrays drive the shared ProjectRolodex, route generation, project numbering, and same-discipline next-project loops. Existing `/photography/[slug]` and `/cgi/[slug]` URLs remain canonical because their slugs overlap between disciplines.

Former discipline index URLs redirect into Work. Former Design routes redirect to `/work`; their project content is preserved in `src/data/archive/design-projects.ts` for later reassignment and is not imported by the published portfolio. Existing media placeholders remain replaceable through the project hero and media fields.

Run `npm run lint`, `npx tsc --noEmit`, and `npm run build` for static checks. Run `npm run test:e2e -- --project=chromium` for the full browser suite, or select `--project=firefox` for the supported cross-browser checks.
