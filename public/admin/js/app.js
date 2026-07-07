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
console.log("%c[CMS] app.js BUILD-5 cargado | apiKey:", "background:#c8922a;color:#000;padding:2px 6px;border-radius:4px", FIREBASE_CONFIG.apiKey, "| configurado:", isFirebaseConfigured());
document.title = "CMS BUILD-5 | " + document.title;
window.__CMS_BUILD = 5;

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

  // Rellenar subfields ausentes o vacíos en arrays objectList con los defaults del primer ítem.
  // Necesario cuando se añade un campo nuevo al schema después del primer guardado en Firestore.
  const sectionDefaults = DEFAULT_CONTENT[section.key] || {};
  section.fields.forEach((field) => {
    if (field.type !== "objectList" || !Array.isArray(data[field.key])) return;
    const defaultItems = sectionDefaults[field.key];
    if (!Array.isArray(defaultItems) || !defaultItems.length) return;
    const template = defaultItems[0];
    data[field.key] = data[field.key].map((item) => {
      const out = { ...template };
      Object.entries(item).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== "") out[k] = v;
      });
      return out;
    });
  });

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
  } else if (Array.isArray(DEFAULT_CONTENT[section.key])) {
    // Rellenar campos faltantes en items de Firestore con valores de DEFAULT_CONTENT
    const defById = {};
    DEFAULT_CONTENT[section.key].forEach((d) => { if (d.id) defById[d.id] = d; });
    items = items.map((it) => ({ ...(defById[it.id] || {}), ...it }));
  }
  if (section.storage.orderBy) {
    const key = section.storage.orderBy;
    items.sort((a, b) => (a[key] ?? 0) - (b[key] ?? 0));
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
  if (!doc) doc = await fetch("../data/centers.json").then((r) => r.json());

  const details   = doc.centerDetails || {};
  const centersDb = doc.centers       || [];

  // Índice nombre → centro para pre-poblar mapsLink desde coordenadas
  const refByName = {};
  centersDb.forEach((c) => { refByName[c.name] = c; });

  function defaultMapsLink(name, detail) {
    if (detail && detail.mapsLink) return detail.mapsLink;
    const ref = refByName[name] || centersDb.find((c) => c.name === name);
    if (!ref) return "";
    if (ref.mapsLink) return ref.mapsLink;
    if (typeof ref.lat === "number" && typeof ref.lng === "number")
      return `https://www.google.com/maps/dir/?api=1&origin=Current%20Location&destination=${ref.lat},${ref.lng}`;
    if (ref.address)
      return `https://www.google.com/maps/dir/?api=1&origin=Current%20Location&destination=${encodeURIComponent(ref.address)}`;
    return "";
  }

  const officialCenterActivities = [
    { icon: "🌱", label: "Identidad cultural en familia" },
    { icon: "🍲", label: "Salud y nutrición" },
    { icon: "✨", label: "Afectividad y espiritualidad en la familia" },
    { icon: "🧠", label: "Desarrollo psicomotriz y cognitivo" }
  ];

  function prepareCentersForFirestore(data) {
    const sanitizeNestedArrays = (value) => {
      if (Array.isArray(value)) {
        return value.map((item) => {
          if (!Array.isArray(item)) return sanitizeNestedArrays(item);
          return Object.fromEntries(item.map((entry, index) => [`valor${index + 1}`, sanitizeNestedArrays(entry)]));
        });
      }
      if (value && typeof value === "object") {
        return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeNestedArrays(item)]));
      }
      return value;
    };
    const prepared = structuredClone(data);
    prepared.districts = (prepared.districts || []).map((district) => ({
      ...district,
      centers: (district.centers || []).map((center) => (
        Array.isArray(center)
          ? { name: center[0] || "", image: center[1] || "" }
          : { name: center.name || "", image: center.image || "" }
      ))
    }));
    prepared.activities = officialCenterActivities.map(({ icon, label }) => ({ icono: icon, texto: label }));
    prepared.centerDetails = Object.fromEntries(
      Object.entries(prepared.centerDetails || {}).map(([name, detail]) => {
        const centerDetail = detail || {};
        return [
          name,
          {
            ...centerDetail,
            fotos: (centerDetail.fotos || []).map((photo) => Array.isArray(photo) ? (photo[0] || "") : (photo || "")),
            actividades: (centerDetail.actividades || []).map((activity) => (
              Array.isArray(activity)
                ? { icono: activity[0] || "", texto: activity[1] || "" }
                : {
                    icono: activity.icono || activity.icon || "",
                    texto: activity.texto || activity.label || activity.actividad || ""
                  }
            )).filter((activity) => activity.icono || activity.texto)
          }
        ];
      })
    );
    return sanitizeNestedArrays(prepared);
  }

  const centerDetailFields = [
    { key: "subtitulo", label: "Subtítulo", type: "text" },
    { key: "address",   label: "Dirección", type: "text" },
    { key: "mapsLink",  label: "Enlace 'Cómo llegar al centro'", type: "url" },
    { key: "image",     label: "Imagen del centro", type: "image", folder: "centros" },
    { key: "imagenPrincipal", label: "Imagen principal superior del centro", type: "image", folder: "centros" },
    { key: "resenaTitulo", label: "Titulo de la reseña historica", type: "text" },
    { key: "resenaTexto", label: "Texto/descripcion de la reseña historica", type: "textarea" },
    { key: "actividadIcono1", label: "Actividad 1 - Icono", type: "text" },
    { key: "actividadTexto1", label: "Actividad 1 - Texto", type: "text" },
    { key: "actividadIcono2", label: "Actividad 2 - Icono", type: "text" },
    { key: "actividadTexto2", label: "Actividad 2 - Texto", type: "text" },
    { key: "actividadIcono3", label: "Actividad 3 - Icono", type: "text" },
    { key: "actividadTexto3", label: "Actividad 3 - Texto", type: "text" },
    { key: "actividadIcono4", label: "Actividad 4 - Icono", type: "text" },
    { key: "actividadTexto4", label: "Actividad 4 - Texto", type: "text" },
    { key: "directoraNombre", label: "Nombre de la directora", type: "text" },
    { key: "directoraCargo", label: "Cargo de la directora", type: "text" },
    { key: "directoraFoto", label: "Fotografia de la directora", type: "image", folder: "centros" },
    { key: "facebookLink", label: "Link de Facebook del centro", type: "url" },
    { key: "whatsappLink", label: "Link de WhatsApp del centro", type: "url" },
    { key: "fotoAlcance1", label: "Imagen 1 del carrusel / alcance", type: "image", folder: "centros" },
    { key: "fotoAlcance2", label: "Imagen 2 del carrusel / alcance", type: "image", folder: "centros" },
    { key: "fotoAlcance3", label: "Imagen 3 del carrusel / alcance", type: "image", folder: "centros" },
    { key: "fotoAlcance4", label: "Imagen 4 del carrusel / alcance", type: "image", folder: "centros" }
  ];

  editorArea.innerHTML = "";
  editorArea.appendChild(el("p", { class: "cms-hint", text: "Gestiona distritos y centros. Usa ↑↓ para reordenar. 'Reasignar' mueve un centro a otro distrito." }));

  const districtList = el("div", { class: "cms-objlist" });

  // Actualiza los <select> de reasignación con los nombres actuales de distritos
  function refreshReassignSelects() {
    const names = Array.from(districtList.querySelectorAll(":scope > .cms-district-item .cms-district-name-input"))
      .map((i) => i.value.trim()).filter(Boolean);
    districtList.querySelectorAll(".cms-reassign-select").forEach((sel) => {
      const ci = sel.closest(".cms-center-item");
      const di = ci && ci.closest(".cms-district-item");
      const cur = di ? (di.querySelector(".cms-district-name-input")?.value.trim() || "") : "";
      sel.innerHTML = names.map((n) => `<option value="${n}"${n === cur ? " selected" : ""}>${n}</option>`).join("");
    });
  }

  // ── Fábrica de elementos de centro ───────────────────────────────────
  function makeCenterItem(name, image, detail) {
    detail = detail || {};
    const displayName = detail.name || name;
    const ref = refByName[displayName] || refByName[name];
    const normalizeActivity = (activity) => {
      if (Array.isArray(activity)) return { icon: activity[0] || "", label: activity[1] || "" };
      activity = activity || {};
      return {
        icon: activity.icon || activity.icono || "",
        label: activity.label || activity.texto || activity.actividad || ""
      };
    };
    const detailActivities = Array.isArray(detail.actividades) ? detail.actividades.map(normalizeActivity) : [];
    const formActivities = detailActivities.length === officialCenterActivities.length
      ? detailActivities
      : officialCenterActivities;
    const director = detail.directora || {};
    const detailData = {
      subtitulo: detail.subtitulo || "",
      address:   detail.address   || (ref && ref.address) || "",
      mapsLink:  defaultMapsLink(displayName, detail),
      image:     detail.image || image || "",
      imagenPrincipal: detail.imagenPrincipal || detail.heroImage || detail.image || image || "",
      resenaTitulo: detail.resenaTitulo || detail.historiaTitulo || "Reseña histórica",
      resenaTexto: detail.resenaTexto || detail.resena || "",
      directoraNombre: director.nombre || detail.directoraNombre || "Lic. Tania Loyola Acarapi Mamani",
      directoraCargo: director.cargo || detail.directoraCargo || "Directora",
      directoraFoto: director.foto || detail.directoraFoto || "assets/equipo/presidenta1.png",
      facebookLink: detail.facebookLink || "",
      whatsappLink: detail.whatsappLink || "",
      fotoAlcance1: (detail.fotos && detail.fotos[0]) || detail.fotoAlcance1 || "",
      fotoAlcance2: (detail.fotos && detail.fotos[1]) || detail.fotoAlcance2 || "",
      fotoAlcance3: (detail.fotos && detail.fotos[2]) || detail.fotoAlcance3 || "",
      fotoAlcance4: (detail.fotos && detail.fotos[3]) || detail.fotoAlcance4 || ""
    };
    officialCenterActivities.forEach((_, index) => {
      const activity = formActivities[index] || officialCenterActivities[index];
      detailData[`actividadIcono${index + 1}`] = activity.icon || "";
      detailData[`actividadTexto${index + 1}`] = activity.label || "";
    });
    const form = buildForm(centerDetailFields, detailData);

    const nameInput = el("input", {
      type: "text", class: "cms-input", value: displayName,
      placeholder: "Nombre del centro", style: "flex:1;min-width:0"
    });

    // Select + botón de reasignación
    const reassignSel = el("select", { class: "cms-select cms-reassign-select", style: "flex:1" });
    const moveBtn = el("button", {
      class: "cms-btn cms-btn-soft", type: "button", text: "Mover",
      onclick: () => {
        const targetName = reassignSel.value;
        const targetDI = Array.from(districtList.querySelectorAll(":scope > .cms-district-item"))
          .find((d) => d.querySelector(".cms-district-name-input")?.value.trim() === targetName);
        if (!targetDI || targetDI === centerItem.closest(".cms-district-item")) return;
        const tCL  = targetDI.querySelector(".cms-center-list");
        const row  = tCL.querySelector(".cms-add-btn-row");
        row ? tCL.insertBefore(centerItem, row) : tCL.appendChild(centerItem);
        refreshReassignSelects();
      }
    });

    const upBtn  = el("button", { class: "cms-icon-btn", type: "button", text: "↑", title: "Subir",
      onclick: () => { const p = centerItem.previousElementSibling; if (p && p.classList.contains("cms-center-item")) centerItem.parentElement.insertBefore(centerItem, p); }
    });
    const downBtn = el("button", { class: "cms-icon-btn", type: "button", text: "↓", title: "Bajar",
      onclick: () => { const n = centerItem.nextElementSibling; if (n && n.classList.contains("cms-center-item")) centerItem.parentElement.insertBefore(n, centerItem); }
    });
    const delBtn  = el("button", { class: "cms-icon-btn cms-icon-danger", type: "button", text: "✕", title: "Eliminar centro",
      onclick: () => { if (confirm(`¿Eliminar el centro "${nameInput.value}"?`)) centerItem.remove(); }
    });

    const head = el("div", { class: "cms-objlist-head" }, [
      nameInput,
      el("div", { class: "cms-objlist-actions" }, [upBtn, downBtn, delBtn])
    ]);
    const reassignRow = el("div", { style: "display:flex;gap:.5rem;align-items:center;margin-top:.5rem;padding:.5rem;background:rgba(0,0,0,.03);border-radius:6px" }, [
      el("span", { text: "Reasignar a:", style: "white-space:nowrap;font-size:.85rem;color:#666" }),
      reassignSel,
      moveBtn
    ]);

    const centerItem = el("div", { class: "cms-objlist-item cms-center-item" }, [head, form.node, reassignRow]);
    centerItem.__collect = () => ({ name: nameInput.value.trim() || "Centro", ...form.collect() });
    return centerItem;
  }

  // ── Fábrica de elementos de distrito ─────────────────────────────────
  function makeDistrictItem({ name, centers: dc }) {
    const nameInput = el("input", {
      type: "text", class: "cms-input cms-district-name-input", value: name,
      placeholder: "Nombre del distrito", style: "flex:1;min-width:0"
    });
    nameInput.addEventListener("input", refreshReassignSelects);

    const upBtn  = el("button", { class: "cms-icon-btn", type: "button", text: "↑", title: "Subir distrito",
      onclick: () => { const p = districtItem.previousElementSibling; if (p) districtList.insertBefore(districtItem, p); }
    });
    const downBtn = el("button", { class: "cms-icon-btn", type: "button", text: "↓", title: "Bajar distrito",
      onclick: () => { const n = districtItem.nextElementSibling; if (n) districtList.insertBefore(n, districtItem); }
    });
    const delBtn  = el("button", { class: "cms-icon-btn cms-icon-danger", type: "button", text: "✕", title: "Eliminar distrito",
      onclick: () => {
        const count = centerList.querySelectorAll(".cms-center-item").length;
        if (count > 0 && !confirm(`El distrito tiene ${count} centro(s). ¿Eliminarlo junto con sus centros?`)) return;
        districtItem.remove();
      }
    });

    const head = el("div", { class: "cms-objlist-head" }, [
      el("strong", { text: "Distrito: ", style: "white-space:nowrap" }),
      nameInput,
      el("div", { class: "cms-objlist-actions" }, [upBtn, downBtn, delBtn])
    ]);

    const centerList = el("div", { class: "cms-center-list", style: "margin-left:1.25rem;padding-left:1rem;border-left:2px solid rgba(200,146,42,.35)" });

    // Centros existentes del distrito
    (Array.isArray(dc) ? dc : []).forEach(([cName, cImage]) => {
      centerList.appendChild(makeCenterItem(cName, cImage, details[cName] || {}));
    });

    // Botón añadir centro
    const addCenterBtn = el("button", { class: "cms-btn cms-btn-soft", type: "button", text: "+ Añadir centro al distrito",
      onclick: () => {
        const ni = makeCenterItem("Nuevo Centro", "", {});
        const row = centerList.querySelector(".cms-add-btn-row");
        row ? centerList.insertBefore(ni, row) : centerList.appendChild(ni);
        refreshReassignSelects();
      }
    });
    centerList.appendChild(el("div", { class: "cms-add-btn-row", style: "margin-top:.5rem" }, [addCenterBtn]));

    const districtItem = el("div", { class: "cms-objlist-item cms-district-item" }, [head, centerList]);
    return districtItem;
  }

  // ── Renderizar distritos actuales ────────────────────────────────────
  const workingDistricts = (doc.districts || []).map((d) => ({
    name: d.name,
    centers: (d.centers || []).map((c) => Array.isArray(c) ? c : [c.name || "", c.image || ""])
  }));
  workingDistricts.forEach((d) => districtList.appendChild(makeDistrictItem(d)));

  const addDistrictBtn = el("button", { class: "cms-btn cms-btn-soft", type: "button", text: "+ Añadir distrito",
    onclick: () => {
      districtList.appendChild(makeDistrictItem({ name: "Nuevo Distrito", centers: [] }));
      refreshReassignSelects();
    }
  });

  editorArea.appendChild(addDistrictBtn);
  editorArea.appendChild(districtList);
  setTimeout(refreshReassignSelects, 0);

  // ── Guardar ──────────────────────────────────────────────────────────
  const saveBtn = el("button", {
    class: "cms-btn cms-btn-primary", type: "button", text: "Guardar cambios",
    onclick: async () => {
      saveBtn.disabled = true;
      try {
        const updated      = structuredClone(doc);
        const newDistricts = [];
        const newDetails   = {};

        Array.from(districtList.querySelectorAll(":scope > .cms-district-item")).forEach((di) => {
          const dName = di.querySelector(".cms-district-name-input")?.value.trim() || "Distrito";
          const distCenters = [];

          Array.from(di.querySelectorAll(".cms-center-list > .cms-center-item")).forEach((ci) => {
            const d = ci.__collect();
            const cName = d.name;
            const actividades = officialCenterActivities
              .map((_, index) => ({
                icono: d[`actividadIcono${index + 1}`] || "",
                texto: d[`actividadTexto${index + 1}`] || ""
              }))
              .filter((activity) => activity.icono || activity.texto);
            newDetails[cName] = {
              subtitulo: d.subtitulo,
              address:   d.address,
              mapsLink:  d.mapsLink,
              image:     d.image,
              imagenPrincipal: d.imagenPrincipal || d.image || "",
              resenaTitulo: d.resenaTitulo,
              resenaTexto: d.resenaTexto,
              actividades,
              directora: {
                nombre: d.directoraNombre,
                cargo: d.directoraCargo,
                foto: d.directoraFoto
              },
              facebookLink: d.facebookLink,
              whatsappLink: d.whatsappLink,
              fotos: [
                d.fotoAlcance1 || "",
                d.fotoAlcance2 || "",
                d.fotoAlcance3 || "",
                d.fotoAlcance4 || ""
              ]
            };
            // Actualizar campo district en el array centers (para main.js y la sección del mapa)
            const dbEntry = (updated.centers || []).find((c) => c.name === cName);
            if (dbEntry) dbEntry.district = dName;
            distCenters.push({ name: cName, image: d.image || "" });
          });

          newDistricts.push({ name: dName, centers: distCenters });
        });

        updated.districts    = newDistricts;
        updated.centerDetails = newDetails;
        updated.activities = officialCenterActivities.map(({ icon, label }) => ({ icono: icon, texto: label }));

        await replaceDocData(section.storage.path, prepareCentersForFirestore(updated));
        showToast("Centros guardados correctamente.");
        await renderCentros(section);
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
        activities: centersJson.activities.map(([icon, label]) => ({ icono: icon, texto: label })),
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
