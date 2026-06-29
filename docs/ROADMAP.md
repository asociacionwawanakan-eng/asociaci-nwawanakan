# ROADMAP DE OPTIMIZACIÓN PROFESIONAL
## Asociación Wawanakan Kusisinapa — Sitio Web Institucional

> **Estado general:** Fases 0–5 completadas íntegramente. Fase 6 completada (pendiente: dimensiones de imagen). Fase 7 en progreso (variables CSS aplicadas; pendiente: !important, breakpoints, espaciado).

---

## Progreso general

| Fase | Descripción | Estado |
|------|-------------|--------|
| Fase 1 | Refactorización estructural (CSS, DRY HTML, JSON) | ✅ Completada |
| Fase 2 | Accesibilidad y normalización de texto | ✅ Completada |
| Fase 3 | Rendimiento y calidad de código | ✅ Completada |
| Fase 0 | Reorganización profesional de archivos | ✅ Completada |
| Fase 4 | Calidad de datos y contenido | ✅ Completada |
| Fase 5 | SEO y metadatos | ✅ Completada |
| Fase 6 | Accesibilidad WCAG profunda | ⚠️ Completada (pendiente: §6.4) |
| Fase 7 | Arquitectura CSS | ⚠️ En progreso (pendiente: §7.2, §7.3, §7.4) |

> **Nota:** La Fase 0 fue prerequisito obligatorio. Establece la estructura de carpetas escalable `public/` sobre la que se construirá la futura integración de servicios externos.

---

## Fase 0 — Reorganización profesional de archivos ✅

**Objetivo:** Establecer una arquitectura de proyecto escalable, limpia y lista para despliegue antes de continuar cualquier optimización.

### Estructura implementada

```
asociaci-nwawanakan/
│
├── public/                          ← Raíz pública
│   │
│   ├── index.html                   ← Página de inicio
│   ├── centros.html
│   ├── contactos.html
│   ├── nosotros.html
│   ├── nuestro-equipo.html
│   ├── pasantia.html
│   ├── quienes-somos.html
│   ├── valores.html
│   └── voluntariado.html
│   │
│   ├── assets/
│   │   ├── hero/                    ← Imágenes de portada (hero1-7.jpg)
│   │   ├── mision/                  ← Carrusel de misión (mision1-4.jpg)
│   │   ├── vision/                  ← Carrusel de visión (vision1-4.jpg)
│   │   ├── equipo/                  ← Fotos del directorio (presidenta1.png, etc.)
│   │   ├── centros/                 ← Fotos de centros infantiles
│   │   ├── institucional/           ← Logotipo, aliados
│   │   └── contenido/               ← Resto de imágenes de secciones
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── components.js            ← Header/footer compartidos
│   │   └── main.js                  ← Lógica principal (renombrado de script.js)
│   │
│   └── data/
│       ├── centers.json
│       └── config.json
│
├── docs/                            ← Documentación interna
│   ├── AUDIT_REPORT.md
│   └── ROADMAP.md                   ← Este archivo
│
├── .gitignore
└── README.md
```

### Lista de tareas

#### 0.1 — Preparación de estructura base
- [x] Crear carpeta `public/`
- [x] Crear carpeta `public/assets/hero/`
- [x] Crear carpeta `public/assets/mision/`
- [x] Crear carpeta `public/assets/vision/`
- [x] Crear carpeta `public/assets/equipo/`
- [x] Crear carpeta `public/assets/institucional/`
- [x] Crear carpeta `public/assets/contenido/`
- [x] Crear carpeta `public/css/`
- [x] Crear carpeta `public/js/`
- [x] Crear carpeta `public/data/`
- [x] Crear carpeta `docs/`

#### 0.2 — Mover y renombrar archivos HTML
- [x] Mover los 9 archivos `.html` → `public/`
- [x] Mover `style.css` → `public/css/style.css`
- [x] Mover `script.js` → `public/js/main.js`
- [x] Mover `js/components.js` → `public/js/components.js`
- [x] Mover `data/centers.json` → `public/data/centers.json`
- [x] Mover `data/config.json` → `public/data/config.json`

