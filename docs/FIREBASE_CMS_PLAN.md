# PLAN DE IMPLEMENTACIÓN — CMS Firebase + Cloudinary
## Asociación Wawanakan Kusisinapa — Sistema de Edición de Contenido

> **Objetivo:** Añadir un panel de administración accesible solo por URL directa (`/admin`) que permita editar visualmente todo el contenido del sitio sin tocar código. Firebase Firestore almacena los datos; Cloudinary aloja todas las imágenes (compatible con Spark plan gratuito de Firebase, sin Storage).

> **Stack:** Firebase Auth (email/password) · Firebase Firestore · Cloudinary (free tier) · Vanilla JS

---

## FASE A — Infraestructura y configuración de cuentas

### A.1 — Firebase
- [ ] Crear proyecto en [console.firebase.google.com](https://console.firebase.google.com)
  - Nombre sugerido: `wawanakan-cms`
  - Plan: **Spark (gratuito)** — no activar facturación
- [ ] Activar **Firestore Database** (modo producción)
- [ ] Activar **Authentication** → proveedor **Email/Password**
- [ ] Crear usuario administrador en Authentication > Users:
  - Email: email del administrador real
  - Contraseña segura (mínimo 12 caracteres)
- [ ] Ir a Configuración del proyecto > General > Tus apps → registrar **App Web**
  - Copiar el objeto `firebaseConfig` (apiKey, authDomain, projectId, appId)
- [ ] Instalar Firebase CLI:
  ```bash
  npm install -g firebase-tools
  firebase login
  ```
- [ ] En la raíz del proyecto:
  ```bash
  firebase init
  ```
  Seleccionar: **Hosting** + **Firestore**
  - Hosting public dir: `public`
  - SPA: No (el sitio tiene múltiples páginas)
  - `.firebaserc` quedará con el project ID

### A.2 — Cloudinary
- [ ] Crear cuenta gratuita en [cloudinary.com](https://cloudinary.com)
  - Free tier: 25 GB almacenamiento, 25 GB bandwidth/mes
- [ ] En Settings > Upload > Upload presets:
  - Crear un preset llamado `wawanakan_cms`
  - Signing mode: **Unsigned** (permite subir desde el navegador sin servidor)
  - Folder: `wawanakan/` (organiza automáticamente las subidas)
- [ ] Anotar:
  - **Cloud name** (ej: `dxxxxxxxx`)
  - **Upload preset name**: `wawanakan_cms`

### A.3 — Variables de configuración
- [ ] Crear archivo `public/admin/config.js` con las credenciales de Firebase y Cloudinary:
  ```javascript
  // Firebase
  const FIREBASE_CONFIG = {
    apiKey: "...",
    authDomain: "wawanakan-cms.firebaseapp.com",
    projectId: "wawanakan-cms",
    appId: "..."
  };
  // Cloudinary
  const CLOUDINARY_CLOUD_NAME = "tu-cloud-name";
  const CLOUDINARY_UPLOAD_PRESET = "wawanakan_cms";
  ```
  > **Nota:** Este archivo contiene la API key pública de Firebase (no es un secreto — las reglas de Firestore controlan el acceso real). No subir contraseñas ni secrets privados aquí.

---

## FASE B — Reglas de Firestore

- [ ] Crear archivo `firestore.rules` en la raíz del proyecto:
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      // Lectura pública para que el sitio pueda cargar contenido
      match /{document=**} {
        allow read: if true;
        // Solo usuarios autenticados pueden escribir
        allow write: if request.auth != null;
      }
    }
  }
  ```
- [ ] Desplegar reglas:
  ```bash
  firebase deploy --only firestore:rules
  ```

---

## FASE C — Estructura de datos en Firestore

> Diseño del esquema completo. Cada sección del sitio tiene su propio documento/colección.

### C.1 — Colección `sitio` (configuración global)

**Documento: `sitio/config`**
- [ ] Crear con los campos:
  ```
  whatsapp: "+59179164334"
  facebook: "https://www.facebook.com/profile.php?id=61590971327508&locale=es_LA"
  tiktok: ""                    ← URL de TikTok si existe
  email: "presidencia.wawanakan@gmail.com"
  direccion: "Av. Panorámica #123, El Alto, La Paz"
  horarioAtencion: "Lunes a Viernes, 8:00 - 17:00"
  mapsLink: "https://maps.google.com/..."
  directionsLink: "https://maps.app.goo.gl/..."
  formVoluntariado: "https://forms.gle/..."
  formPasantia: "https://forms.gle/..."
  ```

**Documento: `sitio/footer`**
- [ ] Crear con los campos:
  ```
  textoIzquierda: "© 2025 Asociación Wawanakan Kusisinapa"
  textoDerecho: "Todos los derechos reservados"
  ```

**Documento: `sitio/misionVision`**
- [ ] Crear con los campos:
  ```
  mision: "Texto completo de la misión..."
  vision: "Texto completo de la visión..."
  imagenesCarruselMision: ["url1", "url2", "url3", "url4"]   ← URLs de Cloudinary
  imagenesCarruselVision: ["url1", "url2", "url3"]           ← URLs de Cloudinary
  ```

### C.2 — Colección `hero`

**Documento: `hero/slides`**
- [ ] Crear con los campos:
  ```
  slides: [
    { url: "cloudinary_url", alt: "Texto alternativo", orden: 0 },
    { url: "cloudinary_url", alt: "Texto alternativo", orden: 1 },
    ...
  ]
  ```

### C.3 — Colección `centros`

- [ ] Crear un documento por centro (12 documentos), ID = slug del nombre (ej: `santa-rosa-de-lima`):
  ```
  nombre: "Santa Rosa de Lima"
  distrito: "Distrito 6"
  subtitulo: "Centro de desarrollo integral con enfoque comunitario"
  direccion: "..."
  mapsLink: "https://maps.google.com/..."
  foto: "cloudinary_url"
  actividades: ["Estimulación temprana", "Nutrición", "Acompañamiento emocional"]
  facebook: ""          ← opcional
  whatsapp: ""          ← opcional
  orden: 1              ← para controlar el orden de listado
  ```

### C.4 — Colección `directorio`

- [ ] Crear un documento por miembro (6 documentos), ID = slug del nombre:
  ```
  nombre: "Lic. Tania Loyola Acarapi Mamani"
  cargo: "Presidencia"
  descripcionCargo: "Lidera y representa institucionalmente a la asociación."
  foto: "cloudinary_url"
  orden: 1
  ```

### C.5 — Documento `sitio/equipo`

- [ ] Crear con los campos:
  ```
  fotoGrupal: "cloudinary_url"      ← Foto colectiva del equipo
  ```

### C.6 — Documento `sitio/voluntariado`

- [ ] Crear con los campos:
  ```
  descripcion: "Texto introductorio del voluntariado..."
  imagenPortada: "cloudinary_url"
  imagenProceso: "cloudinary_url"
  requisitos: ["Ser mayor de 18 años", "Disponibilidad de X horas/semana", ...]
  beneficios: ["Certificado de participación", "Experiencia práctica", ...]
  ```

### C.7 — Documento `sitio/pasantia`

- [ ] Crear con los campos:
  ```
  estado: "vigente"                  ← "vigente" | "cerrada"
  tipo: "Pasantía Universitaria"
  entidad: "Asociación Wawanakan Kusisinapa"
  centro: "Centro Infantil Santa Rosa de Lima"
  area: "Educación Inicial"
  horario: "Lunes a Viernes, 08:00 - 12:00"
  fechaPublicacion: "Enero 2025"
  ubicacion: "El Alto, La Paz"
  facebookLink: "https://..."
  whatsappLink: "https://wa.me/..."
  mapaLink: "https://..."
  formLink: "https://forms.gle/..."
  imagenPortada: "cloudinary_url"
  ```

### C.8 — Colección `valores`

- [ ] Crear un documento por valor, ID = slug (ej: `amor-por-la-infancia`):
  ```
  titulo: "Amor por la infancia"
  descripcion: "Texto del valor..."
  icono: "❤️"              ← emoji o nombre de icono
  orden: 1
  ```

### C.9 — Colección `noticias`

- [ ] Estructura para publicaciones futuras:
  ```
  titulo: "Título de la noticia"
  contenido: "Texto completo..."
  fecha: Timestamp
  imagen: "cloudinary_url"   ← opcional
  activa: true
  ```

---

## FASE D — Panel de administración (front-end)

> El panel vive en `public/admin/`. Esta carpeta no está enlazada desde ninguna página pública. Solo accesible escribiendo `/admin` en la URL.

### D.1 — Estructura de archivos
- [ ] Crear directorio `public/admin/`
- [ ] Crear los siguientes archivos:
  ```
  public/admin/
  ├── index.html          ← punto de entrada (login + dashboard)
  ├── config.js           ← credenciales Firebase + Cloudinary
  ├── auth.js             ← lógica de autenticación
  ├── firestore.js        ← funciones de lectura/escritura a Firestore
  ├── cloudinary.js       ← lógica de upload de imágenes
  ├── sections/
  │   ├── hero.js         ← editor de carrusel hero
  │   ├── mision-vision.js
  │   ├── centros.js
  │   ├── directorio.js
  │   ├── contacto.js
  │   ├── voluntariado.js
  │   ├── pasantia.js
  │   ├── valores.js
  │   ├── noticias.js
  │   └── footer.js
  └── style.css           ← estilos exclusivos del panel
  ```

### D.2 — `public/admin/index.html` — estructura general
- [ ] Pantalla de login (visible si NO hay sesión activa):
  ```html
  <div id="login-screen">
    <img src="../assets/institucional/logotipo.png" alt="Logo">
    <h1>Panel de administración</h1>
    <form id="login-form">
      <input type="email" id="admin-email" placeholder="Correo electrónico" required>
      <input type="password" id="admin-password" placeholder="Contraseña" required>
      <button type="submit">Ingresar</button>
      <p id="login-error" hidden>Credenciales incorrectas.</p>
    </form>
  </div>
  ```
- [ ] Dashboard (visible si HAY sesión activa):
  ```html
  <div id="dashboard" hidden>
    <aside id="sidebar">
      <nav>
        <button data-section="hero">Carrusel principal</button>
        <button data-section="mision-vision">Misión y Visión</button>
        <button data-section="centros">Centros Infantiles</button>
        <button data-section="directorio">Directorio</button>
        <button data-section="contacto">Contacto y Redes</button>
        <button data-section="voluntariado">Voluntariado</button>
        <button data-section="pasantia">Pasantía</button>
        <button data-section="valores">Valores</button>
        <button data-section="noticias">Noticias</button>
        <button data-section="footer">Pie de página</button>
      </nav>
      <button id="logout-btn">Cerrar sesión</button>
    </aside>
    <main id="editor-area">
      <!-- Cada sección renderiza su UI aquí -->
    </main>
  </div>
  ```
- [ ] Indicador de guardado (spinner + mensaje):
  ```html
  <div id="save-indicator" hidden>
    <span class="spinner"></span> Guardando...
  </div>
  ```

### D.3 — `public/admin/auth.js`
- [ ] Importar Firebase Auth (CDN)
- [ ] Función `loginAdmin(email, password)`:
  - Llama a `signInWithEmailAndPassword`
  - En éxito: oculta `#login-screen`, muestra `#dashboard`
  - En error: muestra `#login-error`
