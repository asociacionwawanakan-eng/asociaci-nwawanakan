/**
 * Orquestador del panel /admin.
 * - Verifica que el CMS esté configurado.
 * - Controla el inicio/cierre de sesión (Firebase Auth).
 * - Renderiza el editor de cada sección a partir del esquema (schema.js).
 * - Incluye un editor dedicado para los centros y una utilidad para sembrar
 *   el contenido por defecto en Firestore (Fase I del plan).
 */
import { isFirebaseConfigured, FIREBASE_CONFIG, CLOUDINARY } from "../../js/firebase-config.js";
import { DEFAULT_CONTENT } from "../../js/content-defaults.js";
import { login, logout, onAuthChanged, authErrorMessage } from "./auth.js";
import {
  getDocData, setDocData, replaceDocData,
  getCollectionData, setCollectionDoc, deleteCollectionDoc
} from "./store.js";
import { SECTIONS, CENTROS_SECTION } from "./schema.js";
import { buildForm } from "./form-builder.js";

/* ── MARCADOR DE DIAGNÓSTICO (temporal) ──────────────────────────────── */
console.log("%c[CMS] app.js BUILD-4 cargado | apiKey:", "background:#c8922a;color:#000;padding:2px 6px;border-radius:4px", FIREBASE_CONFIG.apiKey, "| configurado:", isFirebaseConfigured());
document.title = "CMS BUILD-4 | " + document.title;
window.__CMS_BUILD = 4;

/* ── Referencias del DOM ─────────────────────────────────────────────── */
const $ = (id) => document.getElementById(id);
const loginScreen = $("login-screen");
const dashboard = $("dashboard");
const notConfigured = $("not-configured");
const loginForm = $("login-form");
const loginError = $("login-error");
const navList = $("nav-list");
const editorArea = $("editor-area");
const editorTitle = $("editor-title");
const toast = $("toast");

let currentKey = null;

/* ── Utilidades ──────────────────────────────────────────────────────── */
function slugify(text) {
  const s = (text || "")
    .toString().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return s || `item-${Date.now()}`;
}

function showToast(message, type = "ok") {
  toast.textContent = message;
  toast.className = `cms-toast cms-toast-${type} is-visible`;
  setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  (Array.isArray(children) ? children : [children]).forEach((c) => c && node.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
  return node;
}

/* ── Navegación ──────────────────────────────────────────────────────── */
function buildNav() {
  navList.innerHTML = "";
  const allSections = [...SECTIONS, CENTROS_SECTION];
  allSections.forEach((section) => {
    const btn = el("button", {
      class: "cms-nav-btn", type: "button", "data-key": section.key, text: section.label,
      onclick: () => selectSection(section)
    });
    navList.appendChild(btn);
  });
}

function setActiveNav(key) {
  navList.querySelectorAll(".cms-nav-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.key === key);
  });
}

async function selectSection(section) {
  currentKey = section.key;
  setActiveNav(section.key);
  editorTitle.textContent = section.label;
  editorArea.innerHTML = "";
  editorArea.appendChild(el("p", { class: "cms-loading", text: "Cargando…" }));

  try {
    if (section.key === "centros") await renderCentros(section);
    else if (section.storage.type === "collection") await renderCollection(section);
    else await renderDoc(section);
  } catch (err) {
    editorArea.innerHTML = "";
    editorArea.appendChild(el("p", { class: "cms-error-msg", text: `Error: ${err.message}` }));
  }
}

/* ── Editor de documento único ───────────────────────────────────────── */
async function renderDoc(section) {
  const stored = await getDocData(section.storage.path);
  const data = { ...(DEFAULT_CONTENT[section.key] || {}), ...(stored || {}) };

  const form = buildForm(section.fields, data);
  editorArea.innerHTML = "";
  if (section.note) editorArea.appendChild(el("p", { class: "cms-hint", text: section.note }));
  editorArea.appendChild(form.node);

  const saveBtn = el("button", {
    class: "cms-btn cms-btn-primary", type: "button", text: "Guardar cambios",
    onclick: async () => {
      saveBtn.disabled = true;
      try {
        await setDocData(section.storage.path, form.collect());
        showToast("Cambios guardados correctamente.");
      } catch (err) {
        showToast(`No se pudo guardar: ${err.message}`, "error");
      } finally {
        saveBtn.disabled = false;
      }
    }
  });
  editorArea.appendChild(el("div", { class: "cms-actions" }, [saveBtn]));
}