#### 0.3 — Organizar imágenes por categoría
- [x] Mover a `public/assets/hero/`: `hero1.jpg` – `hero7.jpg`
- [x] Mover a `public/assets/mision/`: `mision1.jpg` – `mision4.jpg`
- [x] Mover a `public/assets/vision/`: `vision1.jpg` – `vision4.jpg`
- [x] Mover a `public/assets/equipo/`: `presidenta1.png`, `vicepresidenta.png`, `actas1.png`, `nacional.png`, `tesoreria.png`, `internacional.png`, `equipo.png`
- [x] Mover a `public/assets/institucional/`: `logotipo.png`, `aliado1.png`
- [x] Mover a `public/assets/contenido/`: `objetivo.jpg`, `quienes-somos.jpg`, `voluntariado.png`, `voluntariado2.jpg`, y todas las imágenes de fondo y sección
- [x] Mover `assets/centros/` → `public/assets/centros/` (estructura interna preservada)

#### 0.4 — Renombrar archivos con espacios a kebab-case
- [x] `"actividad don donbosquito.jpg"` → `actividad-donbosquito.jpg`
- [x] `"fondo contactos.jpg"` → `fondo-contactos.jpg`
- [x] `"fondo equipo.jpg"` → `fondo-equipo.jpg`
- [x] `"fondo inicio.jpeg"` → `fondo-inicio.jpg`
- [x] `"fondo pasan.jpg"` → `fondo-pasantia-proceso.jpg`
- [x] `"fondo pasantia.jpg"` → `fondo-pasantia.jpg`
- [x] `"logotipo don bosquito.jpg"` → `logotipo-donbosquito.jpg`
- [x] `"pasantia foto.jpg"` → `foto-pasantia.jpg`
- [x] `"portada donbosquito.jpg"` → `portada-donbosquito.jpg`

#### 0.5 — Actualizar todas las referencias de rutas
- [x] Actualizar rutas en los 9 archivos HTML (`src="assets/..."` → rutas con subcarpeta)
- [x] Actualizar rutas en `public/js/components.js` (logo en header y footer)
- [x] Actualizar rutas en `public/js/main.js` (template literals de `getCenterProfile`)
- [x] Actualizar `href="style.css"` → `href="css/style.css"` en los 9 HTML
- [x] Actualizar `src="script.js"` → `src="js/main.js"` en los 9 HTML
- [x] Actualizar `background-image: url(...)` en `public/css/style.css` (rutas `assets/` → `../assets/`)
- [x] Actualizar `public/data/config.json` campo `institutionLogo`

#### 0.6 — Limpiar archivos obsoletos
- [x] Eliminar `style.backup.css`
- [x] Mover `AUDIT_REPORT.md` → `docs/AUDIT_REPORT.md`
- [x] Mover `ROADMAP.md` → `docs/ROADMAP.md`
- [ ] Auditar imágenes huérfanas no referenciadas (`hero6.jpg`, `mision.jpg`, `vision.jpg`, `vision4.jpg`) — conservadas por precaución

#### 0.7 — Archivos de configuración del proyecto
- [x] Crear `.gitignore`
- [ ] Crear `firebase.json` — pendiente hasta definir objetivo de despliegue
- [ ] Crear `.firebaserc` — pendiente hasta tener proyecto configurado

#### 0.8 — Verificación
- [ ] Levantar servidor local desde `public/` y verificar que todas las páginas cargan
- [ ] Verificar que los carruseles funcionan (hero, misión, visión)
- [ ] Verificar que `centros.html` carga los distritos desde `data/centers.json`
- [ ] Confirmar que no hay referencias rotas en consola del navegador

---

## Fase 4 — Calidad de datos y contenido ✅

**Objetivo:** Corregir todos los errores de contenido visible para el usuario.

### Lista de tareas