- [ ] Función `logoutAdmin()`:
  - Llama a `signOut`
  - Recarga la página (vuelve a login)
- [ ] `onAuthStateChanged` al cargar:
  - Si hay sesión: mostrar dashboard directamente (sin pedir login)
  - Si no hay sesión: mostrar login

### D.4 — `public/admin/firestore.js`
- [ ] Función genérica `getDoc(path)` → retorna el documento de Firestore
- [ ] Función genérica `setDoc(path, data)` → guarda/sobreescribe el documento
- [ ] Función genérica `getDocs(collection)` → retorna todos los docs de una colección
- [ ] Función `addDoc(collection, data)` → crea nuevo documento con ID auto
- [ ] Función `deleteDoc(path)` → elimina un documento

### D.5 — `public/admin/cloudinary.js`
- [ ] Función `openUploadWidget(folder, callback)`:
  - Usa el widget de Cloudinary (`cloudinary.createUploadWidget`)
  - `folder`: subcarpeta en Cloudinary (ej: `wawanakan/hero`)
  - `callback(url)`: recibe la URL pública de la imagen subida
- [ ] El widget muestra: drag & drop, vista previa, botón "Subir"
- [ ] Al subir, retorna la URL de Cloudinary (HTTPS, CDN global)

---

## FASE E — Editores de cada sección

