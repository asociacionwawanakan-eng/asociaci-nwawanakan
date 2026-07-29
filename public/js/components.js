(function () {
  const NAV_HTML = `
    <a class="brand" href="index.html" aria-label="Ir al inicio">
      <img src="assets/institucional/logotipo.png" alt="Logotipo de la Asociación Wawanakan Kusisinapa">
      <span>ASOCIACIÓN WAWANAKAN</span>
    </a>
    <button class="nav-toggle" type="button" aria-label="Abrir menú" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <nav class="site-nav" aria-label="Navegación principal">
      <a href="index.html">Inicio</a>
      <div class="nav-item has-submenu nav-group">
        <button class="nav-link submenu-toggle" type="button" aria-expanded="false">Quiénes somos</button>
        <div class="submenu">
          <a href="index.html#alcances">Alcances</a>
          <a href="index.html#objetivo">Nuestro Objetivo</a>
          <a href="index.html#mision-vision">Misión y Visión</a>
          <a href="index.html#valores">Valores</a>
        </div>
      </div>
      <div class="nav-item has-submenu nav-group">
        <button class="nav-link submenu-toggle" type="button" aria-expanded="false">Nosotros</button>
        <div class="submenu">
          <a href="nuestro-equipo.html">Nuestro Equipo</a>
          <a href="voluntariado.html">Voluntariado</a>
          <a href="pasantia.html">Pasantía</a>
        </div>
      </div>
      <a href="centros.html">Centros</a>
      <a href="index.html#noticias">Noticias</a>
      <a href="contactos.html">Contactos</a>
    </nav>
  `;

  const FOOTER_HTML = `
    <div class="site-footer-inner">
      <section class="footer-brand-block" aria-label="Redes sociales">
        <img class="footer-logo" src="assets/institucional/logotipo.png" alt="Logotipo Wawanakan" data-cms-src="footer.logoFooter">
        <p data-cms-text="footer.textoRedes">Síguenos en nuestras redes:</p>
        <div class="footer-socials">
          <a data-footer-social-index="0" href="https://www.facebook.com/profile.php?id=61590971327508&amp;locale=es_LA" target="_blank" rel="noopener noreferrer" aria-label="Facebook de Wawanakan"><span aria-hidden="true">f</span></a>
          <a data-footer-social-index="1" href="https://www.tiktok.com/@asociacionwawanakan?is_from_webapp=1&amp;sender_device=pc" target="_blank" rel="noopener noreferrer" aria-label="TikTok de Wawanakan"><span aria-hidden="true">♪</span></a>
          <a data-footer-social-index="2" href="https://wa.me/59179164334" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp de Wawanakan"><span aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M12.04 3.5A8.38 8.38 0 0 0 3.66 11.88c0 1.48.39 2.92 1.14 4.2L3.5 20.5l4.54-1.19a8.32 8.32 0 0 0 4 1.02h.01a8.38 8.38 0 0 0-.01-16.76zm4.91 11.85c-.21.58-1.21 1.1-1.68 1.14-.43.04-.97.06-1.56-.1-.36-.1-.83-.27-1.42-.53-2.5-1.08-4.13-3.6-4.25-3.77-.12-.16-1.02-1.35-1.02-2.58s.65-1.83.88-2.08c.23-.25.5-.31.67-.31h.48c.15 0 .36-.06.56.43.21.5.72 1.73.78 1.86.06.12.1.27.02.43-.08.16-.12.26-.25.4-.12.15-.26.32-.37.43-.12.12-.25.25-.11.5.14.25.62 1.02 1.33 1.66.91.81 1.68 1.06 1.93 1.18.25.12.39.1.54-.06.15-.16.62-.72.79-.97.16-.25.33-.21.56-.12.23.08 1.47.69 1.72.81.25.12.42.19.48.29.06.1.06.6-.15 1.18z"></path></svg></span></a>
          <a data-footer-social-index="3" href="https://asociacionwawanakan-eng.github.io/asociaci-nwawanakan/" target="_blank" rel="noopener noreferrer" aria-label="Otro enlace de Wawanakan"><span aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zm6.98 8.5h-3.05a14.4 14.4 0 0 0-1.05-5.02A7.55 7.55 0 0 1 18.98 11zM12 4.42c.72.98 1.55 3.02 1.76 6.58h-3.52C10.45 7.44 11.28 5.4 12 4.42zM4.95 13h3.12c.12 2.05.49 3.86 1.05 5.02A7.55 7.55 0 0 1 4.95 13zm3.12-2H4.95a7.55 7.55 0 0 1 4.17-5.02A14.4 14.4 0 0 0 8.07 11zM12 19.58c-.72-.98-1.55-3.02-1.76-6.58h3.52c-.21 3.56-1.04 5.6-1.76 6.58zm2.88-1.56c.56-1.16.93-2.97 1.05-5.02h3.12a7.55 7.55 0 0 1-4.17 5.02z"></path></svg></span></a>
        </div>
      </section>
      <section class="footer-info-block">
        <h2 data-cms-text="footer.visitanosTitulo">VISÍTANOS</h2>
        <p data-cms-text="footer.visitanos1">Calle 6, Villa Dolores</p>
        <p data-cms-text="footer.visitanos2">El Alto, La Paz - Bolivia</p>
      </section>
      <section class="footer-info-block">
        <h2 data-cms-text="footer.contactoTitulo">COMUNÍCATE CON NOSOTROS</h2>
        <p><a data-cms-href="footer.whatsappLink" href="https://wa.me/59179164334" target="_blank" rel="noopener noreferrer">WhatsApp: <span data-cms-text="footer.whatsappTexto">(+591) 79164334</span></a></p>
        <p>Correo electrónico: <a href="mailto:presidencia.wawanakan@gmail.com" data-cms-text="footer.email" data-footer-email>presidencia.wawanakan@gmail.com</a></p>
      </section>
    </div>
    <div class="footer-bottom">
      <p data-cms-text="footer.credito">Asociación Wawanakan Kusisiñapa | Desde 2008 – 2026 | 18 años al servicio de la niñez</p>
      <p data-cms-text="footer.copyright">© 2026. Todos los derechos reservados.</p>
    </div>
  `;

  function renderHeader(activePage) {
    const headerEl = document.getElementById("site-header");
    if (!headerEl) return;
    headerEl.innerHTML = NAV_HTML;

    if (activePage) {
      const link = headerEl.querySelector(`a[href="${activePage}"]`);
      if (link) link.classList.add("active");
    }
  }

  function renderFooter() {
    const footerEl = document.querySelector(".site-footer");
    if (!footerEl) return;
    footerEl.setAttribute("aria-label", "Pie de página institucional");
    footerEl.innerHTML = FOOTER_HTML;
  }

  window.WawaComponents = { renderHeader, renderFooter };
})();
