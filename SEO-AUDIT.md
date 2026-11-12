# Five Stones Safety — Reverse engineering and SEO handoff

Audit: 12 November 2026. Sources: https://fivestonessafety.com/ (Home), /our-approach, /customer-stories, /general-2, /techsupport, /contactus, /school-safety-security. Comparison based on repository source and the published-design QA captures from Chromium run 43231546827 (four viewports).

## Original vs Atrezzo
- Home retains original positioning, twelve platform capabilities, four everyday emergency scenarios and the 98% claim attributed to the source; two original videos, three SPAT comparison options, eight benefit areas, six testimonial perspectives, four credential images, brochure/infographic/client-list access and contact details. Current Atrezzo version explains implementation through an extra five-stage Chapter Rail and adds a journal preview. The first product photo is full-bleed parallax and the two low-resolution videos are proportioned beside copy. Testimonial carousel is automatic, with controls and reduced-motion support.
- Our Approach: all five service stages, original service graphics and chapter anchors; the original discusses legislative mandates; no legal compliance guarantee is made here.
- Safety Platform and Use Cases: additional internal educational routes organize the platform, comparison and emergency scenarios. The original circular four-part system graphic is retained in Safety Platform rather than repeated in Home.
- Customer Stories: original districts and videos represented; some original testimonials/case study material is summarized or excerpted, not a verified verbatim reproduction of all case studies. Source links to case study materials should be reviewed before launch.
- Resources & Partnership, technical support, contact/demo, journal and four original article routes remain available. The preview forms intentionally do not transmit information. Seven document viewer routes point to source PDFs; external playback and documents are not guaranteed by this audit.
- Existing ATREZZO library source modules unchanged by the SEO pass. No redesign or content deletions.

## Technical SEO and social presentation
- 77 page files, 36 distinct canonical destinations, 41 aliases; exact redirect aliases and normalized tag routes consolidated. All 77 have one H1, an explicit alt attribute for each image, metadata, canonical, Open Graph, X card, structured Organization/WebSite/WebPage data, and Apple touch icon.
- Local SEO audit reports no unresolved local href/src paths or HTML fragments. External resources and live form delivery are outside the static link test.
- Local 1200×630 JPEG social card uses the existing Five Stones logo, site hero photograph and brand colors. Multi-size favicon ICO/PNG and 180×180 Apple touch icon use existing brand icon.
- Vector SVG controls replace Unicode arrow, play/pause and dot glyphs; check mark rendered via CSS; typography preserved. WebKit device emulation is not a physical iPhone test.
- Preview stays noindex,follow: it must not compete with the client's existing live domain. robots.txt allows crawlers to read metadata; on a GitHub Pages project path, root-domain robots.txt is controlled by GitHub. No production sitemap advertised. seo/sitemap-preview.xml includes planned index candidates, excluding duplicate aliases, thin tag pages and PDF wrapper pages. Production domain/canonical policy must be confirmed before running tools/prepare-seo.py --publish --base <approved production URL>. The existing official site remains untouched.
- Google Search Console, Search Console verification, 301 server migration, production forms, live analytics, accessibility review, external media and actual sharing cache tests require production access/authorization. Do not claim production ranking or complete indexing.