> Cada editor: carga datos de Firestore → muestra formulario prellenado → usuario edita → botón "Guardar" → escribe a Firestore.

### E.1 — Editor: Carrusel Hero
- [ ] Cargar `hero/slides` de Firestore
- [ ] Mostrar lista de slides con miniatura, campo `alt`, botón de orden (↑↓), botón eliminar
- [ ] Botón "Añadir foto": abre Cloudinary widget → añade nueva slide a la lista
- [ ] Botón "Guardar cambios": escribe array actualizado a Firestore
- [ ] Límite sugerido: 7 slides máximo

### E.2 — Editor: Misión y Visión
- [ ] Cargar `sitio/misionVision`
- [ ] Campo `<textarea>` para misión y otro para visión
- [ ] Sección de carrusel de misión (igual que E.1 pero para `imagenesCarruselMision`)
- [ ] Sección de carrusel de visión (igual que E.1 pero para `imagenesCarruselVision`)
- [ ] Botón "Guardar"

### E.3 — Editor: Centros Infantiles
- [ ] Cargar colección `centros` ordenado por campo `orden`
- [ ] Mostrar lista de centros en sidebar secundario
- [ ] Al seleccionar un centro: mostrar formulario con todos sus campos
  - `nombre`, `distrito`, `subtitulo`, `direccion`, `mapsLink`
  - `foto`: imagen + botón "Cambiar foto" (Cloudinary widget)
  - `actividades`: lista editable (añadir/eliminar tags)
  - `facebook`, `whatsapp` (opcionales)
