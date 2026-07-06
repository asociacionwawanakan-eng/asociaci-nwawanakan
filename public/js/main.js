const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const submenuItems = document.querySelectorAll(".has-submenu");
const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".hero-dot");
const missionSlides = document.querySelectorAll(".mission-carousel-slide");
const missionDots = document.querySelectorAll(".mission-carousel-dots span");
const visionSlides = document.querySelectorAll(".vision-carousel-slide");
const districtGrid = document.querySelector("#district-grid");
const centerDetail = document.querySelector("#center-detail");
const hasHomeHero = document.querySelector(".hero") !== null;
const hero = document.querySelector(".hero");
const statNumbers = document.querySelectorAll(".stat-number");
const mapCenterButtons = document.querySelectorAll(".map-center-button");
const mapSelectedLabel = document.querySelector("#map-selected-label");
const mapInfoCenter = document.querySelector("#map-info-center");
const mapInfoDistrict = document.querySelector("#map-info-district");
const mapInfoAddress = document.querySelector("#map-info-address");
const mapDirectionsLink = document.querySelector("#map-directions-link");
const directoryCards = document.querySelectorAll(".flip-card.directory-card");
const voluntariadoFlipCards = document.querySelectorAll(".voluntariado-flip-card");
const voluntariadoHelpCards = document.querySelectorAll(".voluntariado-help-content");
const pasantiaProcessCards = document.querySelectorAll(".pasantia-process-card");
const valueFlipCards = document.querySelectorAll(".values-feature .flip-card.value-card");
const applyFlipCards = document.querySelectorAll(".apply-flip-card");
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");
const contactSubmit = document.getElementById("contactSubmit");

let currentSlide = 0;
let carouselTimer;
let currentMissionSlide = 0;
let missionCarouselTimer;
let currentVisionSlide = 0;
let visionCarouselTimer;
let centerImpactTimer;
let selectedCenterIndex = 0;

let districts = [];
let centers = [];
let centersById = {};
let centerDetails = {};
let centerActivities = [];
let centerImpactDescriptions = [];
let centerDirectionsLink = "";
let centerFormLink = "";
let centerFacebookLink = "";
let centerWhatsappLink = "";
let centerInstitutionLogo = "assets/institucional/logotipo.png";
const officialCenterActivities = [
  ["🌱", "Identidad cultural en familia"],
  ["🍲", "Salud y nutrición"],
  ["✨", "Afectividad y espiritualidad en la familia"],
  ["🧠", "Desarrollo psicomotriz y cognitivo"]
];

async function loadData() {
  try {
    let centersData = null;
    let configData = null;

    // Preferir Firestore (CMS) cuando esté configurado; si no, usar los JSON locales.
    try {
      const cms = await import("./firebase-content.js");
      [centersData, configData] = await Promise.all([cms.loadCenters(), cms.loadSiteConfig()]);
    } catch {
      // El módulo del CMS o Firebase no está disponible: se usa el fallback JSON.
    }

    if (!centersData) centersData = await fetch("data/centers.json").then(r => r.json());
    if (!configData) configData = await fetch("data/config.json").then(r => r.json());

    districts = centersData.districts;
    centers = centersData.centers;
    centerDetails = centersData.centerDetails;
    centerActivities = centersData.activities;
    centerImpactDescriptions = centersData.impactDescriptions;

    centersById = centers.reduce((acc, center, index) => {
      acc[center.id] = { ...center, index };
      return acc;
    }, {});

    centerDirectionsLink = configData.directionsLink;
    centerFormLink = configData.formLink;
    centerFacebookLink = configData.facebookLink;
    centerWhatsappLink = configData.whatsappLink;
    centerInstitutionLogo = configData.institutionLogo;
  } catch {
    // Si falla la carga (ej. archivo local sin servidor), continúa sin datos de centros
  }
}

