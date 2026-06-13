# Harikrishnan VJ — Security Portfolio

A portfolio for a Penetration Tester & Purple Team operator.
Built to make recruiters and security leaders stop scrolling.

> _"I break systems to prove how they hold."_

## ✦ Design language

A futuristic **security-operations** aesthetic — not the tired green-on-black hacker
trope. Glass morphism, aurora mesh gradients, a live 3D network-graph hero, scroll-driven
storytelling, a custom cursor, magnetic CTAs, and editorial typography.

- **Palette** — deep void (`#04060f`) with cyan / azure / violet / magenta / aqua accents
- **Type** — Space Grotesk (display) · Inter (body) · JetBrains Mono (technical)
- **Motion** — Framer Motion reveals, Lenis smooth scroll, an R3F particle network

## ✦ Tech stack

| Layer       | Choice                                            |
| ----------- | ------------------------------------------------- |
| Framework   | Next.js 16 (App Router) + React 19 + TypeScript   |
| Styling     | Tailwind CSS v4 + a hand-built design system      |
| Animation   | Framer Motion · Lenis (smooth scroll)             |
| 3D          | three.js · @react-three/fiber                     |
| Icons       | lucide-react + custom brand glyphs                |

## ✦ Sections

`Hero → About → Expertise → Case Studies → Skills → Trajectory → Credentials → Contact`

Projects are reframed as **security case studies** (Challenge · Methodology · Findings ·
Impact) the way real assessments are reported.

## ✦ Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the build
```

## ✦ Project structure

```
src/
  app/                  layout, metadata/SEO, robots, sitemap, globals.css (design system)
  components/
    layout/             Navbar · Footer · Cursor · ScrollProgress
    providers/          SmoothScroll (Lenis)
    sections/           Hero · About · Expertise · Projects · Skills · Trajectory · Credentials · Contact
    three/              HeroScene (network-graph WebGL)
    ui/                 Reveal · SectionHeading · Magnetic · BrandIcons
  lib/data.ts           all content (single source of truth)
```

## ✦ Editing content

Everything — name, roles, stats, expertise, projects, certifications, achievements,
contact — lives in [`src/lib/data.ts`](src/lib/data.ts). Change it there; the UI follows.

## ✦ Notes

- Fully responsive (mobile-first) with a slide-in mobile nav.
- Respects `prefers-reduced-motion` — animations and smooth scroll disable gracefully.
- SEO: Open Graph + Twitter cards, robots, sitemap, semantic metadata.
- The only console message is a benign `THREE.Clock` deprecation notice.