- [ ] Botón "Guardar centro"
- [ ] **No** añadir ni eliminar centros desde el panel (operación de desarrollo)

### E.4 — Editor: Directorio Institucional
- [ ] Cargar colección `directorio` ordenado por `orden`
- [ ] Lista de miembros; al seleccionar uno: formulario
  - `nombre`, `cargo`, `descripcionCargo`
  - `foto`: imagen + botón "Cambiar foto" (Cloudinary widget)
  - `orden`: campo numérico
- [ ] Botón "Guardar miembro"
- [ ] Editor de foto grupal del equipo (`sitio/equipo.fotoGrupal`):
  - Miniatura actual + botón "Cambiar foto"

### E.5 — Editor: Contacto y Redes Sociales
- [ ] Cargar `sitio/config`
- [ ] Campos de texto para:
  - WhatsApp (número con código de país)
  - Facebook (URL completa)
  - TikTok (URL)
  - Email institucional
  - Dirección física
  - Horario de atención
  - Link Google Maps (para el iframe del mapa)
  - Link de Directions (botón "Cómo llegar")
- [ ] Botón "Guardar"

### E.6 — Editor: Voluntariado
- [ ] Cargar `sitio/voluntariado`
- [ ] Campo `<textarea>` para descripción
- [ ] `imagenPortada`: miniatura + botón "Cambiar foto"
- [ ] `imagenProceso`: miniatura + botón "Cambiar foto"
- [ ] `requisitos`: lista editable (texto libre por ítem, añadir/eliminar)
- [ ] `beneficios`: lista editable (texto libre por ítem, añadir/eliminar)
- [ ] Botón "Guardar"

### E.7 — Editor: Pasantía (Convocatoria)
- [ ] Cargar `sitio/pasantia`
- [ ] Toggle **Convocatoria activa / cerrada** (campo `estado`)
- [ ] Campos:
  - `tipo`, `entidad`, `centro`, `area`
  - `horario`, `fechaPublicacion`, `ubicacion`
  - `facebookLink`, `whatsappLink`, `mapaLink`, `formLink`
  - `imagenPortada`: miniatura + botón "Cambiar foto"
- [ ] Botón "Guardar"
- [ ] Nota visual: cuando `estado = "cerrada"`, el sitio público oculta los botones de postulación

### E.8 — Editor: Valores Institucionales
- [ ] Cargar colección `valores` ordenado por `orden`
- [ ] Lista de valores; al seleccionar uno: formulario
  - `titulo`, `descripcion`, `icono` (emoji), `orden`
- [ ] Botón "Guardar valor"

### E.9 — Editor: Noticias / Anuncios
- [ ] Cargar colección `noticias` ordenadas por fecha (más reciente primero)
- [ ] Lista de noticias con título, fecha y toggle activa/inactiva
- [ ] Al seleccionar: formulario completo (`titulo`, `contenido`, `fecha`, `imagen`)
- [ ] Botón "Nueva noticia" → formulario en blanco
- [ ] Botón "Eliminar noticia" (con confirmación modal)
- [ ] Toggle `activa`: controla si aparece en el sitio público

