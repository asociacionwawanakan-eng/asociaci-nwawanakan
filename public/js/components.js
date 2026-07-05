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
        <img class="footer-logo" src="assets/institucional/logotipo.png" alt="Logotipo Wawanakan">
        <p>Síguenos en nuestras redes:</p>
        <div class="footer-socials">
          <a data-cms-href="config.facebookLink" href="https://www.facebook.com/profile.php?id=61590971327508&amp;locale=es_LA" target="_blank" rel="noopener noreferrer" aria-label="Facebook de Wawanakan"><span aria-hidden="true">f</span></a>
          <a data-cms-href="config.tiktokLink" href="https://www.tiktok.com/@asociacionwawanakan?is_from_webapp=1&amp;sender_device=pc" target="_blank" rel="noopener noreferrer" aria-label="TikTok de Wawanakan"><span aria-hidden="true">♪</span></a>
          <a data-cms-href="config.websiteLink" href="https://asociacionwawanakan-eng.github.io/asociaci-nwawanakan/" target="_blank" rel="noopener noreferrer" aria-label="Página web de Wawanakan"><span aria-hidden="true">W</span></a>
          <a data-cms-href="config.whatsappLink" href="https://wa.me/59179164334" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp de Wawanakan"><span aria-hidden="true">✆</span></a>
        </div>
      </section>
      <section class="footer-info-block">
        <h2>VISÍTANOS</h2>
        <p data-cms-text="footer.visitanos1">Calle 6, Villa Dolores</p>
        <p data-cms-text="footer.visitanos2">El Alto, La Paz - Bolivia</p>
      </section>
      <section class="footer-info-block">
        <h2>COMUNÍCATE CON NOSOTROS</h2>
        <p><a data-cms-href="config.whatsappLink" href="https://wa.me/59179164334" target="_blank" rel="noopener noreferrer">WhatsApp: <span data-cms-text="config.whatsappTexto">(+591) 79164334</span></a></p>
        <p>Correo electrónico: <a href="mailto:presidencia.wawanakan@gmail.com" data-cms-text="config.email">presidencia.wawanakan@gmail.com</a></p>
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
