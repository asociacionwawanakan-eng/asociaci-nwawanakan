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
const contactForm = document.querySelector("#contact-form");
const contactFormStatus = document.querySelector("#contact-form-status");

let currentSlide = 0;
let carouselTimer;
let currentMissionSlide = 0;
let missionCarouselTimer;
let currentVisionSlide = 0;
let visionCarouselTimer;
let selectedCenterIndex = 0;

const districts = [
  { name: "Distrito 1", centers: [
    ["Don Bosquito", "don-bosquito.jpg"],
    ["Maria Auxiliadora", "maria-auxiliadora.jpg"]
  ] },
  { name: "Distrito 2", centers: [
    ["San Francisco de Asis", "san-francisco-asis.jpg"],
    ["Cristo del Consuelo", "cristo-del-consuelo.jpg"],
    ["Palliri", "palliri.jpg"],
    ["Virgen de la Fuensanta", "virgen-fuensanta.jpg"]
  ] },
  { name: "Distrito 3", centers: [
    ["Beata Piedad de la Cruz", "beata-piedad.jpg"],
    ["Sagrado Corazon de Jesus", "sagrado-corazon.jpg"],
    ["Burgosmarka", "burgosmarka.jpg"]
  ] },
  { name: "Distrito 4", centers: [["Nueva Marka", "nueva-marka.jpg"]] },
  { name: "Distrito 5", centers: [["Rinconcito", "rinconcito.jpg"]] },
  { name: "Distrito 6", centers: [["Menesiano Yurinani", "menesiano-yurinani.jpg"]] }
];

const centers = [
  {
    id: "san-francisco",
    name: "San Francisco de As\u00eds",
    district: "Distrito 2",
    address: "Zona Cupilupaca, Calle R\u00edo Bermejo N\u00b0 1064, El Alto",
    lat: -16.521,
    lng: -68.176,
    mapsLink: "https://www.google.com/maps/dir/?api=1&origin=Current%20Location&destination=San%20Francisco%20de%20As%C3%ADs%2C%20Zona%20Cupilupaca%2C%20Calle%20R%C3%ADo%20Bermejo%20N%C2%B01064%2C%20El%20Alto%2C%20Bolivia"
  },
  {
    id: "nueva-marka",
    name: "Nueva Marka",
    district: "Distrito 4",
    address: "Zona Nueva Marka, Calle Eliodoro Camacho y Plaza 10 de Febrero, frente al m\u00f3dulo policial Nueva Marka, El Alto",
    lat: -16.565,
    lng: -68.206
  },
  {
    id: "maria-auxiliadora",
    name: "Mar\u00eda Auxiliadora",
    district: "Distrito 1",
    address: "Zona 12 de Octubre, Av. Ra\u00fal Salm\u00f3n entre calles 7 y 8 N\u00b0 100, El Alto",
    lat: -16.503,
    lng: -68.163
  },
  {
    id: "mi-rinconcito",
    name: "Mi Rinconcito",
    district: "Distrito 5",
    address: "Zona Norte Huayna Potos\u00ed, Calle 24 N\u00b0 575, El Alto",
    lat: -16.469,
    lng: -68.19
  },
  {
    id: "sagrado-corazon",
    name: "Sagrado Coraz\u00f3n de Jes\u00fas",
    district: "Distrito 3",
    address: "Plaza Primero de Mayo, El Alto",
    lat: -16.506,
    lng: -68.166
  },
  {
    id: "madre-piedad",
    name: "Madre Piedad de la Cruz",
    district: "Distrito 3",
    address: "Villa Dolores, Calle D, El Alto",
    lat: -16.507,
    lng: -68.163
  },
  {
    id: "virgen-fuensanta",
    name: "Virgen de la Fuensanta",
    district: "Distrito 3",
    address: "Zona La Primera, Calle Sopocachuy, El Alto",
    lat: -16.526,
    lng: -68.183
  },
  {
    id: "cristo-consuelo",
    name: "Cristo del Consuelo",
    district: "Distrito 2",
    address: "Zona Las Delicias, entre Calle Camellas y Pensamiento, El Alto",
    lat: -16.515,
    lng: -68.188
  },
  {
    id: "menesiano-yurinani",
    name: "Menesiano Yuri\u00f1ani",
    district: "Distrito 6",
    address: "Zona Alto Villa Victoria, El Alto",
    lat: -16.477,
    lng: -68.17
  },
  {
    id: "don-bosquito",
    name: "Don Bosquito",
    district: "Distrito 2",
    address: "Zona Santa Rosa, Calle E N\u00b0 46A, El Alto",
    lat: -16.499,
    lng: -68.186
  },
  {
    id: "fundacion-palliri",
    name: "Fundaci\u00f3n Palliri",
    district: "Distrito 2",
    address: "Villa Elizardo P\u00e9rez, Calle H\u00e9roes del Acre entre Calle 16 de Octubre, El Alto",
    lat: -16.528,
    lng: -68.179
  },
  {
    id: "burgosmarka",
    name: "Burgosmarka",
    district: "Distrito 3",
    address: "Zona 7 de Septiembre, Calle 31 de Octubre N\u00b0 24, El Alto",
    lat: -16.535,
    lng: -68.187
  }
];