function getCenterProfile(district, name, image) {
  const detail = centerDetails[name] || {};
  const displayName = detail.name || name;
  const imageFile = detail.image || image;
  // Soporta tanto nombres de archivo locales (assets/centros/…) como URLs
  // absolutas subidas al CMS (Cloudinary).
  const normalizeCenterImage = (file) => {
    const value = String(file || "").trim();
    if (!value) return "";
    if (/^https?:\/\//.test(value) || value.startsWith("assets/")) return value;
    return `assets/centros/${value}`;
  };
  const imagePath = normalizeCenterImage(imageFile);
  const mainImagePath = normalizeCenterImage(detail.imagenPrincipal || detail.heroImage || imageFile) || imagePath;
  const galleryImages = Array.from({ length: 4 }, (_, index) => {
    const photo = Array.isArray(detail.fotos) ? detail.fotos[index] : "";
    return normalizeCenterImage(photo) || imagePath;
  });
  const normalizeActivity = (activity) => {
    if (Array.isArray(activity)) return [activity[0] || "", activity[1] || ""];
    activity = activity || {};
    return [
      activity.icon || activity.icono || "",
      activity.label || activity.texto || activity.actividad || ""
    ];
  };
  const detailActivities = Array.isArray(detail.actividades)
    ? detail.actividades.map(normalizeActivity).filter(([icon, activity]) => icon || activity)
    : [];
  const centerSpecificActivities = detailActivities.length === officialCenterActivities.length
    ? detailActivities
    : officialCenterActivities;
  const director = detail.directora || {};
  const directorPhoto = normalizeCenterImage(director.foto || detail.directoraFoto) || "assets/equipo/presidenta1.png";
  const address = detail.address || "Direccion institucional por actualizar, El Alto";
  return {
    name: displayName,
    district: district.name,
    subtitulo: detail.subtitulo || "Centro infantil con acompañamiento, cuidado y formación integral",
    address,
    mapsLink: detail.mapsLink || null,
    portada: mainImagePath,
    imagenPrincipal: mainImagePath,
    logoCentro: imagePath,
    logoWawanakan: "assets/institucional/logotipo.png",
    resenaTitulo: detail.resenaTitulo || detail.historiaTitulo || "Reseña histórica",
    resena: detail.resenaTexto || detail.resena || `${displayName} forma parte de la red de centros infantiles acompañados por Wawanakan, fortaleciendo espacios de cuidado, aprendizaje y buen trato para la niñez.`,
    informacionGeneral: `El centro brinda acompañamiento integral a niñas y niños, promoviendo experiencias educativas, juego, cuidado diario y relación cercana con las familias y la comunidad.`,
    directora: {
      nombre: director.nombre || detail.directoraNombre || "Lic. Tania Loyola Acarapi Mamani",
      cargo: director.cargo || detail.directoraCargo || "Directora",
      foto: directorPhoto,
      descripcion: "Lidera la gestión del centro con compromiso, vocación de servicio y enfoque en el bienestar integral de la niñez y sus familias."
    },
    galeria: galleryImages,
    actividades: centerSpecificActivities,
    facebookLink: detail.facebookLink || centerFacebookLink,
    whatsappLink: detail.whatsappLink || centerWhatsappLink
  };
}

function getDirectionsFromCurrentLocation(center) {
  if (typeof center.lat === "number" && typeof center.lng === "number") {
    return `https://www.google.com/maps/dir/?api=1&origin=Current%20Location&destination=${center.lat},${center.lng}`;
  }
  if (center.mapsLink) return center.mapsLink;
  return `https://www.google.com/maps/dir/?api=1&origin=Current%20Location&destination=${encodeURIComponent(center.address)}`;
}

function setHeaderState() {
  header.classList.toggle("scrolled", !hasHomeHero || window.scrollY > 24);
}

function showSlide(index) {
  if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length;
  hero?.classList.toggle("first-slide-active", currentSlide === 0);
  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === currentSlide;
    slide.classList.remove("active", "is-zooming");
    if (!isActive) return;
    slide.classList.add("active");
    // Doble rAF: el primer frame flushea remove("is-zooming") al DOM,
    // el segundo dispara la transición CSS desde el estado limpio.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => slide.classList.add("is-zooming"));
    });
  });
  dots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === currentSlide));
}