### E.10 — Editor: Pie de Página
- [ ] Cargar `sitio/footer`
- [ ] Campos `textoIzquierda` y `textoDerecho`
- [ ] Botón "Guardar"

---

## FASE F — Modificaciones al sitio público

> El sitio público debe leer de Firestore en lugar de los archivos JSON locales.

### F.1 — Integrar Firebase SDK en el sitio público
- [ ] Añadir los scripts de Firebase a las páginas que lo necesiten (via CDN módular):
  ```html
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-app.js";
    import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-firestore.js";
  </script>
  ```
- [ ] Crear `public/js/firebase-client.js` con la inicialización y las funciones de lectura reutilizables

### F.2 — `public/js/main.js` — reemplazar fetch JSON por Firestore
- [ ] Reemplazar `fetch("data/centers.json")` por `getDocs(collection(db, "centros"))`
- [ ] Reemplazar `fetch("data/config.json")` por `getDoc(doc(db, "sitio", "config"))`
- [ ] Mantener fallback a JSON local si Firestore falla (graceful degradation)
- [ ] Cargar `hero/slides` de Firestore para el carrusel principal

### F.3 — `public/js/components.js` — footer dinámico
- [ ] Leer `sitio/footer` y `sitio/config` de Firestore
- [ ] Renderizar el footer con los datos obtenidos
- [ ] Fallback: si Firestore no responde en 3s, usar valores hardcodeados actuales

### F.4 — Páginas individuales
- [ ] **`index.html`**: carrusel hero y misión/visión desde Firestore
- [ ] **`centros.html`**: lista de centros desde Firestore
- [ ] **`nuestro-equipo.html`**: directorio y foto grupal desde Firestore
- [ ] **`voluntariado.html`**: requisitos, beneficios e imágenes desde Firestore
- [ ] **`pasantia.html`**: convocatoria completa (estado, campos, imagen) desde Firestore
- [ ] **`valores.html`**: lista de valores desde Firestore
- [ ] **`quienes-somos.html`**: misión y visión desde Firestore
- [ ] **`contactos.html`**: info de contacto, dirección, mapa, redes desde Firestore
- [ ] **`nosotros.html`**: revisar si hay contenido editable para migrar

---

## FASE G — Estilos del panel de administración