#### 4.1 — Corrección de `data/centers.json`
- [x] `"Sagrado Corazon de Jesus"` → `"Sagrado Corazón de Jesús"` (nombre + key del objeto)
- [x] `"Maria Auxiliadora"` → `"María Auxiliadora"` (nombre + key del objeto)
- [x] `"San Francisco de Asis"` → `"San Francisco de Asís"` (nombre + key del objeto)
- [x] `subtitulo` Don Bosquito: `"acompanamiento"` → `"acompañamiento"`, `"formacion"` → `"formación"`
- [x] `subtitulo` María Auxiliadora: `"acompanamiento"` → `"acompañamiento"`, `"formacion"` → `"formación"`
- [x] `address` María Auxiliadora: `"Raul Salmon"` → `"Raúl Salmón"`
- [x] `address` San Francisco de Asís: `"Rio"` → `"Río"`
- [x] `subtitulo` Cristo del Consuelo: `"proteccion"` → `"protección"`, `"ninas"` → `"niñas"`, `"ninos"` → `"niños"`
- [x] `name` Palliri: `"Fundacion Palliri"` → `"Fundación Palliri"`
- [x] `subtitulo` Palliri: `"formacion"` → `"formación"`
- [x] `address` Palliri: `"Perez"` → `"Pérez"`, `"Heroes"` → `"Héroes"`
- [x] `subtitulo` Virgen de la Fuensanta: `"acompanamiento"` → `"acompañamiento"`
- [x] `subtitulo` Sagrado Corazón: `"participacion"` → `"participación"`
- [x] `subtitulo` Burgosmarka: `"ninez"` → `"niñez"`
- [x] `subtitulo` Nueva Marka: `"acompanamiento"` → `"acompañamiento"`, `"proteccion"` → `"protección"`
- [x] `address` Nueva Marka: `"modulo"` → `"módulo"`
- [x] `subtitulo` Mi Rinconcito: `"calido"` → `"cálido"`
- [x] `address` Mi Rinconcito: `"Potosi"` → `"Potosí"`
- [x] `activities[1]`: `"Acompanamiento"` → `"Acompañamiento"`
- [x] `activities[2]`: `"Nutricion"` → `"Nutrición"`
- [x] `activities[5]`: `"Participacion"` → `"Participación"`
- [x] `impactDescriptions[0]`: `"participacion"` → `"participación"`, `"ninas"` → `"niñas"`, `"ninos"` → `"niños"`
- [x] `impactDescriptions[2]`: `"ninez"` → `"niñez"`, `"acompanamiento"` → `"acompañamiento"`

#### 4.2 — Corrección de `data/config.json`
- [x] `facebookLink`: URL real `https://www.facebook.com/profile.php?id=61590971327508&locale=es_LA`
- [x] `whatsappLink`: número real `https://wa.me/59179164334`

#### 4.3 — Corrección de `public/js/main.js`
- [x] Línea ~89 — fallback subtitle: `"Centro infantil con acompanamiento, cuidado y formacion integral"` → con tildes

#### 4.4 — Corrección de `public/pasantia.html`
- [x] Botón Facebook hardcodeado: URL real de la institución
- [x] Botón WhatsApp hardcodeado: número real

#### 4.5 — Verificación
- [ ] Abrir `centros.html` → clic en cada centro → verificar textos en el modal
- [ ] Verificar que los links de Facebook y WhatsApp en el modal abren la página real

---

## Fase 5 — SEO y metadatos ✅

**Objetivo:** Sitio indexable por buscadores y compártible en redes sociales con vista previa correcta.

### Lista de tareas

#### 5.1 — Favicon
- [x] `<link rel="icon">` apuntando a `logotipo.png` en las 9 páginas
- [ ] Crear archivo `.ico` oficial (32×32) y Apple touch icon (180×180) para reemplazar el PNG provisional

#### 5.2 — Meta descriptions únicas por página
- [x] `centros.html`
- [x] `contactos.html`
- [x] `nosotros.html`
- [x] `nuestro-equipo.html`
- [x] `pasantia.html`
- [x] `quienes-somos.html`
- [x] `valores.html`
- [x] `voluntariado.html`

#### 5.3 — Open Graph (social sharing)
- [x] `index.html` — og:type, og:site_name, og:title, og:description, og:image, og:url
- [x] `centros.html`
- [x] `contactos.html`
- [x] `nosotros.html`
- [x] `nuestro-equipo.html`
- [x] `pasantia.html`
- [x] `quienes-somos.html`
- [x] `valores.html`
- [x] `voluntariado.html`