const centersById = centers.reduce((accumulator, center, index) => {
  accumulator[center.id] = { ...center, index };
  return accumulator;
}, {});

const centerDirectionsLink = "https://www.google.com/maps/dir/?api=1&destination=Zona%20Cupilupaca%2C%20Calle%20Rio%20Bermejo%20N%C2%B0%201064%2C%20El%20Alto%2C%20Bolivia";
const centerFormLink = "https://docs.google.com/forms/d/e/1FAIpQLSff0HB9Bk4NkzAGlJEjGz90EJTxngUOCM3u4kDIBKY1dydNCw/viewform?usp=sharing&ouid=111170788783476830138";
const centerFacebookLink = "https://www.facebook.com/";
const centerWhatsappLink = "https://wa.me/591XXXXXXXX";
const centerInstitutionLogo = "assets/logotipo.png";
const centerImpactDescriptions = [
  "Actividades que fortalecen el aprendizaje y la participacion de las ninas y ninos.",
  "Espacios de cuidado, juego y acompanamiento integral.",
  "Momentos que reflejan el compromiso del centro con la ninez.",
  "Experiencias que muestran el impacto educativo y humano del centro."
];

const centerDetails = {
  "Don Bosquito": {
    subtitulo: "Centro infantil con acompanamiento, cuidado y formacion integral",
    address: "Zona Santa Rosa, Calle E N° 46A, El Alto",
    image: "don-bosquito.jpg"
  },
  "Maria Auxiliadora": {
    name: "Maria Auxiliadora",
    subtitulo: "Centro infantil con acompanamiento, cuidado y formacion integral",
    address: "Zona 12 de Octubre, Av. Raul Salmon entre calles 7 y 8 N° 100, El Alto",
    image: "maria-auxiliadora.jpg"
  },
  "San Francisco de Asis": {
    subtitulo: "Centro infantil orientado al cuidado, aprendizaje y bienestar comunitario",
    address: "Zona Cupilupaca, Calle Rio Bermejo N° 1064, El Alto",
    image: "san-francisco-asis.jpg"
  },
  "Cristo del Consuelo": {
    subtitulo: "Espacio de proteccion y desarrollo para ninas y ninos",
    address: "Zona Las Delicias, entre Calle Camellas y Pensamiento, El Alto",
    image: "cristo-del-consuelo.jpg"
  },
  Palliri: {
    name: "Fundacion Palliri",
    subtitulo: "Centro infantil comprometido con la formacion y el cuidado diario",
    address: "Villa Elizardo Perez, Calle Heroes del Acre entre Calle 16 de Octubre, El Alto",
    image: "palliri.jpg"
  },
  "Virgen de la Fuensanta": {
    subtitulo: "Centro de acompanamiento integral para la primera infancia",
    address: "Zona La Primera, Calle Sopocachuy, El Alto",
    image: "virgen-fuensanta.jpg"
  },
  "Beata Piedad de la Cruz": {
    name: "Madre Piedad de la Cruz",
    subtitulo: "Centro infantil con enfoque humano, educativo y familiar",
    address: "Villa Dolores, Calle D, El Alto",
    image: "beata-piedad.jpg"
  },
  "Sagrado Corazon de Jesus": {
    subtitulo: "Centro de cuidado, valores y participacion comunitaria",
    address: "Plaza Primero de Mayo, El Alto",
    image: "sagrado-corazon.jpg"
  },
  Burgosmarka: {
    subtitulo: "Centro infantil al servicio del desarrollo integral de la ninez",
    address: "Zona 7 de Septiembre, Calle 31 de Octubre N° 24, El Alto",
    image: "burgosmarka.jpg"
  },
  "Nueva Marka": {
    subtitulo: "Centro infantil de acompanamiento, proteccion y apoyo familiar",
    address: "Zona Nueva Marka, Calle Eliodoro Camacho y Plaza 10 de Febrero, frente al modulo policial Nueva Marka, El Alto",
    image: "nueva-marka.jpg"
  },
  Rinconcito: {
    name: "Mi Rinconcito",
    subtitulo: "Centro calido de aprendizaje, juego y cuidado integral",
    address: "Zona Norte Huayna Potosi, Calle 24 N° 575, El Alto",
    image: "rinconcito.jpg"
  },
  "Menesiano Yurinani": {
    subtitulo: "Centro infantil que promueve cuidado, valores y desarrollo temprano",
    address: "Zona Alto Villa Victoria, El Alto",
    image: "menesiano-yurinani.jpg"
  }
};