### G.1 — `public/admin/style.css`
- [ ] Layout: sidebar fijo izquierda (240px) + área de edición principal
- [ ] Pantalla de login: centrada, tarjeta con logo y formulario
- [ ] Inputs de texto: `width: 100%`, `padding: 8px 12px`, borde suave
- [ ] Textareas: `min-height: 120px`, resize vertical
- [ ] Botón guardar: color `--green` (#2d7a2d o similar), ancho completo en mobile
- [ ] Botón cancelar/cerrar sesión: color neutro
- [ ] Miniaturas de imagen: 120×90px con `object-fit: cover`
- [ ] Botón "Cambiar foto": sobre la miniatura en hover
- [ ] Estado de guardado: banner superior animado (verde = éxito, rojo = error)
- [ ] Responsive: en mobile, sidebar colapsa en menú hamburguesa
- [ ] Paleta: consistente con el sitio (usar variables CSS del sitio donde aplique)

---

## FASE H — Despliegue

### H.1 — Preparación
- [ ] Verificar que `.gitignore` incluye `*.env`, `.env.local` y `public/admin/config.js` si tiene secrets
  > Si `config.js` solo contiene la API key pública de Firebase (no secretos), puede subirse al repo
- [ ] Probar el sitio completo localmente con `npx serve public`
- [ ] Probar el panel admin en `http://localhost:5000/admin`

### H.2 — Desplegar a Firebase Hosting
```bash
firebase deploy
```
- [ ] Verificar que el sitio público carga desde Firestore (abrir DevTools > Network > ver requests a firestore.googleapis.com)
- [ ] Verificar que `/admin` funciona: login, edición y guardado en Firestore
- [ ] Verificar que las imágenes subidas a Cloudinary aparecen en el sitio

### H.3 — Configuración post-despliegue
- [ ] Ir a Firebase Console > Authentication > Settings > Authorized domains:
  - Añadir el dominio de Firebase Hosting (`tu-proyecto.web.app`)
  - Añadir el dominio personalizado si existe
- [ ] Verificar que las reglas de Firestore permiten solo al admin escribir:
  ```bash
  firebase firestore:rules:test
  ```

---

## FASE I — Migración de contenido existente

> Una sola vez: pasar los datos actuales del sitio a Firestore.

### I.1 — Script de migración
- [ ] Crear `scripts/migrate-to-firestore.js` (Node.js, ejecutar una sola vez)
- [ ] Migrar datos de `public/data/centers.json` → colección `centros`
- [ ] Migrar datos de `public/data/config.json` → documento `sitio/config`
- [ ] Subir todas las imágenes actuales a Cloudinary:
  - Usar la CLI de Cloudinary o el Upload Widget del panel admin
  - Actualizar las URLs en Firestore una vez subidas
- [ ] Verificar en Firestore Console que todos los documentos tienen los datos correctos
- [ ] Eliminar (o mantener como fallback) los archivos `data/centers.json` y `data/config.json`

---

## FASE J — Pruebas finales

- [ ] Probar login con credenciales correctas → accede al dashboard
- [ ] Probar login con credenciales incorrectas → muestra mensaje de error, no accede
- [ ] Editar el texto de la misión → guardar → verificar en el sitio público
- [ ] Cambiar una foto del carrusel hero → guardar → verificar en el sitio público
- [ ] Cambiar el número de WhatsApp → guardar → verificar en todos los botones del sitio
- [ ] Cambiar la foto de un director → guardar → verificar en `nuestro-equipo.html`
- [ ] Cerrar una convocatoria de pasantía (estado = "cerrada") → verificar que los botones desaparecen en `pasantia.html`
- [ ] Añadir una noticia nueva → verificar que aparece en el sitio (si la sección de noticias está implementada)
- [ ] Probar el panel en móvil (pantalla de 375px)
- [ ] Cerrar sesión → verificar redirección a login

---

## Resumen de archivos a crear

| Archivo | Descripción |
|---------|-------------|
| `public/admin/index.html` | Login + dashboard del CMS |
| `public/admin/config.js` | Credenciales Firebase + Cloudinary |
| `public/admin/auth.js` | Lógica de autenticación |
| `public/admin/firestore.js` | Funciones CRUD de Firestore |
| `public/admin/cloudinary.js` | Upload de imágenes a Cloudinary |
| `public/admin/sections/hero.js` | Editor del carrusel hero |
| `public/admin/sections/mision-vision.js` | Editor de misión, visión y carruseles |
| `public/admin/sections/centros.js` | Editor de los 12 centros |
| `public/admin/sections/directorio.js` | Editor del directorio + foto grupal |
| `public/admin/sections/contacto.js` | Editor de contacto y redes sociales |
| `public/admin/sections/voluntariado.js` | Editor de voluntariado |
| `public/admin/sections/pasantia.js` | Editor de convocatoria de pasantía |
| `public/admin/sections/valores.js` | Editor de valores institucionales |
| `public/admin/sections/noticias.js` | Editor de noticias/anuncios |
| `public/admin/sections/footer.js` | Editor del pie de página |
| `public/admin/style.css` | Estilos del panel admin |
| `public/js/firebase-client.js` | SDK Firebase para el sitio público |
| `scripts/migrate-to-firestore.js` | Script de migración (ejecutar una vez) |
| `firestore.rules` | Reglas de seguridad de Firestore |
| `.firebaserc` | Configuración del proyecto Firebase |
| `firebase.json` | Configuración de Firebase Hosting |

---

## Notas importantes

- **Sin Firebase Storage:** Todas las imágenes van a Cloudinary. Nunca usar `firebase/storage`.
- **Spark plan:** El plan gratuito permite 1 GB de almacenamiento y 50K lecturas/día en Firestore — más que suficiente para este sitio.
- **El panel NO debe aparecer en el sitio:** No añadir ningún link a `/admin` en la navegación pública.
- **Las credenciales de Cloudinary (upload preset unsigned) son seguras de exponer** ya que el preset solo permite subir a la carpeta configurada, no eliminar ni leer imágenes de otras cuentas.
- **La contraseña del admin se gestiona en Firebase Console**, no en el código. Si se necesita cambiar, ir a Authentication > Users.

---

*Última actualización: 2026-06-29 | Responsable: Leonardo Ibarra*
