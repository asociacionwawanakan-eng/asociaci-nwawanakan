/**
 * Contenido por defecto del sitio (espejo del contenido actual).
 *
 * Cumple dos funciones:
 *  1. FALLBACK del sitio público: si Firestore no responde o el CMS no está
 *     configurado, la hidratación usa estos valores (idénticos al HTML actual,
 *     por lo que el sitio se ve igual sin conexión).
 *  2. SEED de migración: el panel /admin puede sembrar Firestore con estos
 *     valores la primera vez (Fase I del plan).
 *
 * La estructura refleja el esquema de Firestore documentado en
 * docs/FIREBASE_CMS_PLAN.md. Las rutas de imagen son relativas a /public;
 * cuando el administrador suba imágenes a Cloudinary, se guardarán URLs https
 * completas y la hidratación las usará tal cual.
 */

export const DEFAULT_CONTENT = {
  // ── sitio/config ───────────────────────────────────────────────────
  config: {
    whatsappLink: "https://wa.me/59179164334",
    whatsappTexto: "(+591) 79164334",
    facebookLink: "https://www.facebook.com/profile.php?id=61590971327508&locale=es_LA",
    tiktokLink: "https://www.tiktok.com/@asociacionwawanakan?is_from_webapp=1&sender_device=pc",
    websiteLink: "https://asociacionwawanakan-eng.github.io/asociaci-nwawanakan/",
    email: "presidencia.wawanakan@gmail.com",
    direccionLinea1: "Calle 6, Villa Dolores",
    direccionLinea2: "El Alto, La Paz - Bolivia",
    horarioDias: "Lunes a viernes",
    horarioHoras: "08:00 - 16:00 hrs.",
    mapsQueryLink: "https://www.google.com/maps/search/?api=1&query=Calle%206%20Villa%20Dolores%20El%20Alto%20La%20Paz%20Bolivia",
    directionsLink: "https://www.google.com/maps/dir/?api=1&destination=Zona%20Cupilupaca%2C%20Calle%20Rio%20Bermejo%20N%C2%B0%201064%2C%20El%20Alto%2C%20Bolivia",
    formLink: "https://docs.google.com/forms/d/e/1FAIpQLSff0HB9Bk4NkzAGlJEjGz90EJTxngUOCM3u4kDIBKY1dydNCw/viewform?usp=sharing&ouid=111170788783476830138",
    formVoluntariado: "https://docs.google.com/forms/d/e/1FAIpQLSff0HB9Bk4NkzAGlJEjGz90EJTxngUOCM3u4kDIBKY1dydNCw/viewform?usp=sharing&ouid=111170788783476830138",
    formPasantia: "https://docs.google.com/forms/d/e/1FAIpQLSfdP1HmZJ5-J9TSSKdyPTiAr6LRWsYknrKuSWTYwveyKi179A/viewform?usp=publish-editor",
    institutionLogo: "assets/institucional/logotipo.png"
  },

  // ── sitio/footer ───────────────────────────────────────────────────
  footer: {
    visitanos1: "Calle 6, Villa Dolores",
    visitanos2: "El Alto, La Paz - Bolivia",
    credito: "Asociación Wawanakan Kusisiñapa | Desde 2008 – 2026 | 18 años al servicio de la niñez",
    copyright: "© 2026. Todos los derechos reservados."
  },

  // ── sitio/home ─────────────────────────────────────────────────────
  home: {
    heroSubtitle: "Identidad, cultura y equidad como pilares de nuestro servicio.",
    aboutTitle: "¿Quiénes somos?",
    aboutSubtitle: "Cuidamos, educamos y acompañamos la primera infancia.",
    aboutText: "La Asociación Wawanakan Kusisiñapa es una institución dependiente de la Diócesis de El Alto que trabaja por el bienestar y desarrollo integral de la primera infancia. A través de una red de Centros Infantiles, brindamos atención integral a niños y niñas de 2 a 4 años, promoviendo su desarrollo educativo, emocional, nutricional y social en un entorno seguro, inclusivo y basado en valores cristianos. Nuestra labor se desarrolla bajo los lineamientos de la Ley N.º 070 Avelino Siñani - Elizardo Pérez.",
    aboutImage: "assets/hero/hero7.jpg",
    alcancesBeneficiarios: "643",
    alcancesCentros: "12",
    alcancesDistritos: "6",
    objetivoText: "Coordinar acciones de defensa, atención, protección y educación integral de niños y niñas de 6 meses a menores de 5 años, preferentemente a los que se encuentran en situaciones de pobreza extrema y marginalidad en la ciudad de El Alto y provincias que se encuentren en la jurisdicción de la Diócesis de El Alto.",
    objetivoImage: "assets/contenido/objetivo.jpg",
    mision: "Somos una asociación sin fines de lucro que forma parte de las obras sociales de la Diócesis de El Alto, que gestiona relaciones interinstitucionales efectivas de corresponsabilidad con instituciones del Estado y privadas, buscando coadyuvar en el funcionamiento y fortalecimiento de los centros infantiles y de educación especial dentro de los valores cristiano-católicos.",
    vision: "Ser referente en la transformación social desde la primera infancia, con valores cristiano-católicos.",
    alliesText: "Gracias a nuestros aliados, fortalecemos el cuidado, la educación y el desarrollo integral de la primera infancia.",
    alliesImage: "assets/institucional/aliado1.png"
  },

  // ── sitio/heroSlides ───────────────────────────────────────────────
  heroSlides: {
    slides: [
      { src: "assets/hero/hero1.jpg", alt: "Niños y niñas participando en actividades educativas en el Centro Wawanakan" },
      { src: "assets/hero/hero2.jpg", alt: "Actividad grupal con primera infancia en los centros Wawanakan" },
      { src: "assets/hero/hero3.jpg", alt: "Equipo de voluntarios acompañando a niñas y niños de la Asociación" },
      { src: "assets/hero/hero4.jpg", alt: "Niños disfrutando de actividades lúdicas y de aprendizaje" },
      { src: "assets/hero/hero5.jpg", alt: "Comunidad y familias reunidas en un centro Wawanakan" }
    ]
  },

  // ── sitio/misionSlides ─────────────────────────────────────────────
  misionSlides: {
    slides: [
      { src: "assets/mision/mision1.jpg", alt: "Imagen de misión institucional" },
      { src: "assets/mision/mision2.jpg", alt: "Imagen de educación y acompañamiento infantil" },
      { src: "assets/mision/mision3.jpg", alt: "Imagen de protección y servicio infantil" },
      { src: "assets/mision/mision4.jpg", alt: "Imagen de compromiso social Wawanakan" }
    ]
  },

  // ── sitio/visionSlides ─────────────────────────────────────────────
  visionSlides: {
    slides: [
      { src: "assets/vision/vision1.jpg", alt: "Imagen de visión institucional" },
      { src: "assets/vision/vision2.jpg", alt: "Imagen de actividades para la primera infancia" },
      { src: "assets/vision/vision3.jpg", alt: "Imagen de comunidad Wawanakan" }
    ]
  },

  noticias: [],

  // ── colección valores ──────────────────────────────────────────────
  valores: [
    { id: "equidad",          titulo: "Equidad",          descripcion: "Garantizamos trato justo, inclusivo y sin discriminación, respetando la igualdad de oportunidades.",                         orden: 1, icono: '<path d="M32 12v40M20 20h24M20 20l-9 17h18L20 20Zm24 0-9 17h18l-9-17ZM24 52h16"/>' },
    { id: "solidaridad",      titulo: "Solidaridad",      descripcion: "Promovemos el apoyo mutuo entre asociaciones, familias y comunidad en favor de la niñez.",                                   orden: 2, icono: '<path d="M32 50S13 38 13 24c0-7 5-12 12-12 4 0 7 2 7 5 0-3 4-5 8-5 7 0 11 5 11 12 0 14-19 26-19 26Z"/>' },
    { id: "respeto",          titulo: "Respeto",          descripcion: "Se trata de reconocer, aceptar y valorar la dignidad, los derechos y las diferencias de las demás personas.",               orden: 3, icono: '<path d="M32 35s-9-6-9-13c0-4 3-7 7-7 2 0 4 1 5 3 1-2 3-3 5-3 4 0 7 3 7 7 0 7-15 17-15 17Z"/><path d="M12 38c8 0 12 8 20 8s12-8 20-8M16 45c6 5 11 7 16 7s10-2 16-7"/>' },
    { id: "trabajo-en-equipo",titulo: "Trabajo en Equipo",descripcion: "Es una colaboración de manera organizada para alcanzar un objetivo en común.",                                              orden: 4, icono: '<path d="M22 29a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm20 0a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM10 50c1-10 6-15 12-15s11 5 12 15M30 50c1-10 6-15 12-15s11 5 12 15"/><path d="M31 28h7v7h-7z"/>' },
    { id: "honestidad",       titulo: "Honestidad",       descripcion: "Impulsamos el uso responsable y claro de los recursos institucionales.",                                                     orden: 5, icono: '<path d="M32 8 14 15v14c0 13 8 22 18 27 10-5 18-14 18-27V15L32 8Z"/><path d="m24 32 6 6 11-14"/>' }
  ],

  // ── sitio/equipo + colección directorio ────────────────────────────
  equipo: {
    fotoGrupal: "assets/equipo/equipo.png",
    brandTagline: "Por la niñez, por el futuro.",
    subtitulo: "Gestión transparente para una niñez con oportunidades.",
    cierre: "Acompañamos hoy, transformamos el mañana."
  },
  directorio: [
    { id: "presidencia", nombre: "Lic. Tania Loyola Acarapi Mamani", cargo: "Presidencia", descripcionCargo: "Lidera y representa institucionalmente a la asociación.", foto: "assets/equipo/presidenta1.png", orden: 1 },
    { id: "vicepresidencia", nombre: "Lic. M. Danna Argani Mita", cargo: "Vicepresidencia", descripcionCargo: "Apoya la coordinación general y el fortalecimiento organizacional.", foto: "assets/equipo/vicepresidenta.png", orden: 2 },
    { id: "actas", nombre: "Lic. Adela Fabio Quelca", cargo: "Área de Actas", descripcionCargo: "Gestiona el registro, orden y seguimiento documental.", foto: "assets/equipo/actas1.png", orden: 3 },
    { id: "proyectos-nacionales", nombre: "Lic. Virginia Flora Tito Flores", cargo: "Proyectos Nacionales", descripcionCargo: "Impulsa iniciativas y articulaciones a nivel nacional.", foto: "assets/equipo/nacional.png", orden: 4 },
    { id: "hacienda", nombre: "Lic. Danaida Paula Flores Baltazar", cargo: "Área de Hacienda", descripcionCargo: "Apoya la gestión administrativa y el seguimiento económico.", foto: "assets/equipo/tesoreria.png", orden: 5 },
    { id: "proyectos-internacionales", nombre: "Lic. Yrene Elena Copa Orellana", cargo: "Proyectos Internacionales", descripcionCargo: "Fortalece vínculos y oportunidades de cooperación externa.", foto: "assets/equipo/internacional.png", orden: 6 }
  ],

  // ── sitio/voluntariado ─────────────────────────────────────────────
  voluntariado: {
    heroTitle: "Voluntariado Wawanakan",
    heroLead: "Transforma vidas desde el voluntariado",
    heroSublead: "Acompaña, aprende y aporta al bienestar de la niñez.",
    heroImage: "assets/contenido/voluntariado.png",
    processImage: "assets/contenido/voluntariado2.jpg",
    ctaTitle: "Tu tiempo es un regalo, su futuro una esperanza.",
    formLink: "https://docs.google.com/forms/d/e/1FAIpQLSff0HB9Bk4NkzAGlJEjGz90EJTxngUOCM3u4kDIBKY1dydNCw/viewform?usp=sharing&ouid=111170788783476830138",
    beneficios: [
      { icon: "❤", titulo: "Genera impacto", texto: "Acompaña y apoya el desarrollo integral de niñas y niños." },
      { icon: "✦", titulo: "Aprende", texto: "Conoce de cerca los desafíos que enfrenta la niñez en Bolivia." },
      { icon: "↑", titulo: "Fortalece tus habilidades", texto: "Desarrolla empatía, compromiso, liderazgo y trabajo en equipo." },
      { icon: "✓", titulo: "Certificación", texto: "Al finalizar tu voluntariado recibirás un certificado por tus horas de servicio." }
    ],
    formasAyuda: [
      { titulo: "Atención y desarrollo infantil", texto: "Apoya el aprendizaje, el juego, la psicomotricidad y el cuidado diario de niñas y niños, acompañando su crecimiento con amor, paciencia y alegría." },
      { titulo: "Bienestar integral infantil", texto: "Contribuye al bienestar emocional, social y alimentario de los niños, promoviendo espacios seguros, saludables y llenos de buen trato." },
      { titulo: "Expresión, creatividad y aprendizaje", texto: "Impulsa actividades de arte, música, manualidades, deportes y juegos educativos que despierten la imaginación, la confianza y la participación de cada niño." },
      { titulo: "Comunicación e imagen institucional", texto: "Ayuda a visibilizar el trabajo de Wawanakan mediante redes sociales, fotografía, video, diseño y comunicación, mostrando historias que inspiran solidaridad." },
      { titulo: "Gestión y fortalecimiento organizacional", texto: "Apoya en tareas administrativas, organización de actividades, campañas y eventos solidarios que fortalecen el trabajo institucional de la asociación." }
    ],
    pasos: [
      { titulo: "Envía tu postulación", texto: "Llena el formulario y cuéntanos quién eres, qué sabes hacer y cómo deseas apoyar a la niñez." },
      { titulo: "Pasa el filtro de entrevista", texto: "Revisaremos tu solicitud y tendrás una entrevista breve para conocer tu compromiso, responsabilidad y ganas de ayudar." },
      { titulo: "Inicia tu voluntariado", texto: "Si eres seleccionado, te contactaremos para coordinar tu participación y empezar esta experiencia que transforma vidas." }
    ]
  },

  // ── sitio/pasantia ─────────────────────────────────────────────────
  pasantia: {
    titulo: "Pasantías Wawanakan",
    subtitulo: "Formación, compromiso y experiencia con propósito",
    intro: "Dirigido a estudiantes y egresados que desean fortalecer sus habilidades, adquirir experiencia y contribuir al bienestar de la niñez.",
    processImage: "assets/contenido/fondo-pasantia-proceso.jpg",
    formLink: "https://docs.google.com/forms/d/e/1FAIpQLSfdP1HmZJ5-J9TSSKdyPTiAr6LRWsYknrKuSWTYwveyKi179A/viewform?usp=publish-editor",
    requisitos: [
      "Ser estudiante universitario o egresado.",
      "Contar con respaldo o convenio institucional.",
      "Demostrar responsabilidad, ética y compromiso.",
      "Disponibilidad para cumplir el proceso formativo."
    ],
    beneficios: [
      { titulo: "Capacitación constante" },
      { titulo: "Supervisión institucional" },
      { titulo: "Certificación y experiencia" }
    ],
    proceso: [
      { titulo: "Postulación", texto: "Envía tu solicitud y comparte tu interés en formar parte del programa de pasantías." },
      { titulo: "Revisión", texto: "El equipo revisa tu perfil, documentación y disponibilidad." },
      { titulo: "Entrevista", texto: "Se realiza una entrevista breve para conocer tu motivación y compromiso." },
      { titulo: "Ingreso", texto: "Si eres seleccionado, se coordina tu incorporación y el inicio de la pasantía." }
    ],
    convocatorias: [
      {
        estado: "vigente",
        badge: "VIGENTE",
        label: "REQUERIMIENTO DE PASANTE EN:",
        titulo: "PASANTÍA EN APOYO EDUCATIVO E INSTITUCIONAL",
        entidad: "Centros Infantiles Wawanakan",
        centro: "Centro Infantil Nueva Marka",
        ubicacion: "El Alto",
        horario: "08:00 a 16:00",
        area: "Educación / apoyo institucional",
        fecha: "27 Jun 2026",
        mapLink: "https://www.google.com/maps/dir/?api=1&destination=Nueva%20Marka%2C%20El%20Alto%2C%20Bolivia",
        facebookLink: "https://www.facebook.com/profile.php?id=61590971327508&locale=es_LA",
        whatsappLink: "https://wa.me/59179164334",
        formLink: "https://docs.google.com/forms/d/e/1FAIpQLSfdP1HmZJ5-J9TSSKdyPTiAr6LRWsYknrKuSWTYwveyKi179A/viewform?usp=publish-editor"
      }
    ]
  },

  // ── sitio/quienesSomos (portada + página dedicada) ────────────────
  quienesSomos: {
    heroTitulo: "ASOCIACIÓN\nWAWANAKAN\nKUSISIÑAPA",
    heroSubtitulo: "Identidad, cultura y equidad como pilares de nuestro servicio.",
    titulo: "Asociación Wawanakan Kusisinapa",
    texto: "La Asociación Wawanakan Kusisinapa es una institución dependiente de la Diócesis de El Alto que trabaja por el bienestar y desarrollo integral de la primera infancia. A través de una red de Centros Infantiles, brinda atención integral a niños y niñas, promoviendo su desarrollo educativo, emocional, nutricional y social en un entorno seguro, inclusivo y basado en valores cristianos.",
    imagen: "assets/contenido/quienes-somos.jpg"
  }
};