function startCarousel() {
  if (!slides.length) return;
  clearInterval(carouselTimer);
  // Carruseles: cambian automaticamente cada 4 segundos.
  carouselTimer = setInterval(() => showSlide(currentSlide + 1), 4000);
}

function showMissionSlide(index) {
  if (!missionSlides.length) return;
  currentMissionSlide = (index + missionSlides.length) % missionSlides.length;
  missionSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === currentMissionSlide);
  });
  missionDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === currentMissionSlide);
  });
}

function startMissionCarousel() {
  if (!missionSlides.length) return;
  clearInterval(missionCarouselTimer);
  missionCarouselTimer = setInterval(() => showMissionSlide(currentMissionSlide + 1), 4000);
}

function showVisionSlide(index) {
  if (!visionSlides.length) return;
  currentVisionSlide = (index + visionSlides.length) % visionSlides.length;
  visionSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === currentVisionSlide);
  });
}

function startVisionCarousel() {
  if (!visionSlides.length) return;
  clearInterval(visionCarouselTimer);
  visionCarouselTimer = setInterval(() => showVisionSlide(currentVisionSlide + 1), 4000);
}

function stopCarousel() { clearInterval(carouselTimer); }
function stopMissionCarousel() { clearInterval(missionCarouselTimer); }
function stopVisionCarousel() { clearInterval(visionCarouselTimer); }

function animateStatNumber(numberElement) {
  const target = Number(numberElement.dataset.target);
  const duration = 2000;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    numberElement.textContent = Math.round(target * easedProgress).toLocaleString("es-BO");

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
      return;
    }

    numberElement.textContent = target.toLocaleString("es-BO");
  }

  requestAnimationFrame(updateCounter);
}

function updateMapInfo(center) {
  if (mapSelectedLabel) mapSelectedLabel.textContent = center.name;
  if (mapInfoCenter) mapInfoCenter.textContent = center.name;
  if (mapInfoDistrict) mapInfoDistrict.textContent = center.district;
  if (mapInfoAddress) mapInfoAddress.textContent = center.address;
  if (mapDirectionsLink) mapDirectionsLink.href = getDirectionsFromCurrentLocation(center);
}

function setActiveMapCenter(centerReference) {
  const referencedCenter = typeof centerReference === "string" ? centersById[centerReference] : centers[centerReference];
  const center = referencedCenter || centers[0];
  selectedCenterIndex = center.index ?? centers.indexOf(center);
  mapCenterButtons.forEach((button) => {
    const isActive = button.dataset.center === center.id || Number(button.dataset.centerMap) === selectedCenterIndex;
    button.classList.toggle("active", isActive);
  });

  updateMapInfo(center);
}

function closeMobileMenu() {
  if (!siteNav || !header || !navToggle) return;
  siteNav.classList.remove("open");
  header.classList.remove("open");
  document.body.classList.remove("menu-open");
  navToggle.classList.remove("active");
  navToggle.setAttribute("aria-expanded", "false");
  submenuItems.forEach((item) => {
    item.classList.remove("open");
    item.querySelector(".submenu-toggle, .nav-link")?.setAttribute("aria-expanded", "false");
  });
}

function renderDistricts() {
  if (!districtGrid) return;
  districtGrid.innerHTML = districts.map((district, districtIndex) => `
    <article class="district-card">
      <h3>${district.name}</h3>
      <div class="center-buttons">
        ${district.centers.map(([name, image], centerIndex) => `
          <button class="center-button" type="button" data-district="${districtIndex}" data-center="${centerIndex}" data-image="${image}">
            ${name}
          </button>
        `).join("")}
      </div>
    </article>
  `).join("");
}

