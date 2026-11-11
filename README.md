# Five Stones Safety — ATREZZO Rebuild / Review Concept

This repository is the **fully navigable ATREZZO redesign concept** for the Five Stones Safety website. It is not the live production domain.

## Experience and scope

- 77 directly addressable HTML routes, including the complete top-level navigation, five-stages approach, safety platform, emergency use cases, district video stories, original resource/partnership information, blog index, four complete source articles, category/tag archives and legacy route aliases.
- Five video IDs recovered from original source, playable in-page via click-to-load YouTube embeds.
- Resources are available as **internal viewer pages**, with the PDF still fetched from its original Five Stones Safety file host inside an iframe until assets can be fully self-hosted for production.
- Contact, demo request and technical support forms are **interactive demos only**: validation and preview acknowledgement, **no outgoing requests, email, CRM connection, persistence, analytics or ticket generation**.
- Header, footer, cards, article routes, calls to action and internal navigation link only to pages created in this repository; no outbound navigation to the former Squarespace site.
- Original ATREZZO components integrated by exact identifier: `ATZ-MOT-001`, `ATZ-MOT-006`, `ATZ-SVC-001` (Home 1+4 bento) and `ATZ-PGT-001` (site-wide Veil). Components are source-isolated and brand-adapted; no forced global smooth scrolling.
- Designed as responsive desktop/tablet/mobile layouts. Automated Chromium checks passed at 375/768/1024/1440 with screenshots, carousel keyboard, route navigation and reduced motion; independent aesthetic review, Safari/Firefox and real device QA remain pending. See QA report.

## Files

- `index.html` — Home
- `safety-platform/index.html`, `our-approach/index.html`, `use-cases/index.html` — core content
- `customer-stories/index.html`, `videos/index.html` — district proof and media
- `resources/index.html`, `resources/document/*` — internal resource library
- `school-safety-security/index.html`, `school-safety-security/*/index.html` — full journal and archives
- `contact/index.html`, `contactus/index.html`, `techsupport/index.html` — preview-only forms
- `assets/site.css`, `assets/site.js` — project identity and interactions
- `components/motion/`, `components/servicios/`, `assets/atrezzo-transitions.*` — isolated ATREZZO modules and runtime
- `ATREZZO-SITE-MAP.json` — original routes, migration map, article and video inventory
- `QA-REPORT.md` — test results and unverified items

## Source integrity

Business descriptions, published stories and article texts are derived from the authorized full capture of `https://fivestonessafety.com/` dated November 10, 2026. The design deliberately avoids new unsupported metrics or certifications. Existing credential badges are labelled as source-site statements pending revalidation.

Photographs are initially served from original public Squarespace image URLs; the offline distribution includes local fallbacks. Original videos play in on-site iframes; no buttons navigate to external websites. Before a commercial production launch, the media should be fully hosted and licensing, responsive runtime, keyboard behavior, video embeds, PDF frames and SEO indexing rechecked.

## GitHub Pages

Use Settings → Pages → Deploy from branch `main` / `(root)`. The preview path is the repository Pages URL; no DNS changes are made. All pages are marked `noindex,nofollow` during client review.
## Browser QA evidence
[GitHub Actions — responsive Chromium QA](https://github.com/atrezzostudiosv-spec/Five-Stones-Safety/actions/runs/43123397331) passed. Screenshots are preserved as an artifact of the workflow run. This is not a substitute for manual creative direction or commercial launch approval.
