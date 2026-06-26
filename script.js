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
const directoryCards = document.querySelectorAll(".directory-card");

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
    name: "San Francisco de As\u00eds",
    district: "Distrito 2",
    address: "Zona Cupilupaca, Calle R\u00edo Bermejo N\u00b0 1064, El Alto",
    mapsLink: "https://www.google.com/maps/dir/?api=1&origin=Current%20Location&destination=San%20Francisco%20de%20As%C3%ADs%2C%20Zona%20Cupilupaca%2C%20Calle%20R%C3%ADo%20Bermejo%20N%C2%B01064%2C%20El%20Alto%2C%20Bolivia"
  },
  {
    name: "Nueva Marka",
    district: "Distrito 4",
    address: "Zona Nueva Marka, Calle Eliodoro Camacho y Plaza 10 de Febrero, frente al m\u00f3dulo policial Nueva Marka, El Alto"
  },
  {
    name: "Mar\u00eda Auxiliadora",
    district: "Distrito 1",
    address: "Zona 12 de Octubre, Av. Ra\u00fal Salm\u00f3n entre calles 7 y 8 N\u00b0 100, El Alto"
  },
  {
    name: "Mi Rinconcito",
    district: "Distrito 5",
    address: "Zona Norte Huayna Potos\u00ed, Calle 24 N\u00b0 575, El Alto"
  },
  {
    name: "Sagrado Coraz\u00f3n de Jes\u00fas",
    district: "Distrito 3",
    address: "Plaza Primero de Mayo, El Alto"
  },
  {
    name: "Madre Piedad de la Cruz",
    district: "Distrito 3",
    address: "Villa Dolores, Calle D, El Alto"
  },
  {
    name: "Virgen de la Fuensanta",
    district: "Distrito 3",
    address: "Zona La Primera, Calle Sopocachuy, El Alto"
  },
  {
    name: "Cristo del Consuelo",
    district: "Distrito 2",
    address: "Zona Las Delicias, entre Calle Camellas y Pensamiento, El Alto"
  },
  {
    name: "Menesiano Yuri\u00f1ani",
    district: "Distrito 6",
    address: "Zona Alto Villa Victoria, El Alto"
  },
  {
    name: "Don Bosquito",
    district: "Distrito 2",
    address: "Zona Santa Rosa, Calle E N\u00b0 46A, El Alto"
  },
  {
    name: "Fundaci\u00f3n Palliri",
    district: "Distrito 2",
    address: "Villa Elizardo P\u00e9rez, Calle H\u00e9roes del Acre entre Calle 16 de Octubre, El Alto"
  },
  {
    name: "Burgosmarka",
    district: "Distrito 3",
    address: "Zona 7 de Septiembre, Calle 31 de Octubre N\u00b0 24, El Alto"
  }
];

function getDirectionsFromCurrentLocation(center) {
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

function setActiveMapCenter(index) {
  const center = centers[index] || centers[0];
  selectedCenterIndex = centers[index] ? index : 0;
  mapCenterButtons.forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.centerMap) === selectedCenterIndex);
  });

  updateMapInfo(center);
}

function closeMobileMenu() {
  siteNav.classList.remove("open");
  header.classList.remove("open");
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
  const imagePath = `assets/centros/${image}`;

  centerDetail.hidden = false;
  centerDetail.innerHTML = `
    <div class="center-hero" style="background-image: linear-gradient(90deg, rgba(42,11,3,0.86), rgba(66,19,4,0.48)), url('${imagePath}')">
      <div>
        <p class="eyebrow">${district.name}</p>
        <h2>${name}</h2>
      </div>
    </div>
    <div class="center-body">
      <div class="center-placeholder">Imagen del centro<br>${name}</div>
      <div class="center-info-panel">
        <h3>Informacion general</h3>
        <p>Informacion por actualizar sobre el centro infantil, su comunidad y servicios principales.</p>
        <h3>Actividades principales</h3>
        <p>Desarrollo educativo, acompanamiento emocional, nutricion, juego, valores y participacion familiar.</p>
        <h3>Equipo del centro</h3>
        <div class="center-team-grid">
          <article class="center-team-card accent-yellow"><span>01</span><strong>Directora o responsable</strong><p>Nombre por actualizar</p></article>
          <article class="center-team-card accent-pink"><span>02</span><strong>Educadoras</strong><p>Informacion por actualizar</p></article>
          <article class="center-team-card accent-blue"><span>03</span><strong>Personal de apoyo</strong><p>Informacion por actualizar</p></article>
          <article class="center-team-card accent-green"><span>04</span><strong>Personal de limpieza</strong><p>Informacion por actualizar</p></article>
        </div>
        <button class="btn btn-primary close-center" type="button">Cerrar informacion</button>
      </div>
    </div>
  `;
  centerDetail.scrollIntoView({ behavior: "smooth", block: "start" });
}

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  header.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

submenuItems.forEach((item) => {
  const button = item.querySelector(".nav-link");
  button.addEventListener("click", () => {
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
    button.addEventListener("click", () => setActiveMapCenter(Number(button.dataset.centerMap)));
  });
  setActiveMapCenter(0);
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

renderDistricts();
setHeaderState();
if (slides.length) showSlide(0);
startCarousel();
if (missionSlides.length) showMissionSlide(0);
startMissionCarousel();
if (visionSlides.length) showVisionSlide(0);
startVisionCarousel();