/* ── Editor de colección ─────────────────────────────────────────────── */
async function renderCollection(section) {
  let items = await getCollectionData(section.storage.name);
  if (!items.length && Array.isArray(DEFAULT_CONTENT[section.key])) {
    items = structuredClone(DEFAULT_CONTENT[section.key]);
  }
  const originalIds = items.map((it) => it.id).filter(Boolean);

  editorArea.innerHTML = "";
  const list = el("div", { class: "cms-objlist" });

  const renumber = () => {
    Array.from(list.querySelectorAll(":scope > .cms-objlist-item")).forEach((it, i) => {
      const label = it.querySelector(".cms-objlist-head strong");
      if (label) label.textContent = `${section.itemLabel || "Elemento"} ${i + 1}`;
    });
  };

  const makeItem = (itemData) => {
    const form = buildForm(section.fields, itemData || {});
    const head = el("div", { class: "cms-objlist-head" }, [
      el("strong", { text: section.itemLabel || "Elemento" }),
      el("div", { class: "cms-objlist-actions" }, [
        el("button", { class: "cms-icon-btn", type: "button", text: "↑", title: "Subir",
          onclick: () => { const p = item.previousElementSibling; if (p) list.insertBefore(item, p); renumber(); }
        }),
        el("button", { class: "cms-icon-btn", type: "button", text: "↓", title: "Bajar",
          onclick: () => { const n = item.nextElementSibling; if (n) list.insertBefore(n, item); renumber(); }
        }),
        el("button", { class: "cms-icon-btn cms-icon-danger", type: "button", text: "✕", title: "Eliminar",
          onclick: () => { item.remove(); renumber(); }
        })
      ])
    ]);
    const item = el("div", { class: "cms-objlist-item" }, [head, form.node]);
    item.__id = itemData && itemData.id ? itemData.id : null;
    item.__collect = () => form.collect();
    return item;
  };

  items.forEach((it) => list.appendChild(makeItem(it)));
  renumber();
  editorArea.appendChild(list);

  const addBtn = el("button", {
    class: "cms-btn cms-btn-soft", type: "button", text: `+ Añadir ${section.itemLabel || "elemento"}`,
    onclick: () => { list.appendChild(makeItem({})); renumber(); }
  });

  const saveBtn = el("button", {
    class: "cms-btn cms-btn-primary", type: "button", text: "Guardar cambios",
    onclick: async () => {
      saveBtn.disabled = true;
      try {
        const used = new Set();
        const nodes = Array.from(list.querySelectorAll(":scope > .cms-objlist-item"));
        for (let i = 0; i < nodes.length; i++) {
          const values = nodes[i].__collect();
          let id = nodes[i].__id || slugify(values[section.storage.idFrom]);
          while (used.has(id)) id += "-2";
          used.add(id);
          await setCollectionDoc(section.storage.name, id, { ...values, orden: i });
        }
        for (const oid of originalIds) {
          if (!used.has(oid)) await deleteCollectionDoc(section.storage.name, oid);
        }
        showToast("Cambios guardados correctamente.");
        selectSection(section);
      } catch (err) {
        showToast(`No se pudo guardar: ${err.message}`, "error");
      } finally {
        saveBtn.disabled = false;
      }
    }
  });

  editorArea.appendChild(el("div", { class: "cms-actions" }, [addBtn, saveBtn]));
}

