/**
 * Constructor de formularios dirigido por el esquema (schema.js).
 *
 * Cada campo se construye en un nodo del DOM que expone una función `collect()`
 * para leer su valor actual. Así el guardado solo recorre el árbol y recolecta.
 */
import { pickImage, isCloudinaryConfigured } from "./cloudinary.js";

/* ── Helpers de DOM ──────────────────────────────────────────────────── */

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else if (v !== null && v !== undefined) node.setAttribute(k, v);
  }
  (Array.isArray(children) ? children : [children]).forEach((c) => {
    if (c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return node;
}

/* ── Campos individuales ─────────────────────────────────────────────── */

function buildText(field, value, multiline) {
  const input = multiline
    ? el("textarea", { class: "cms-input", rows: "4" })
    : el("input", { class: "cms-input", type: field.type === "url" ? "url" : "text" });
  input.value = value ?? "";
  const wrap = el("div", { class: "cms-field" }, [
    el("label", { class: "cms-label", text: field.label }),
    input
  ]);
  wrap.__collect = () => input.value.trim();
  return wrap;
}

function buildSelect(field, value) {
  const select = el("select", { class: "cms-input" });
  field.options.forEach((opt) => {
    const o = el("option", { value: opt.value, text: opt.label });
    if (opt.value === value) o.selected = true;
    select.appendChild(o);
  });
  const wrap = el("div", { class: "cms-field" }, [
    el("label", { class: "cms-label", text: field.label }),
    select
  ]);
  wrap.__collect = () => select.value;
  return wrap;
}

function buildImage(field, value) {
  const urlInput = el("input", { class: "cms-input cms-image-url", type: "text", placeholder: "URL de la imagen" });
  urlInput.value = value ?? "";

  const preview = el("img", { class: "cms-image-preview", alt: "Vista previa" });
  const setPreview = () => {
    if (urlInput.value) {
      preview.src = urlInput.value;
      preview.style.display = "block";
    } else {
      preview.removeAttribute("src");
      preview.style.display = "none";
    }
  };
  urlInput.addEventListener("input", setPreview);

  const uploadBtn = el("button", {
    class: "cms-btn cms-btn-soft", type: "button",
    text: "Subir / cambiar imagen",
    onclick: async () => {
      try {
        uploadBtn.disabled = true;
        const url = await pickImage(field.folder || "general");
        if (url) { urlInput.value = url; setPreview(); }
      } catch (err) {
        alert(err.message || "No se pudo subir la imagen.");
      } finally {
        uploadBtn.disabled = false;
      }
    }
  });
  if (!isCloudinaryConfigured()) {
    uploadBtn.title = "Cloudinary no está configurado: puedes pegar una URL manualmente.";
  }

  const wrap = el("div", { class: "cms-field cms-field-image" }, [
    el("label", { class: "cms-label", text: field.label }),
    preview,
    el("div", { class: "cms-image-controls" }, [uploadBtn, urlInput])
  ]);
  setPreview();
  wrap.__collect = () => urlInput.value.trim();
  return wrap;
}

function buildImageList(field, value) {
  const rows = el("div", { class: "cms-list-rows" });
  const initialImages = Array.isArray(value) ? value : (value ? [value] : []);

  const addImage = (imageUrl = "") => {
    const item = buildImage(field, imageUrl);
    rows.appendChild(item);
  };

  initialImages.forEach(addImage);
  if (!initialImages.length) addImage("");

  const addBtn = el("button", {
    class: "cms-btn cms-btn-soft",
    type: "button",
    text: field.addLabel || "+ Agregar otro aliado",
    onclick: () => addImage("")
  });

  const wrap = el("div", { class: "cms-field" }, [
    el("label", { class: "cms-label", text: field.label }),
    rows,
    addBtn
  ]);
  wrap.__collect = () => Array.from(rows.children).map((row) => row.__collect()).filter(Boolean);
  return wrap;
}

function buildList(field, value) {
  const rows = el("div", { class: "cms-list-rows" });

  const addRow = (text = "") => {
    const input = el("input", { class: "cms-input", type: "text", value: text });
    input.value = text;
    const remove = el("button", { class: "cms-icon-btn", type: "button", text: "✕", title: "Eliminar", onclick: () => row.remove() });
    const row = el("div", { class: "cms-list-row" }, [input, remove]);
    row.__value = () => input.value.trim();
    rows.appendChild(row);
  };

  (Array.isArray(value) ? value : []).forEach((v) => addRow(v));

  const addBtn = el("button", { class: "cms-btn cms-btn-soft", type: "button", text: `+ Añadir ${field.itemLabel || "elemento"}`, onclick: () => addRow("") });

  const wrap = el("div", { class: "cms-field" }, [
    el("label", { class: "cms-label", text: field.label }),
    rows,
    addBtn
  ]);
  wrap.__collect = () =>
    Array.from(rows.querySelectorAll(".cms-list-row")).map((r) => r.__value()).filter((s) => s !== "");
  return wrap;
}

function buildGroup(field, value) {
  const inner = buildForm(field.subfields, value || {});
  const wrap = el("div", { class: "cms-field cms-group" }, [
    el("h4", { class: "cms-group-title", text: field.label }),
    inner.node
  ]);
  wrap.__collect = () => inner.collect();
  return wrap;
}

function buildObjectList(field, value) {
  const list = el("div", { class: "cms-objlist" });

  const makeItem = (itemData, index) => {
    const inner = buildForm(field.subfields, itemData || {});
    const header = el("div", { class: "cms-objlist-head" }, [
      el("strong", { text: `${field.itemLabel || "Elemento"} ${index + 1}` }),
      el("div", { class: "cms-objlist-actions" }, [
        el("button", { class: "cms-icon-btn", type: "button", text: "↑", title: "Subir", onclick: () => { const p = item.previousElementSibling; if (p) list.insertBefore(item, p); renumber(); } }),
        el("button", { class: "cms-icon-btn", type: "button", text: "↓", title: "Bajar", onclick: () => { const n = item.nextElementSibling; if (n) list.insertBefore(n, item); renumber(); } }),
        el("button", { class: "cms-icon-btn cms-icon-danger", type: "button", text: "✕", title: "Eliminar", onclick: () => { item.remove(); renumber(); } })
      ])
    ]);
    const item = el("div", { class: "cms-objlist-item" }, [header, inner.node]);
    item.__collect = () => inner.collect();
    return item;
  };

  const renumber = () => {
    Array.from(list.querySelectorAll(".cms-objlist-item")).forEach((it, i) => {
      const label = it.querySelector(".cms-objlist-head strong");
      if (label) label.textContent = `${field.itemLabel || "Elemento"} ${i + 1}`;
    });
  };

  (Array.isArray(value) ? value : []).forEach((v, i) => list.appendChild(makeItem(v, i)));

  const addBtn = el("button", {
    class: "cms-btn cms-btn-soft", type: "button", text: `+ Añadir ${field.itemLabel || "elemento"}`,
    onclick: () => { list.appendChild(makeItem({}, list.children.length)); }
  });

  const wrap = el("div", { class: "cms-field" }, [
    el("label", { class: "cms-label", text: field.label }),
    field.note ? el("p", { class: "cms-hint", text: field.note }) : null,
    list,
    addBtn
  ]);
  wrap.__collect = () => Array.from(list.querySelectorAll(":scope > .cms-objlist-item")).map((it) => it.__collect());
  return wrap;
}

/* ── Constructor principal ───────────────────────────────────────────── */

function buildField(field, value) {
  switch (field.type) {
    case "textarea": return buildText(field, value, true);
    case "select": return buildSelect(field, value);
    case "image": return buildImage(field, value);
    case "imageList": return buildImageList(field, value);
    case "list": return buildList(field, value);
    case "objectList": return buildObjectList(field, value);
    case "group": return buildGroup(field, value);
    default: return buildText(field, value, false);
  }
}

/**
 * Construye un formulario para un conjunto de campos sobre `data`.
 * Devuelve { node, collect } donde collect() retorna un objeto { campo: valor }.
 */
export function buildForm(fields, data = {}) {
  const node = el("div", { class: "cms-form" });
  const controllers = [];
  fields.forEach((field) => {
    const value = data[field.key] ?? (field.fallbackKey ? data[field.fallbackKey] : undefined);
    const f = buildField(field, value);
    node.appendChild(f);
    controllers.push({ key: field.key, collect: f.__collect });
  });
  const collect = () => {
    const out = {};
    controllers.forEach((c) => { out[c.key] = c.collect(); });
    return out;
  };
  return { node, collect };
}