function openCenter(districtIndex, centerIndex) {
  const district = districts[districtIndex];
  const [name, image] = district.centers[centerIndex];
  const center = getCenterProfile(district, name, image);
  clearInterval(centerImpactTimer);

  centerDetail.hidden = false;
  centerDetail.innerHTML = `
    <article class="center-profile">
      <div class="center-hero" style="background-image: linear-gradient(110deg, rgba(42,11,3,0.88), rgba(66,19,4,0.5)), url('${center.portada}')">
        <button class="center-back close-center" type="button">← Volver a centros</button>
        <div class="center-hero-content">
          <div>
            <p class="eyebrow">${center.district}</p>
            <h2>${center.name}</h2>
            <p>${center.subtitulo}</p>
            <span class="center-address-pill">📍 ${center.address}</span>
          </div>
          <div class="center-hero-logos" aria-label="Logotipos del centro">
            <img src="${center.logoCentro}" alt="Logo o imagen de ${center.name}">
            <img src="${center.logoWawanakan}" alt="Logo Wawanakan">
          </div>
        </div>
        <div class="center-hero-actions">
          <a href="voluntariado.html">🤝 Voluntariado</a>
          <a href="pasantia.html">🎓 Pasantía</a>
        </div>
      </div>

      <div class="center-body">
        <div class="center-main-photo">
          <img src="${center.imagenPrincipal}" alt="Imagen principal de ${center.name}">
        </div>

        <div class="center-info-panel">
          <section class="center-glass-block">
            <h3>Información general</h3>
            <p>${center.informacionGeneral}</p>
          </section>

          <section class="center-history-card">
            <span aria-hidden="true">📖</span>
            <div>
              <h3>Reseña histórica</h3>
              <p>${center.resena}</p>
              <button type="button">Conocer historia</button>
            </div>
          </section>

          <section class="center-address-card">
            <h3>Dirección</h3>
            <p>${center.address}</p>
            <p><strong>Distrito:</strong> ${center.district.replace("Distrito ", "")}</p>
            <p><strong>Enfoque de servicio:</strong> Atención integral a la primera infancia.</p>
          </section>
        </div>

        <section class="center-activities">
          <h3>Actividades que realizan</h3>
          <div>
            ${center.actividades.map(([icon, activity]) => `<article><span>${icon}</span><strong>${activity}</strong></article>`).join("")}
          </div>
        </section>

        <div class="director-social-layout">
          <div class="director-flip-card" id="directorFlipCard" tabindex="0" role="button" aria-label="Ver descripcion de la directora">
            <div class="director-flip-inner">
              <div class="director-face director-front">
                <h3 class="director-section-title">Directora del centro</h3>
                <img class="director-photo" src="${center.directora.foto}" alt="Directora del centro">
                <h4 class="director-name">${center.directora.nombre}</h4>
                <span class="director-role">${center.directora.cargo}</span>
              </div>
              <div class="director-face director-back">
                <h3 class="director-section-title">Directora del centro</h3>
                <p class="director-description">${center.directora.descripcion}</p>
              </div>
            </div>
          </div>

          <div class="social-card">
            <h3 class="social-title">Síguenos para más información</h3>
            <a class="social-btn facebook-btn" href="${center.facebookLink}" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a class="social-btn whatsapp-btn" href="${center.whatsappLink}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>

        <section class="center-gallery">
          <h3>Galeria del centro</h3>
          <div>
            ${center.galeria.map((photo, index) => `<img src="${photo}" alt="Galeria de ${center.name} ${index + 1}">`).join("")}
          </div>
          <button type="button">Ver mas fotos</button>
        </section>

        <section class="center-identity">
          <h3>Logotipos e identidad</h3>
          <div>
            <article><img src="${center.logoCentro}" alt="Identidad de ${center.name}"><strong>${center.name}</strong></article>
            <article><img src="${center.logoWawanakan}" alt="Logo Wawanakan"><strong>Wawanakan</strong></article>
          </div>
        </section>

        <div class="center-bottom-actions">
          <button class="center-back close-center" type="button">Volver a centros</button>
        </div>
      </div>
    </article>
  `;

  // El template completo se genera primero para aprovechar un solo reflow;
  // luego se eliminan o reescriben elementos opcionales según el estado real del centro.
  const locationText = centerDetail.querySelector(".center-address-pill");
  if (locationText) {
    const dirLink = center.mapsLink || centerDirectionsLink;
    locationText.outerHTML = `<a class="center-location-button" href="${dirLink}" target="_blank" rel="noopener noreferrer">Cómo llegar al centro</a>`;
  }

  const centerTitle = centerDetail.querySelector(".center-hero-content h2");
  if (centerTitle) {
    centerTitle.innerHTML = `<span>${center.name}</span><img class="center-title-logo" src="${centerInstitutionLogo}" alt="Logotipo Wawanakan">`;
  }

  centerDetail.querySelector(".center-hero-logos")?.remove();
  centerDetail.querySelector(".center-glass-block")?.remove();
  centerDetail.querySelector(".center-address-card")?.remove();
  centerDetail.querySelector(".center-gallery button")?.remove();
  centerDetail.querySelector(".center-identity")?.remove();
  centerDetail.querySelector(".center-history-card button")?.remove();
  if (!center.actividades.length) {
    centerDetail.querySelector(".center-activities")?.remove();
  }

  const historyTitle = centerDetail.querySelector(".center-history-card h3");
  if (historyTitle) historyTitle.textContent = center.resenaTitulo || "Reseña histórica";

  centerDetail.querySelectorAll(".center-hero-actions a").forEach((link, index) => {
    link.href = centerFormLink;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = index === 0 ? "Voluntariado" : "Pasantía";
    link.classList.add(index === 0 ? "center-action-volunteer" : "center-action-internship");
  });

  const gallery = centerDetail.querySelector(".center-gallery");
  if (gallery) {
    const galleryTitle = gallery.querySelector("h3");
    const galleryGrid = gallery.querySelector("div");
    const impactCards = center.galeria.map((photo, index) => `
      <article>
        <img src="${photo}" alt="Alcances e Impacto de ${center.name} ${index + 1}">
        <p>${centerImpactDescriptions[index % centerImpactDescriptions.length]}</p>
      </article>
    `).join("");

    gallery.classList.add("center-impact");
    if (galleryTitle) {
      galleryTitle.textContent = "Alcances e Impacto";
      galleryTitle.insertAdjacentHTML("afterend", `
        <div class="center-impact-controls" aria-label="Controles del carrusel Alcances e Impacto">
          <button class="center-impact-arrow center-impact-prev" type="button" aria-label="Ver imagen anterior">‹</button>
          <button class="center-impact-arrow center-impact-next" type="button" aria-label="Ver imagen siguiente">›</button>
        </div>
      `);
    }
    if (galleryGrid) galleryGrid.innerHTML = impactCards + impactCards;

    const getImpactStep = () => {
      const firstCard = galleryGrid.querySelector("article");
      if (!firstCard) return 294;
      const gap = Number.parseFloat(getComputedStyle(galleryGrid).columnGap) || 14;
      return firstCard.getBoundingClientRect().width + gap;
    };
    const normalizeImpactScroll = () => {
      const loopPoint = galleryGrid.scrollWidth / 2;
      if (!loopPoint) return;
      if (galleryGrid.scrollLeft >= loopPoint) galleryGrid.scrollLeft -= loopPoint;
      if (galleryGrid.scrollLeft < 0) galleryGrid.scrollLeft += loopPoint;
    };
    const moveImpact = (direction, behavior = "smooth") => {
      normalizeImpactScroll();
      const loopPoint = galleryGrid.scrollWidth / 2;
      if (direction < 0 && galleryGrid.scrollLeft <= 2) galleryGrid.scrollLeft += loopPoint;
      galleryGrid.scrollBy({
        left: direction * getImpactStep(),
        behavior
      });
      window.setTimeout(normalizeImpactScroll, behavior === "smooth" ? 520 : 0);
    };
    const startImpactAutoplay = () => {
      clearInterval(centerImpactTimer);
      centerImpactTimer = setInterval(() => moveImpact(1), 3600);
    };

    startImpactAutoplay();
    gallery.addEventListener("click", (event) => {
      const button = event.target.closest(".center-impact-arrow");
      if (!button || !galleryGrid) return;
      moveImpact(button.classList.contains("center-impact-prev") ? -1 : 1);
      startImpactAutoplay();
    });
  }

  centerDetail.scrollIntoView({ behavior: "smooth", block: "start" });
}