/* ── Editor dedicado de centros ──────────────────────────────────────── */
async function renderCentros(section) {
  let doc = await getDocData(section.storage.path);
  if (!doc) {
    doc = await fetch("../data/centers.json").then((r) => r.json());
  }
  const details = doc.centerDetails || {};
  const keys = Object.keys(details);

  const centerFields = [
    { key: "name", label: "Nombre mostrado", type: "text" },
    { key: "subtitulo", label: "Subtítulo", type: "text" },
    { key: "address", label: "Dirección", type: "text" },
    { key: "image", label: "Imagen del centro", type: "image", folder: "centros" }
  ];

  editorArea.innerHTML = "";
  editorArea.appendChild(el("p", { class: "cms-hint", text: "Edita el nombre, subtítulo, dirección e imagen de cada centro infantil. La imagen puede ser un archivo subido a Cloudinary o el nombre del archivo en assets/centros/." }));

  const list = el("div", { class: "cms-objlist" });
  const controllers = [];

  keys.forEach((key) => {
    const data = { name: details[key].name || key, ...details[key] };
    const form = buildForm(centerFields, data);
    const item = el("div", { class: "cms-objlist-item" }, [
      el("div", { class: "cms-objlist-head" }, [el("strong", { text: key })]),
      form.node
    ]);
    list.appendChild(item);
    controllers.push({ key, collect: form.collect });
  });
  editorArea.appendChild(list);

  const saveBtn = el("button", {
    class: "cms-btn cms-btn-primary", type: "button", text: "Guardar cambios",
    onclick: async () => {
      saveBtn.disabled = true;
      try {
        const updated = structuredClone(doc);
        updated.centerDetails = updated.centerDetails || {};
        controllers.forEach(({ key, collect }) => {
          updated.centerDetails[key] = { ...updated.centerDetails[key], ...collect() };
        });
        await replaceDocData(section.storage.path, updated);
        showToast("Centros guardados correctamente.");
      } catch (err) {
        showToast(`No se pudo guardar: ${err.message}`, "error");
      } finally {
        saveBtn.disabled = false;
      }
    }
  });
  editorArea.appendChild(el("div", { class: "cms-actions" }, [saveBtn]));
}