const centerActivities = [
  ["📘", "Desarrollo educativo"],
  ["💛", "Acompanamiento emocional"],
  ["🍲", "Nutricion"],
  ["🎲", "Juego"],
  ["✨", "Valores"],
  ["👨‍👩‍👧", "Participacion familiar"],
  ["🤸", "Psicomotricidad"],
  ["🤝", "Apoyo a familias"]
];

function getCenterProfile(district, name, image) {
  const detail = centerDetails[name] || {};
  const displayName = detail.name || name;
  const imageFile = detail.image || image;
  const imagePath = `assets/centros/${imageFile}`;
  const address = detail.address || "Direccion institucional por actualizar, El Alto";
  return {
    name: displayName,
    district: district.name,
    subtitulo: detail.subtitulo || "Centro infantil con acompanamiento, cuidado y formacion integral",
    address,
    portada: imagePath,
    imagenPrincipal: imagePath,
    logoCentro: imagePath,
    logoWawanakan: "assets/logotipo.png",
    resena: `${displayName} forma parte de la red de centros infantiles acompanados por Wawanakan, fortaleciendo espacios de cuidado, aprendizaje y buen trato para la ninez.`,
    informacionGeneral: `El centro brinda acompanamiento integral a ninas y ninos, promoviendo experiencias educativas, juego, cuidado diario y relacion cercana con las familias y la comunidad.`,
    directora: {
      nombre: "Lic. Tania Loyola Acarapi Mamani",
      cargo: "Directora",
      foto: "assets/presidenta1.png",
      descripcion: "Lidera la gestion del centro con compromiso, vocacion de servicio y enfoque en el bienestar integral de la ninez y sus familias."
    },
    galeria: [imagePath, imagePath, imagePath, imagePath],
    actividades: centerActivities
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
  siteNav.classList.remove("open");
  header.classList.remove("open");
  document.body.classList.remove("menu-open");
  navToggle.classList.remove("active");
  navToggle.setAttribute("aria-expanded", "false");
  submenuItems.forEach((item) => {
    item.classList.remove("open");
    item.querySelector(".nav-link").setAttribute("aria-expanded", "false");
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
          <a href="pasantia.html">🎓 Pasantia</a>
        </div>
      </div>

      <div class="center-body">
        <div class="center-main-photo">
          <img src="${center.imagenPrincipal}" alt="Imagen principal de ${center.name}">
        </div>

        <div class="center-info-panel">
          <section class="center-glass-block">
            <h3>Informacion general</h3>
            <p>${center.informacionGeneral}</p>
          </section>

          <section class="center-history-card">
            <span aria-hidden="true">📖</span>
            <div>
              <h3>Resena historica</h3>
              <p>${center.resena}</p>
              <button type="button">Conocer historia</button>
            </div>
          </section>

          <section class="center-address-card">
            <h3>Direccion</h3>
            <p>${center.address}</p>
            <p><strong>Distrito:</strong> ${center.district.replace("Distrito ", "")}</p>
            <p><strong>Enfoque de servicio:</strong> Atencion integral a la primera infancia.</p>
          </section>
        </div>

        <section class="center-activities">
          <h3>Actividades que realizan</h3>
          <div>
            ${center.actividades.map(([icon, activity]) => `<article><span>${icon}</span><strong>${activity}</strong></article>`).join("")}
          </div>
        </section>

        <section class="center-director">
          <h3>Directora del centro</h3>
          <article>
            <img src="${center.directora.foto}" alt="${center.directora.nombre}">
            <div>
              <h4>${center.directora.nombre}</h4>
              <strong>${center.directora.cargo}</strong>
              <p>${center.directora.descripcion}</p>
            </div>
          </article>
        </section>

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

  const locationText = centerDetail.querySelector(".center-address-pill");
  if (locationText) {
    locationText.outerHTML = `<a class="center-location-button" href="${centerDirectionsLink}" target="_blank" rel="noopener noreferrer">C&oacute;mo llegar al centro</a>`;
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

  const historyTitle = centerDetail.querySelector(".center-history-card h3");
  if (historyTitle) historyTitle.innerHTML = "Rese&ntilde;a hist&oacute;rica";

  centerDetail.querySelectorAll(".center-hero-actions a").forEach((link, index) => {
    link.href = centerFormLink;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.innerHTML = index === 0 ? "Voluntariado" : "Pasant&iacute;a";
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
    if (galleryTitle) galleryTitle.innerHTML = "Alcances e Impacto";
    if (galleryGrid) galleryGrid.innerHTML = impactCards + impactCards;
  }

  const bottomActions = centerDetail.querySelector(".center-bottom-actions");
  if (bottomActions) {
    bottomActions.insertAdjacentHTML("beforebegin", `
      <section class="center-social">
        <h3>S&iacute;guenos para m&aacute;s informaci&oacute;n</h3>
        <div class="center-social-actions">
          <a class="center-social-facebook" href="${centerFacebookLink}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">f</span> Facebook</a>
          <a class="center-social-whatsapp" href="${centerWhatsappLink}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">☎</span> WhatsApp</a>
        </div>
      </section>
    `);
  }

  centerDetail.scrollIntoView({ behavior: "smooth", block: "start" });
}

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  header.classList.toggle("open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  navToggle.classList.toggle("active", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

submenuItems.forEach((item) => {
  const button = item.querySelector(".nav-link");
  button.addEventListener("click", () => {
    const isMobileMenu = window.innerWidth <= 992;
    if (isMobileMenu) {
      submenuItems.forEach((otherItem) => {
        if (otherItem === item) return;
        otherItem.classList.remove("open");
        otherItem.querySelector(".nav-link").setAttribute("aria-expanded", "false");
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
    if (!event.target.closest(".close-center")) return;
    centerDetail.hidden = true;
    centerDetail.innerHTML = "";
  });
}

if (mapCenterButtons.length) {
  mapCenterButtons.forEach((button) => {
    if (button.disabled) return;
    button.addEventListener("click", () => setActiveMapCenter(button.dataset.center || Number(button.dataset.centerMap)));
  });
  const initializeLocationMap = () => setActiveMapCenter(mapCenterButtons[0]?.dataset.center || 0);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeLocationMap, { once: true });
  } else {
    initializeLocationMap();
  }
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

  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    card.classList.toggle("flipped");
  });
});

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = contactForm.elements["name"]?.value.trim() || "";
    const contact = contactForm.elements["contact"]?.value.trim() || "";
    const message = contactForm.elements["message"]?.value.trim() || "";

    if (!name || !contact || !message) {
      if (contactFormStatus) {
        contactFormStatus.textContent = "Por favor completa nombre, correo o tel\u00e9fono y mensaje.";
        contactFormStatus.classList.add("is-error");
        contactFormStatus.classList.remove("is-success");
      }
      return;
    }

    const subject = encodeURIComponent("Nuevo mensaje desde la p\u00e1gina web Wawanakan");
    const body = encodeURIComponent(
      `Nombre completo de la persona u organizaci\u00f3n: ${name}\nCorreo o tel\u00e9fono de contacto: ${contact}\n\nMensaje:\n${message}`
    );

    if (contactFormStatus) {
      contactFormStatus.textContent = "Gracias por contactarnos. Tu mensaje fue preparado para Presidencia Wawanakan.";
      contactFormStatus.classList.add("is-success");
      contactFormStatus.classList.remove("is-error");
    }

    window.location.href = `mailto:presidencia.wawanakan@gmail.com?subject=${subject}&body=${body}`;
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

window.addEventListener("scroll", setHeaderState);
window.addEventListener("resize", () => {
  if (window.innerWidth > 992) closeMobileMenu();
});

renderDistricts();
setHeaderState();
if (slides.length) showSlide(0);
startCarousel();
if (missionSlides.length) showMissionSlide(0);
startMissionCarousel();
if (visionSlides.length) showVisionSlide(0);
startVisionCarousel();