if (navToggle && siteNav && header) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    header.classList.toggle("open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

submenuItems.forEach((item) => {
  const button = item.querySelector(".submenu-toggle, .nav-link");
  if (!button) return;
  button.addEventListener("click", () => {
    const isMobileMenu = window.innerWidth <= 992;
    if (isMobileMenu) {
      submenuItems.forEach((otherItem) => {
        if (otherItem === item) return;
        otherItem.classList.remove("open");
        otherItem.querySelector(".submenu-toggle, .nav-link")?.setAttribute("aria-expanded", "false");
      });
    }

    const isOpen = item.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

navLinks.forEach((link) => link.addEventListener("click", closeMobileMenu));


dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
    startCarousel();
  });
});

missionDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showMissionSlide(index);
    startMissionCarousel();
  });
});

if (districtGrid) {
  districtGrid.addEventListener("click", (event) => {
    const button = event.target.closest(".center-button");
    if (!button) return;
    openCenter(Number(button.dataset.district), Number(button.dataset.center));
  });
}

if (centerDetail) {
  centerDetail.addEventListener("click", (event) => {
    const directorCard = event.target.closest(".director-flip-card");
    if (directorCard) {
      directorCard.classList.toggle("flipped");
      return;
    }

    if (!event.target.closest(".close-center")) return;
    clearInterval(centerImpactTimer);
    centerDetail.hidden = true;
    centerDetail.innerHTML = "";
  });

  centerDetail.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const directorCard = event.target.closest(".director-flip-card");
    if (!directorCard) return;
    event.preventDefault();
    directorCard.classList.toggle("flipped");
  });
}