/* ── Subida de imagen local a Cloudinary ─────────────────────────────── */
async function uploadLocalImage(relPath, folder) {
  const resp = await fetch(`../${relPath}`);
  if (!resp.ok) throw new Error(`No encontrada: ${relPath}`);
  const blob = await resp.blob();
  const form = new FormData();
  form.append("file", blob, relPath.split("/").pop());
  form.append("upload_preset", CLOUDINARY.uploadPreset);
  form.append("folder", `${CLOUDINARY.folder}/${folder}`);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/image/upload`,
    { method: "POST", body: form }
  );
  const json = await res.json();
  if (!res.ok) {
    const msg = json.error?.message || `HTTP ${res.status}`;
    throw new Error(`Cloudinary rechazó ${relPath}: ${msg}`);
  }
  return json.secure_url;
}

/* ── Sembrado inicial de contenido (Fase I) ──────────────────────────── */
async function seedContent() {
  if (!confirm("Esto subirá las imágenes del sitio a Cloudinary y sembrará Firestore con el contenido actual. La operación tarda ~1-2 min. ¿Continuar?")) return;
  const btn = $("seed-btn");
  btn.disabled = true;
  btn.textContent = "Iniciando…";
  try {
    // ── 1. Subir imágenes del sitio a Cloudinary ─────────────────────
    btn.textContent = "Subiendo imágenes del sitio…";
    const [
      urlHeroAbout, urlObjetivo, urlAllies,
      urlHero1, urlHero2, urlHero3, urlHero4, urlHero5,
      urlMision1, urlMision2, urlMision3, urlMision4,
      urlVision1, urlVision2, urlVision3,
      urlFotoGrupal,
      urlPresidenta, urlVicepresidenta, urlActas, urlNacional, urlHacienda, urlInternacional,
      urlVoluntHero, urlVoluntProcess,
      urlPasantiaProcess,
      urlQuienes
    ] = await Promise.all([
      uploadLocalImage("assets/hero/hero7.jpg", "home"),
      uploadLocalImage("assets/contenido/objetivo.jpg", "home"),
      uploadLocalImage("assets/institucional/aliado1.png", "home"),
      uploadLocalImage("assets/hero/hero1.jpg", "hero"),
      uploadLocalImage("assets/hero/hero2.jpg", "hero"),
      uploadLocalImage("assets/hero/hero3.jpg", "hero"),
      uploadLocalImage("assets/hero/hero4.jpg", "hero"),
      uploadLocalImage("assets/hero/hero5.jpg", "hero"),
      uploadLocalImage("assets/mision/mision1.jpg", "mision"),
      uploadLocalImage("assets/mision/mision2.jpg", "mision"),
      uploadLocalImage("assets/mision/mision3.jpg", "mision"),
      uploadLocalImage("assets/mision/mision4.jpg", "mision"),
      uploadLocalImage("assets/vision/vision1.jpg", "vision"),
      uploadLocalImage("assets/vision/vision2.jpg", "vision"),
      uploadLocalImage("assets/vision/vision3.jpg", "vision"),
      uploadLocalImage("assets/equipo/equipo.png", "equipo"),
      uploadLocalImage("assets/equipo/presidenta1.png", "equipo"),
      uploadLocalImage("assets/equipo/vicepresidenta.png", "equipo"),
      uploadLocalImage("assets/equipo/actas1.png", "equipo"),
      uploadLocalImage("assets/equipo/nacional.png", "equipo"),
      uploadLocalImage("assets/equipo/tesoreria.png", "equipo"),
      uploadLocalImage("assets/equipo/internacional.png", "equipo"),
      uploadLocalImage("assets/contenido/voluntariado.png", "voluntariado"),
      uploadLocalImage("assets/contenido/voluntariado2.jpg", "voluntariado"),
      uploadLocalImage("assets/contenido/fondo-pasantia-proceso.jpg", "pasantia"),
      uploadLocalImage("assets/contenido/quienes-somos.jpg", "contenido"),
    ]);

    // ── 2. Subir imágenes de centros ──────────────────────────────────
    btn.textContent = "Subiendo imágenes de centros…";
    const centersJson = await fetch("../data/centers.json").then((r) => r.json());
    const centerEntries = Object.entries(centersJson.centerDetails);
    const centerImageUrls = await Promise.all(
      centerEntries.map(([, d]) => uploadLocalImage(`assets/centros/${d.image}`, "centros"))
    );
    const updatedDetails = Object.fromEntries(
      centerEntries.map(([name, d], i) => [name, { ...d, image: centerImageUrls[i] }])
    );

    // ── 3. Guardar documentos en Firestore ────────────────────────────
    btn.textContent = "Guardando en Firestore…";
    await Promise.all([
      setDocData(["sitio", "config"], DEFAULT_CONTENT.config),
      setDocData(["sitio", "footer"], DEFAULT_CONTENT.footer),
      setDocData(["sitio", "home"], {
        ...DEFAULT_CONTENT.home,
        aboutImage: urlHeroAbout,
        objetivoImage: urlObjetivo,
        alliesImage: urlAllies,
      }),
      setDocData(["sitio", "heroSlides"], {
        slides: DEFAULT_CONTENT.heroSlides.slides.map((s, i) => ({
          ...s, src: [urlHero1, urlHero2, urlHero3, urlHero4, urlHero5][i]
        }))
      }),
      setDocData(["sitio", "misionSlides"], {
        slides: DEFAULT_CONTENT.misionSlides.slides.map((s, i) => ({
          ...s, src: [urlMision1, urlMision2, urlMision3, urlMision4][i]
        }))
      }),
      setDocData(["sitio", "visionSlides"], {
        slides: DEFAULT_CONTENT.visionSlides.slides.map((s, i) => ({
          ...s, src: [urlVision1, urlVision2, urlVision3][i]
        }))
      }),
      setDocData(["sitio", "equipo"], { ...DEFAULT_CONTENT.equipo, fotoGrupal: urlFotoGrupal }),
      setDocData(["sitio", "voluntariado"], {
        ...DEFAULT_CONTENT.voluntariado,
        heroImage: urlVoluntHero,
        processImage: urlVoluntProcess,
      }),
      setDocData(["sitio", "pasantia"], { ...DEFAULT_CONTENT.pasantia, processImage: urlPasantiaProcess }),
      setDocData(["sitio", "quienesSomos"], { ...DEFAULT_CONTENT.quienesSomos, imagen: urlQuienes }),
      // Firestore no permite arrays anidados → districts.centers y activities
      // se convierten a objetos; loadCenters() los normaliza de vuelta al frontend.
      replaceDocData(["sitio", "centros"], {
        ...centersJson,
        districts: centersJson.districts.map((d) => ({
          name: d.name,
          centers: d.centers.map(([name, image]) => ({ name, image }))
        })),
        activities: centersJson.activities.map(([icon, label]) => ({ icon, label })),
        centerDetails: updatedDetails,
      }),
    ]);

    // Colecciones (escritura secuencial para evitar throttling)
    for (const v of DEFAULT_CONTENT.valores) {
      await setCollectionDoc("valores", v.id, { titulo: v.titulo, descripcion: v.descripcion, orden: v.orden });
    }
    const dirUrls = [
      urlPresidenta, urlVicepresidenta, urlActas,
      urlNacional, urlHacienda, urlInternacional
    ];
    for (let i = 0; i < DEFAULT_CONTENT.directorio.length; i++) {
      const d = DEFAULT_CONTENT.directorio[i];
      await setCollectionDoc("directorio", d.id, {
        nombre: d.nombre, cargo: d.cargo,
        descripcionCargo: d.descripcionCargo, foto: dirUrls[i], orden: d.orden
      });
    }

    showToast("¡Contenido e imágenes inicializados correctamente en Firestore!");
  } catch (err) {
    showToast(`No se pudo inicializar: ${err.message}`, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Inicializar contenido";
  }
}

/* ── Sesión ──────────────────────────────────────────────────────────── */
function showLogin() {
  loginScreen.hidden = false;
  dashboard.hidden = true;
  notConfigured.hidden = true;
}

function showDashboard() {
  loginScreen.hidden = true;
  dashboard.hidden = false;
  notConfigured.hidden = true;
  buildNav();
  if (SECTIONS.length) selectSection(SECTIONS[0]);
}

function showNotConfigured() {
  loginScreen.hidden = true;
  dashboard.hidden = true;
  notConfigured.hidden = false;
  // Diagnóstico: muestra qué apiKey está leyendo realmente el navegador.
  const seen = (FIREBASE_CONFIG && FIREBASE_CONFIG.apiKey) ? FIREBASE_CONFIG.apiKey : "(vacío)";
  console.log("[CMS] apiKey detectada por el navegador:", seen, "| configurado:", isFirebaseConfigured());
  const diag = document.createElement("p");
  diag.className = "cms-hint";
  diag.style.marginTop = "12px";
  diag.textContent = `Diagnóstico — apiKey leída: ${seen.slice(0, 10)}…`;
  notConfigured.querySelector(".cms-message-card")?.appendChild(diag);
}

/* ── Arranque ────────────────────────────────────────────────────────── */
function init() {
  if (!isFirebaseConfigured()) {
    showNotConfigured();
    return;
  }

  // Mostrar login inmediatamente; onAuthChanged actualiza cuando Firebase responde.
  showLogin();

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.hidden = true;
    const btn = loginForm.querySelector("button[type=submit]");
    btn.disabled = true;
    try {
      await login($("admin-email").value, $("admin-password").value);
    } catch (err) {
      loginError.textContent = authErrorMessage(err);
      loginError.hidden = false;
    } finally {
      btn.disabled = false;
    }
  });

  $("logout-btn").addEventListener("click", () => logout());
  $("seed-btn").addEventListener("click", seedContent);

  onAuthChanged((user) => {
    if (user) showDashboard();
    else showLogin();
  }).catch((err) => {
    console.error("[CMS] Error al inicializar autenticación:", err);
    showLogin(); // fallback: al menos muestra el formulario
  });
}

init();
