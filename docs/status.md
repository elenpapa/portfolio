# Build Status

Updated: 2025-11-15

## Overview

- Goal: Static, single-page portfolio with content from JSON; modern, responsive design.
- Progress is tracked here and in the internal TODO list.

## Checklist

- [x] Content JSON schema defined and created (`public/content/*.json`)
  - Files: `site.json`, `home.json`, `timeline.json`, `services.json`, `posts.json`, `contact.json`
  - Note: Stored under `public/content` for simple fetching without TS config changes.
- [x] Typed content service (`src/services/content.ts`) with `getSite`, `getHome`, `getTimeline`, `getServices`, `getPosts`, `getContact`
- [x] Global styles: variables + base (`src/styles/variables.css`, `src/styles/base.css`), imported in `src/main.ts`
- [x] Layout shell and anchors via components in `App.vue`
- [x] Header with logo + nav + hamburger (`src/components/Header.vue`)
- [x] Hero section (`src/components/Hero.vue`)
- [x] Introduction section (`src/components/Introduction.vue`)
- [x] Book timeline (`src/components/BookTimeline.vue`)
- [x] Services cards (`src/components/Services.vue`)
- [x] Posts carousel (lightweight) (`src/components/PostsCarousel.vue`)
- [x] Contact form (client-side validation) (`src/components/ContactForm.vue`)
- [x] Footer with socials (`src/components/Footer.vue`)
- [x] Scroll animations (IntersectionObserver utility)
- [x] Responsiveness audit and tweaks (375/768/1024/1280)
- [x] ESLint + Prettier config and scripts
- [x] Husky + lint-staged pre-commit hook
- [x] VS Code settings to enforce formatting and ESLint
- [ ] A11y + perf pass (Lighthouse ≥ 90 for a11y)

## Notes

- Images referenced in JSON use placeholder paths like `/images/...`. Add assets under `public/images` or update JSON paths.
- Smooth scrolling is enabled globally. Further section reveal animations will respect `prefers-reduced-motion`.
- Carousel is intentionally minimal; can be swapped for Embla/Swiper later if desired.

## Next Up

1. Add scroll-reveal utility and apply to sections/cards.
2. Configure ESLint + Prettier + Husky + lint-staged + VS Code settings.
3. Run responsiveness and a11y/perf checks and iterate.