if (mapCenterButtons.length) {
  mapCenterButtons.forEach((button) => {
    if (button.disabled) return;
    button.addEventListener("click", () => setActiveMapCenter(button.dataset.center || Number(button.dataset.centerMap)));
  });
}

directoryCards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("is-flipped");
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    card.classList.toggle("is-flipped");
  });
});

voluntariadoFlipCards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("is-flipped");
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    card.classList.toggle("is-flipped");
  });
});

pasantiaProcessCards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("is-flipped");
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    card.classList.toggle("is-flipped");
  });
});

applyFlipCards.forEach((card) => {
  card.classList.remove("flipped");

  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    card.classList.toggle("flipped");
  });
});

valueFlipCards.forEach((card) => {
  card.classList.remove("is-flipped", "flipped");
});

document.addEventListener("click", (event) => {
  const card = event.target.closest(".values-grid .flip-card.value-card");
  if (!card) return;
  card.classList.toggle("flipped");
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest(".values-grid .flip-card.value-card");
  if (!card) return;
  event.preventDefault();
  card.classList.toggle("flipped");
});

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);

    if (contactStatus) {
      contactStatus.textContent = "Enviando mensaje...";
      contactStatus.className = "contact-form-status contact-status sending";
    }
    if (contactSubmit) contactSubmit.setAttribute("aria-busy", "true");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch("https://formsubmit.co/ajax/presidencia.wawanakan@gmail.com", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        if (contactStatus) {
          contactStatus.textContent = "Mensaje enviado correctamente. Gracias por contactarnos.";
          contactStatus.className = "contact-form-status contact-status success";
        }
        contactForm.reset();
        if (contactSubmit) contactSubmit.removeAttribute("aria-busy");
        return;
      }

      if (contactStatus) {
        contactStatus.textContent = "No se pudo enviar el mensaje. Intenta nuevamente.";
        contactStatus.className = "contact-form-status contact-status error";
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (contactStatus) {
        const isTimeout = error.name === "AbortError";
        contactStatus.textContent = isTimeout
          ? "La solicitud tardó demasiado. Verifica tu conexión e intenta nuevamente."
          : "Error de conexión. Intenta nuevamente.";
        contactStatus.className = "contact-form-status contact-status error";
      }
    }

    if (contactSubmit) contactSubmit.removeAttribute("aria-busy");
  });
}

