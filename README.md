<div align="center">

# NOOBMKGAMER

### Gamer · Creator · Digital Explorer

A cinematic, neon-powered personal portfolio built as an interactive digital domain.

<p>
  <a href="https://github.com/ALoo-111/Portfolioaloo"><strong>Explore the repository</strong></a>
  ·
  <a href="#getting-started">Run it locally</a>
  ·
  <a href="#project-structure">View the architecture</a>
</p>

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111827)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-3D-000000?style=for-the-badge&logo=threedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

---

## Overview

**NOOBMKGAMER** is a single-page portfolio experience designed around a game-inspired digital interface. It combines a boot sequence, a security-themed landing screen, animated matrix rain, layered neon gradients, CSS 3D texture, glassmorphism, responsive layout behavior, and a scrollable portfolio domain.

The site is intentionally more than a static profile page. Its first impression behaves like a launch experience, while the main content presents the creator’s profile, capabilities, featured games, digital projects, YouTube channel, and contact flow in a cohesive visual system.

> **Design direction:** cinematic cyberpunk, colorful glass surfaces, responsive 3D depth, and clear content hierarchy.

## Experience map

| Surface | What visitors see | Interaction |
| --- | --- | --- |
| **Boot screen** | Matrix rain, animated rainbow title, staged boot log, progress link, orbiting cube, and neon depth layers | Automatically transitions into the landing screen |
| **Hero / landing** | Security portal introduction, 3D texture field, gyroscope emblem, perspective grid, aurora lighting, and primary calls to action | Enter the domain or jump directly to content |
| **Player profile** | Identity card, avatar, classification, location, status, and skills summary | Scroll reveal and responsive card layout |
| **Core skills** | Capability cards with animated progress indicators | Progress animations respect reduced-motion preferences |
| **Featured games** | Game cards for Free Fire, PUBG Mobile, Clash of Clans, GTA, Minecraft, and Mobile Legends | Hover tilt, image treatment, and accent glow |
| **Digital projects** | BattleTracker Pro, Clan Management Hub, and Loot Analyzer | Project summaries with demo affordances |
| **YouTube channel** | Gaming stream archive callout | External channel link |
| **Connection terminal** | Contact form with transmission state feedback | Formspree-powered message submission |

## Built with

| Technology | Role in the project |
| --- | --- |
| [React](https://react.dev/) | Component-driven UI and application state |
| [TypeScript](https://www.typescriptlang.org/) | Typed React implementation and safer refactoring |
| [Vite](https://vite.dev/) | Fast development server and production bundling |
| [Tailwind CSS](https://tailwindcss.com/) | Utility classes and responsive layout primitives |
| [Framer Motion](https://motion.dev/) | Entrance transitions, magnetic controls, and interaction polish |
| [Three.js](https://threejs.org/) | Decorative WebGL depth layer for the post-entry portfolio surface |
| [GSAP](https://gsap.com/) | Scroll-reveal and ambient motion orchestration |
| [Lucide](https://lucide.dev/) | Lightweight interface iconography |

## Getting started

### Prerequisites

You need **Node.js 18 or newer** and npm. Verify the installation before continuing:

```bash
node --version
npm --version
```

### Installation

Clone the repository, enter the project directory, and install dependencies:

```bash
git clone https://github.com/ALoo-111/Portfolioaloo.git
cd Portfolioaloo
npm install
```

### Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:3000`.

### Run quality checks

```bash
npm run lint
npm run build
```

`npm run lint` runs the TypeScript compiler in no-emit mode. `npm run build` creates the production bundle in `dist/` and is the fastest way to verify that the application is ready for deployment.

## Project structure

```text
Portfolioaloo/
├── public/
│   └── images/             # Profile, game, and project artwork
├── src/
│   ├── App.tsx             # Application UI, interactions, and portfolio sections
│   ├── index.css           # Global styles, visual system, and nx-prefixed hero/boot styles
│   └── main.tsx            # React entry point
├── index.html              # Document shell and metadata
├── package.json             # Scripts and dependencies
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts          # Vite and Tailwind integration
```

The app intentionally keeps its main experience in `src/App.tsx` so the boot flow, landing flow, and content flow can be reviewed together. New landing and boot styles use the `nx-` prefix, making the redesign easier to locate and safer to evolve.

## Motion and accessibility

The experience uses motion as part of its identity, but it is designed to remain usable when motion is unavailable or undesirable. The implementation listens for `prefers-reduced-motion`, reduces or disables decorative animation, avoids decorative layers intercepting pointer input, preserves keyboard-usable controls, and keeps the main portfolio content available after the launch sequence.

The visual 3D layers are decorative rather than content-critical. The hero’s CSS texture and the portfolio’s ambient depth effects can be removed or reduced without changing the information architecture of the page.

## Deployment

This is a client-side Vite application and can be deployed to any static hosting provider that supports a single-page frontend. Build the project first:

```bash
npm run build
```

Publish the generated `dist/` directory. For hosts that require client-side route fallback configuration, route all unknown paths to `index.html`; the current portfolio primarily uses in-page hash navigation such as `#profile`, `#skills`, and `#contact`.

## Customization guide

Update the portfolio content in `src/App.tsx`. Replace artwork in `public/images/` while keeping the existing file paths, or update the corresponding image references in the card data and JSX. Adjust the color language, gradients, responsive rules, and motion behavior in `src/index.css`.

For the launch experience, preserve the following contracts when making changes:

- The boot overlay uses `z-[9999]` while it is loading.
- The landing screen uses `z-[95]` until the visitor enters the domain.
- The navigation remains hidden until `enteredDomain` becomes true.
- The existing `handleEnterDomain` and `handleWatchContent` handlers control the two hero actions.
- Page 3 contains the main portfolio content and should remain functionally independent of the launch visuals.

## Project status

The portfolio is an active personal showcase. The main experience, responsive mobile treatment, animated hero background, game and project cards, YouTube callout, and contact flow are implemented. There is currently no automated CI workflow or license file in the repository; add both before adopting this project as a distributed starter or open-source template.

## Contributing

Suggestions and focused improvements are welcome. Before opening a pull request, run the type check and production build, keep changes scoped to the requested surface, preserve the mobile layout, and verify that reduced-motion behavior still works. For larger visual changes, include a short before-and-after description and screenshots in the pull request.

## Contact

The primary public touchpoint is the [NoobMKGamer YouTube channel](https://youtube.com/@NoobMKGamer). For repository-specific issues, use [GitHub Issues](https://github.com/ALoo-111/Portfolioaloo/issues).

## References

[1]: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes "GitHub Docs — About README files"
[2]: https://github.com/othneildrew/Best-README-Template "Best-README-Template — README structure reference"

This README follows GitHub’s guidance for communicating a project’s purpose, usefulness, setup path, support channel, and maintainership, while adapting the section hierarchy and presentation patterns demonstrated by the referenced template [1] [2].