#### 5.4 — Consistencia de títulos
- [x] `centros.html`: "Centros Infantiles | Asociación Wawanakan Kusisinapa"
- [x] `contactos.html`: "Contactos | Asociación Wawanakan Kusisinapa"
- [x] `nosotros.html`: "Nosotros | Asociación Wawanakan Kusisinapa"
- [x] `nuestro-equipo.html`: "Nuestro Equipo | Asociación Wawanakan Kusisinapa"
- [x] `pasantia.html`: "Pasantías | Asociación Wawanakan Kusisinapa"
- [x] `quienes-somos.html`: "Quiénes Somos | Asociación Wawanakan Kusisinapa"
- [x] `valores.html`: "Valores | Asociación Wawanakan Kusisinapa"
- [x] `voluntariado.html`: "Voluntariado | Asociación Wawanakan Kusisinapa"

#### 5.5 — Canonical links
- [x] Canonical añadido a las 9 páginas (usando URL de GitHub Pages como base provisional)
- [ ] Actualizar URLs canonical y og:url al dominio definitivo de producción

#### 5.6 — Verificación
- [ ] Validar con Facebook Open Graph Debugger que las vistas previas son correctas
- [ ] Confirmar que el favicon aparece en la pestaña del navegador

---

## Fase 6 — Accesibilidad WCAG profunda ⚠️

**Objetivo:** Conformidad WCAG 2.1 nivel AA.

### Lista de tareas

#### 6.1 — Jerarquía de encabezados
- [x] `nosotros.html`: `<h2 class="sr-only">Áreas de acción institucional</h2>` añadido antes de las 3 quick-cards; h1 "misión" con tilde
- [x] `valores.html`: `<h2 class="sr-only">Nuestros valores</h2>` añadido antes de la grilla
- [x] `nuestro-equipo.html`: `<h2 class="sr-only">Directorio institucional</h2>` añadido; `.equipo-separator` marcado `aria-hidden`
- [x] `index.html` — jerarquía revisada: h2 existentes cubren correctamente cada sección

#### 6.2 — Estilos de foco para teclado
- [x] Utilidad `.sr-only` añadida al CSS
- [x] Regla global `:focus-visible` con anillo dorado `var(--gold)` 3px, offset 3px
- [ ] Verificar foco en: botones de navegación, carrusel, tarjetas con `tabindex`, formulario

#### 6.3 — `prefers-reduced-motion` completo
- [x] Regla universal al final del CSS: `*, *::before, *::after { animation-duration: 0.01ms !important; ... }`
- [x] Cubre todos los `@keyframes` del sitio (sparkleFloat, waveDrift, frequencyPulse, etc.)

#### 6.4 — Dimensiones de imágenes (CLS — Core Web Vitals)
- [ ] Añadir `width` y `height` a las imágenes estáticas del sitio (requiere dimensiones reales de cada archivo)
- [ ] Priorizar: logotipo en header/footer, imágenes de directores, objetivo, aliados
- [ ] Imágenes de carrusel: añadir dimensiones reales

#### 6.5 — Verificación
- [ ] Auditoría Lighthouse (Accessibility) — objetivo: score ≥ 90
- [ ] Navegación completa por teclado (Tab, Enter, Escape)
- [ ] Verificar con DevTools → "prefers-reduced-motion: reduce"

---

## Fase 7 — Arquitectura CSS ⚠️

**Objetivo:** Eliminar la deuda técnica estructural del CSS.

> ⚠️ **Fase de mayor riesgo visual.** Requiere testing exhaustivo después de cada cambio.

### Lista de tareas

#### 7.1 — Aplicar variables CSS existentes
- [x] `border-radius: 24px` → `var(--radius-md)` (20 instancias)
- [x] `border-radius: 12px` → `var(--radius-sm)` (3 instancias)
- [x] `border-radius: 32px` → `var(--radius-lg)` (8 instancias)
- [x] `border-radius: 999px` → `var(--radius-pill)` (72 instancias)
- [x] `180ms ease` → `var(--transition-fast)` (15 instancias)
- [x] `220ms ease` → `var(--transition-normal)` (3 instancias)
- [x] `300ms ease` → `var(--transition-slow)` (1 instancia)
- [ ] Reemplazar valores de `box-shadow` con `var(--shadow-card)` y `var(--shadow-strong)`

