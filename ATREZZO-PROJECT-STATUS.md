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

## Prueba de navegador completada — 12 noviembre 2026
GitHub Actions [43123397331](https://github.com/atrezzostudiosv-spec/Five-Stones-Safety/actions/runs/43123397331) terminó con **success** en Chromium: 375, 768, 1024 y 1440 px, carrusel táctil/teclado (flecha en móvil), carga de ATZ-MOT-001/006, navegación real Veil hacia Safety Platform, contenidos de Videos y reduced motion. Capturas anexadas en artefacto del workflow. **No equivale a aprobación visual manual ni a `client_ready:true`**, que sigue pendiente de revisión estética y navegadores adicionales.

## Revisión de sentido comercial y dirección visual — 12 noviembre 2026
Se revisó el propósito empresarial contra fuentes oficiales FiveStones Safety y CENTEGIX: comprador prioritario = liderazgo de distritos escolares, responsables de seguridad/tecnología; FiveStones presta integración, comunicación, capacitación, pruebas y soporte de la solución CENTEGIX.
- **Home / Our Approach preview**: sustituido el recurso de audiencia vista de espaldas + cinco nombres sin descripción por recorrido de cinco fases con una línea explicativa para cada una; ningún recurso fotográfico ajeno se asigna a un servicio.
- **Safety Platform**: sustituido el enorme titular y cuatro enlaces con idéntico destino por un esquema editorial explicativo con activación de alerta, localización y coordinación, preservando los cuatro casos de uso y el enlace a su página interna. El SVG es un esquema conceptual, no una captura de CENTEGIX.
- **Our Approach móvil/escritorio**: conservado ATZ-MOT-006 con cinco capítulos y sus textos reales; se suprimen las cinco fotos genéricas de los pasos, la franja amarilla redundante y el contador sobrepuesto. En desktop quedan cinco escenas conceptuales vinculadas al capítulo activo; en móvil el contenido se presenta compacto. El bloque posterior utiliza un caso referenciado de Argyle ISD en lugar de una foto escolar sin contexto.
- **Videos y Customer Stories**: se han cambiado diez previews ajenos a sus vídeos por thumbnails del ID original de YouTube; cuando una miniatura no esté disponible se muestra un fondo de marca en lugar de otra escuela.
- **Verificación:** GitHub Actions Chromium **43128245817 success**, después de QA visual y técnica en las cuatro anchuras. Las capturas de la ejecución 43128140438 permitieron detectar y corregir el contador conflictivo. Revisión editorial humana de capturas de las tres secciones completada aquí; validación Safari/Firefox y medios remotos en producción sigue pendiente.
- Prohibido volver a colocar fotos decorativas como supuesta prueba de un servicio o posters de vídeos de otro distrito. Seleccionar componentes solo por utilidad explicativa; no volver a la cuadrícula anterior.