voluntariadoHelpCards.forEach((card) => {
  const toggleHelpCard = () => {
    card.classList.toggle("is-flipped");
  };

  card.addEventListener("click", toggleHelpCard);

  card.addEventListener("touchend", (event) => {
    event.preventDefault();
    toggleHelpCard();
  }, { passive: false });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleHelpCard();
  });
});

const sections = [...document.querySelectorAll("main section")];
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

sections.forEach((section) => observer.observe(section));

const revealItems = document.querySelectorAll(".stat-card, .value-card, .mission-panel, .map-center-button");
if (revealItems.length) {
  const revealObserver = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observerInstance.unobserve(entry.target);
    });
  }, { threshold: 0.18 });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const statsSection = document.querySelector("#alcances");
if (statNumbers.length && statsSection) {
  const statsObserver = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      statNumbers.forEach(animateStatNumber);
      observerInstance.disconnect();
    });
  }, { threshold: 0.35 });

  statsObserver.observe(statsSection);
}

if (hero && slides.length) {
  new IntersectionObserver((entries) => {
    entries.forEach(e => e.isIntersecting ? startCarousel() : stopCarousel());
  }, { threshold: 0.05 }).observe(hero);
}

const missionSection = document.querySelector(".mission-vision-feature");
if (missionSection && missionSlides.length) {
  new IntersectionObserver((entries) => {
    entries.forEach(e => e.isIntersecting ? startMissionCarousel() : stopMissionCarousel());
  }, { threshold: 0.1 }).observe(missionSection);
}

const visionCarouselEl = document.querySelector(".vision-carousel");
if (visionCarouselEl && visionSlides.length) {
  new IntersectionObserver((entries) => {
    entries.forEach(e => e.isIntersecting ? startVisionCarousel() : stopVisionCarousel());
  }, { threshold: 0.1 }).observe(visionCarouselEl);
}

window.addEventListener("scroll", setHeaderState);
window.addEventListener("resize", () => {
  if (window.innerWidth > 992) closeMobileMenu();
});

setHeaderState();
if (slides.length) showSlide(0);
startCarousel();
if (missionSlides.length) showMissionSlide(0);
if (visionSlides.length) showVisionSlide(0);
// Los carruseles de misión y visión arrancan vía IntersectionObserver al entrar al viewport.

// Esperar a que firebase-content.js termine de cargar antes de llamar loadData()
// Esto garantiza que Firestore esté listo y se prefiera sobre JSON locales
async function initializeCenters() {
  await loadData();
  renderDistricts();
  if (mapCenterButtons.length) {
    const initializeLocationMap = () => setActiveMapCenter(mapCenterButtons[0]?.dataset.center || 0);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initializeLocationMap, { once: true });
    } else {
      initializeLocationMap();
    }
  }
}

// Iniciar después de que firebase-content.js dispare content-ready
document.addEventListener("wawa:content-ready", initializeCenters, { once: true });
// Fallback si toma demasiado tiempo o falla
setTimeout(initializeCenters, 3000);

// Recargar datos de centros cuando el admin guarda cambios en Firestore
async function reloadCenters() {
  if (!window.WawaContent || !window.WawaContent.loadCenters) return;
  try {
    const centersData = await window.WawaContent.loadCenters();
    if (!centersData) return;
    districts = centersData.districts;
    centers = centersData.centers;
    centerDetails = centersData.centerDetails;
    centerActivities = centersData.activities;
    centerImpactDescriptions = centersData.impactDescriptions;
    centersById = centers.reduce((acc, c, i) => { acc[c.id] = { ...c, index: i }; return acc; }, {});
    if (districtGrid) renderDistricts();
  } catch { /* silent */ }
}
document.addEventListener("wawa:content-updated", reloadCenters);
