# Five Stones Safety — ATREZZO Project Status

## Source and scope
Source: `FiveStonesSafety-COMPLETO.zip` (43 processed URLs; 42 HTTP 200 captures, one request-demo 404), 4 unique long-form blog posts, 13 tag archives, five discovered YouTube embeds and resources.

## Visual direction
An editorial, high-contrast institutional site with warm ivory, deep teal, original school photography, measured gold accent, intentional typography and differentiated page-family layouts.

## Original ATREZZO integrations
- `ATZ-MOT-001` Text Reveal: Home statement, original source module and runtime.
- `ATZ-MOT-006` Editorial Journey: five-step Our Approach, original source module and runtime.
- Both must be validated at 375/768/1024/1440, reduced-motion, reverse scrolling and keyboard before production. No forced GSAP or global smooth scroll.

## Demo policy
All forms are UI-only and do not collect or transmit data. Video embeds are intentionally initiated by click and play within the site. External media assets may be fetched from original authorized sources; they do not navigate the user to the old site. Original PDF source displayed inside on-site viewer frames; final self-hosting to be completed before launch. SEO indexing disabled in this demonstration.

## Evidence
See `ATREZZO-SITE-MAP.json` for original URL mapping and media IDs. See `QA-REPORT.md` for completed and remaining checks.
## Atrezzo — integración directa (12 noviembre 2026)
Se ha incorporado **ATZ-SVC-001** al Home mediante sus archivos de librería originales, usando bento 1+4 en escritorio, scroll-snap y flechas de teclado en móvil y reveal original con reduced motion. Se conserva el contenido de los cuatro escenarios existentes y todos sus destinos internos. Los colores, fotografías locales y tipografía se adaptan con CSS específico de Five Stones, sin copiar trabajos ni medios de Tri-Lane. **Integración visual y funcional en navegador real: pendiente de QA**, estado `validation` / `client_ready:false`. Se mantienen ATZ-MOT-001 y ATZ-MOT-006.

## Navegación ATREZZO Veil, 12 noviembre 2026
- **ATZ-PGT-001:** CSS, motor y preflight originales de ATREZZO TRANSITIONS 01 integrados en los 77 documentos HTML con rutas relativas según profundidad de carpeta.
- El inicializador compartido selecciona navegación primaria, footer, tarjetas editoriales y CTA internos. No modifica clics externos, anclas, descargas ni formularios. Transición original 480 ms de entrada y 560 ms de salida, Web Animations API, sin GSAP ni scroll forzado. Funciona sin JavaScript como navegación nativa y respeta reduced motion.
- **Inventario de componentes originales integrados:** ATZ-MOT-001, ATZ-MOT-006, ATZ-SVC-001, ATZ-PGT-001. Revisión responsive real, Safari/Firefox, continuidad de historial y producción siguen sin verificación; estado `validation`.
