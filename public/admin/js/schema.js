/**
 * Esquema declarativo del CMS.
 *
 * Cada sección define dónde se guarda (doc único o colección) y qué campos
 * tiene. El form-builder genera la interfaz automáticamente a partir de esto,
 * de modo que añadir un campo nuevo es solo agregar una entrada aquí.
 *
 * Tipos de campo:
 *   text | textarea | url | image | select | list | objectList | group
 */

const tipoEstado = {
  type: "select",
  options: [
    { value: "vigente", label: "Vigente (muestra los botones de postulación)" },
    { value: "cerrada", label: "Cerrada (oculta los botones de postulación)" }
  ]
};

export const SECTIONS = [
  {
    key: "home",
    label: "Inicio",
    storage: { type: "doc", path: ["sitio", "home"] },
    fields: [
      { key: "heroSubtitle", label: "Subtítulo de portada", type: "text" },
      { key: "aboutTitle", label: "¿Quiénes somos? — Título", type: "text" },
      { key: "aboutSubtitle", label: "¿Quiénes somos? — Subtítulo", type: "text" },
      { key: "aboutText", label: "¿Quiénes somos? — Texto", type: "textarea" },
      { key: "aboutImage", label: "¿Quiénes somos? — Imagen", type: "image", folder: "home" },
      { key: "alcancesBeneficiarios", label: "Alcances — Beneficiarios", type: "text" },
      { key: "alcancesCentros", label: "Alcances — Centros infantiles", type: "text" },
      { key: "alcancesDistritos", label: "Alcances — Distritos", type: "text" },
      { key: "objetivoText", label: "Nuestro objetivo — Texto", type: "textarea" },
      { key: "objetivoImage", label: "Nuestro objetivo — Imagen", type: "image", folder: "home" },
      { key: "mision", label: "Misión", type: "textarea" },
      { key: "vision", label: "Visión", type: "textarea" },
      { key: "alliesText", label: "Nuestros aliados — Texto", type: "textarea" },
      { key: "alliesImage", label: "Nuestros aliados — Imagen", type: "image", folder: "home" }
    ]
  },

  {
    key: "heroSlides",
    label: "Carrusel principal",
    storage: { type: "doc", path: ["sitio", "heroSlides"] },
    note: "Edita las imágenes del carrusel de portada. Para cambiar el número de imágenes se requiere un ajuste de código (la animación está ligada a la cantidad).",
    fields: [
      {
        key: "slides", label: "Imágenes", type: "objectList", itemLabel: "Imagen",
        subfields: [
          { key: "src", label: "Imagen", type: "image", folder: "hero" },
          { key: "alt", label: "Texto alternativo (accesibilidad)", type: "text" }
        ]
      }
    ]
  },

  {
    key: "misionSlides",
    label: "Carrusel de Misión",
    storage: { type: "doc", path: ["sitio", "misionSlides"] },
    fields: [
      {
        key: "slides", label: "Imágenes", type: "objectList", itemLabel: "Imagen",
        subfields: [
          { key: "src", label: "Imagen", type: "image", folder: "mision" },
          { key: "alt", label: "Texto alternativo", type: "text" }
        ]
      }
    ]
  },

  {
    key: "visionSlides",
    label: "Carrusel de Visión",
    storage: { type: "doc", path: ["sitio", "visionSlides"] },
    fields: [
      {
        key: "slides", label: "Imágenes", type: "objectList", itemLabel: "Imagen",
        subfields: [
          { key: "src", label: "Imagen", type: "image", folder: "vision" },
          { key: "alt", label: "Texto alternativo", type: "text" }
        ]
      }
    ]
  },

  {
    key: "valores",
    label: "Valores",
    storage: { type: "collection", name: "valores", orderBy: "orden", idFrom: "titulo" },
    itemLabel: "Valor",
    fields: [
      { key: "titulo", label: "Título", type: "text" },
      { key: "descripcion", label: "Descripción", type: "textarea" },
      { key: "orden", label: "Orden", type: "text" }
    ]
  },

  {
    key: "equipo",
    label: "Equipo (cabecera)",
    storage: { type: "doc", path: ["sitio", "equipo"] },
    fields: [
      { key: "fotoGrupal", label: "Foto grupal del equipo", type: "image", folder: "equipo" },
      { key: "brandTagline", label: "Lema de marca", type: "text" },
      { key: "subtitulo", label: "Subtítulo", type: "text" },
      { key: "cierre", label: "Frase de cierre", type: "text" }
    ]
  },

  {
    key: "directorio",
    label: "Directorio",
    storage: { type: "collection", name: "directorio", orderBy: "orden", idFrom: "cargo" },
    itemLabel: "Integrante",
    fields: [
      { key: "nombre", label: "Nombre completo", type: "text" },
      { key: "cargo", label: "Cargo", type: "text" },
      { key: "descripcionCargo", label: "Descripción del cargo", type: "textarea" },
      { key: "foto", label: "Fotografía", type: "image", folder: "equipo" }
    ]
  },

  {
    key: "voluntariado",
    label: "Voluntariado",
    storage: { type: "doc", path: ["sitio", "voluntariado"] },
    fields: [
      { key: "heroTitle", label: "Título principal", type: "text" },
      { key: "lead", label: "Bajada / lema", type: "text" },
      { key: "heroImage", label: "Imagen de portada", type: "image", folder: "voluntariado" },
      { key: "processImage", label: "Imagen del proceso", type: "image", folder: "voluntariado" },
      { key: "ctaTitle", label: "Frase del llamado final", type: "text" },
      {
        key: "beneficios", label: "¿Por qué ser voluntario/a?", type: "objectList", itemLabel: "Beneficio",
        subfields: [
          { key: "icon", label: "Ícono (símbolo)", type: "text" },
          { key: "titulo", label: "Título", type: "text" },
          { key: "texto", label: "Texto", type: "textarea" }
        ]
      },
      {
        key: "formasAyuda", label: "¿Cómo puedes ayudar?", type: "objectList", itemLabel: "Forma de ayudar",
        subfields: [
          { key: "titulo", label: "Título", type: "text" },
          { key: "texto", label: "Texto", type: "textarea" }
        ]
      },
      {
        key: "pasos", label: "¿Cómo postular? (pasos)", type: "objectList", itemLabel: "Paso",
        subfields: [
          { key: "titulo", label: "Título", type: "text" },
          { key: "texto", label: "Texto", type: "textarea" }
        ]
      }
    ]
  },

  {
    key: "pasantia",
    label: "Pasantía",
    storage: { type: "doc", path: ["sitio", "pasantia"] },
    fields: [
      { key: "titulo", label: "Título", type: "text" },
      { key: "subtitulo", label: "Subtítulo", type: "text" },
      { key: "intro", label: "Introducción", type: "textarea" },
      { key: "processImage", label: "Imagen del proceso", type: "image", folder: "pasantia" },
      { key: "formLink", label: "Enlace del formulario (Postular ahora)", type: "url" },
      { key: "requisitos", label: "Requisitos principales", type: "list", itemLabel: "Requisito" },
      {
        key: "beneficios", label: "Beneficios", type: "objectList", itemLabel: "Beneficio",
        subfields: [{ key: "titulo", label: "Título", type: "text" }]
      },
      {
        key: "proceso", label: "Proceso de selección", type: "objectList", itemLabel: "Etapa",
        subfields: [
          { key: "titulo", label: "Título", type: "text" },
          { key: "texto", label: "Texto", type: "textarea" }
        ]
      },
      {
        key: "callout", label: "Convocatoria vigente", type: "group",
        subfields: [
          { key: "estado", label: "Estado de la convocatoria", ...tipoEstado },
          { key: "badge", label: "Etiqueta del estado", type: "text" },
          { key: "label", label: "Texto superior", type: "text" },
          { key: "titulo", label: "Título de la convocatoria", type: "text" },
          { key: "entidad", label: "Entidad", type: "text" },
          { key: "centro", label: "Centro", type: "text" },
          { key: "ubicacion", label: "Ubicación", type: "text" },
          { key: "horario", label: "Horario", type: "text" },
          { key: "area", label: "Área", type: "text" },
          { key: "fecha", label: "Fecha de publicación", type: "text" },
          { key: "mapLink", label: "Enlace 'Cómo llegar'", type: "url" },
          { key: "facebookLink", label: "Enlace de Facebook", type: "url" },
          { key: "whatsappLink", label: "Enlace de WhatsApp", type: "url" }
        ]
      }
    ]
  },

  {
    key: "quienesSomos",
    label: "Quiénes somos (página)",
    storage: { type: "doc", path: ["sitio", "quienesSomos"] },
    fields: [
      { key: "titulo", label: "Título", type: "text" },
      { key: "texto", label: "Texto", type: "textarea" },
      { key: "imagen", label: "Imagen", type: "image", folder: "contenido" }
    ]
  },

  {
    key: "contacto",
    label: "Contacto y redes",
    storage: { type: "doc", path: ["sitio", "config"] },
    fields: [
      { key: "whatsappLink", label: "Enlace de WhatsApp", type: "url" },
      { key: "whatsappTexto", label: "Teléfono / WhatsApp (texto)", type: "text" },
      { key: "facebookLink", label: "Enlace de Facebook", type: "url" },
      { key: "tiktokLink", label: "Enlace de TikTok", type: "url" },
      { key: "websiteLink", label: "Enlace del sitio web", type: "url" },
      { key: "email", label: "Correo electrónico", type: "text" },
      { key: "direccionLinea1", label: "Dirección — Línea 1", type: "text" },
      { key: "direccionLinea2", label: "Dirección — Línea 2", type: "text" },
      { key: "horarioDias", label: "Horario — Días", type: "text" },
      { key: "horarioHoras", label: "Horario — Horas", type: "text" },
      { key: "mapsQueryLink", label: "Enlace de ubicación (Google Maps)", type: "url" },
      { key: "directionsLink", label: "Enlace 'Cómo llegar' (centros)", type: "url" },
      { key: "formLink", label: "Formulario general (centros)", type: "url" },
      { key: "formVoluntariado", label: "Formulario de voluntariado", type: "url" },
      { key: "formPasantia", label: "Formulario de pasantía", type: "url" }
    ]
  },

  {
    key: "footer",
    label: "Pie de página",
    storage: { type: "doc", path: ["sitio", "footer"] },
    fields: [
      { key: "visitanos1", label: "Visítanos — Línea 1", type: "text" },
      { key: "visitanos2", label: "Visítanos — Línea 2", type: "text" },
      { key: "credito", label: "Crédito (años de servicio)", type: "text" },
      { key: "copyright", label: "Derechos reservados", type: "text" }
    ]
  },

  {
    key: "noticias",
    label: "Noticias",
    storage: { type: "collection", name: "noticias", orderBy: "fecha", idFrom: "titulo" },
    itemLabel: "Noticia",
    fields: [
      { key: "titulo", label: "Título", type: "text" },
      { key: "contenido", label: "Contenido", type: "textarea" },
      { key: "fecha", label: "Fecha", type: "text" },
      { key: "imagen", label: "Imagen", type: "image", folder: "noticias" },
      { key: "activa", label: "Estado", type: "select", options: [
        { value: "si", label: "Activa (visible en el sitio)" },
        { value: "no", label: "Oculta" }
      ] }
    ]
  }
];

/** Sección especial de centros (estructura propia, editor dedicado). */
export const CENTROS_SECTION = {
  key: "centros",
  label: "Centros infantiles",
  storage: { type: "doc", path: ["sitio", "centros"] }
};