#### 7.2 — Normalizar breakpoints
Consolidar de 20 valores únicos a 6 estándar (sm 576px / md 768px / lg 992px / xl 1200px):
- [ ] Mapear y fusionar breakpoints no estándar (360px, 420px, 480px, 560px, 600px, 620px, 640px, 680px, 700px, 820px, 840px, 900px, 980px, 1024px, 1100px, 1180px)
- [ ] Aplicar cambios verificando visualmente en cada página
- [ ] Objetivo: ≤ 6 breakpoints únicos

#### 7.3 — Reducir `!important`
- [ ] Auditar cada `!important` e identificar causa (conflicto de especificidad vs. necesidad real)
- [ ] Refactorizar selectores para aumentar especificidad en lugar de usar `!important`
- [ ] Objetivo: reducir de ~800 a menos de 50 `!important` justificados

#### 7.4 — Normalizar espaciado
- [ ] Identificar padding/margin más frecuentes fuera de la escala modular
- [ ] Redondear al valor de la escala más cercano: `--space-sm` (8px), `--space-md` (16px), `--space-lg` (24px)

#### 7.5 — Verificación
- [ ] Comparar screenshots antes/después de cambios masivos
- [ ] Verificar en mobile (360px), tablet (768px) y desktop (1200px+)
- [ ] Lighthouse → Performance — objetivo: ≥ 85

---

## Métricas de éxito

| Fase | Métrica | Objetivo | Estado |
|------|---------|---------|--------|
| 0 | Archivos en `public/`, sin referencias rotas | 0 errores en consola | ✅ |
| 4 | Tildes en datos JSON | 0 palabras sin tilde | ✅ |
| 5 | Lighthouse SEO score | ≥ 90 | ✅ (pendiente verificación) |
| 6 | Lighthouse Accessibility score | ≥ 90 | ⚠️ Pendiente audit |
| 7 | `!important` en CSS | < 50 | ⏳ |
| 7 | Breakpoints únicos | ≤ 6 | ⏳ |

---

## Registro de fases completadas

### Fase 1 — Refactorización estructural ✅
- CSS reducido de 15.008 → 11.876 líneas (−21%)
- Header/footer DRY via `js/components.js`
- Datos externalizados a `data/centers.json` y `data/config.json`
- Variables CSS añadidas al `:root`

### Fase 2 — Accesibilidad y normalización de texto ✅
- 6 alt texts vacíos corregidos (hero × 5 + pasantía × 1)
- 4 aria-labels normalizados en `js/components.js`
- Entidades HTML eliminadas en `index.html` y `contactos.html`
- Tildes corregidas en HTML y JavaScript
- Formulario: `AbortController` (10s timeout), `aria-busy`, `aria-atomic`

### Fase 3 — Rendimiento y calidad de código ✅
- 3 funciones `stopCarousel` añadidas
- 3 `IntersectionObserver` para pausa/reanudación de carruseles
- 8 imágenes con `loading="lazy"` (directores, voluntariado, pasantía)
- Comentarios en `showSlide()` (doble rAF) y `openCenter()` (DOM surgery)
- Texto sin tilde corregido en template literals de `openCenter`

### Fase 0 — Reorganización de archivos ✅
- 75 archivos movidos, renombrados y organizados en estructura `public/`
- 8 nombres con espacios convertidos a kebab-case
- 100% de referencias actualizadas (HTML, CSS, JS, JSON)
- `.gitignore` creado, `style.backup.css` eliminado
- Documentación movida a `docs/`

### Fase 4 — Calidad de datos ✅
- 23+ correcciones de tildes en `centers.json`
- Claves de diccionario actualizadas consistentemente
- `config.json` con URLs reales de Facebook y WhatsApp
- Botones hardcodeados corregidos en `pasantia.html`

### Fase 5 — SEO y metadatos ✅
- Meta description, Open Graph completo (6 tags), favicon y canonical en las 9 páginas
- Títulos estandarizados: "Página | Asociación Wawanakan Kusisinapa"

### Fase 6 — Accesibilidad WCAG (parcial) ✅
- `.sr-only`, `:focus-visible` global, `prefers-reduced-motion` universal
- Jerarquía h1→h2→h3 corregida en 3 páginas

### Fase 7 — Variables CSS (parcial) ✅
- 103 `border-radius` → variables `--radius-*`
- 19 transiciones → variables `--transition-*`

---

*Última actualización: 2026-06-29 | Responsable: Leonardo Ibarra*
