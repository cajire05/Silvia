(() => {
  'use strict';

  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('[data-nav]');
  const navToggle = document.querySelector('[data-nav-toggle]');

  const setMenuState = (isOpen) => {
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    nav.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
  };

  navToggle.addEventListener('click', () => setMenuState(navToggle.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenuState(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenuState(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) setMenuState(false); });

  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const sectionLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')].filter((link) => !link.classList.contains('button'));
  const observedSections = sectionLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => {
          const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', isCurrent);
          if (isCurrent) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  const form = document.querySelector('[data-contact-form]');
  const formStatus = document.querySelector('[data-form-status]');
  const requiredFields = [...form.querySelectorAll('[required]')];
  const messages = { name: 'Ingresa tu nombre.', company: 'Ingresa el nombre de tu empresa.', email: 'Ingresa un correo válido.', phone: 'Ingresa un teléfono de contacto.', message: 'Cuéntanos brevemente sobre tu negocio.' };

  const validateField = (field) => {
    const value = field.value.trim();
    const isValid = value !== '' && (field.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
    const error = form.querySelector(`[data-error-for="${field.name}"]`);
    field.setAttribute('aria-invalid', String(!isValid));
    error.textContent = isValid ? '' : messages[field.name];
    return isValid;
  };

  requiredFields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validateField(field); });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    formStatus.className = 'form-status';
    const validFields = requiredFields.map(validateField);
    const firstInvalidIndex = validFields.findIndex((isValid) => !isValid);
    if (firstInvalidIndex !== -1) {
      formStatus.textContent = 'Revisa los campos señalados antes de continuar.';
      formStatus.classList.add('is-visible', 'is-error');
      requiredFields[firstInvalidIndex].focus();
      return;
    }

    // TODO: Replace this placeholder with Formspree, EmailJS or a serverless endpoint.
    formStatus.textContent = '¡Gracias por tu interés! El canal de solicitudes estará habilitado próximamente; tus datos no fueron enviados.';
    formStatus.classList.add('is-visible', 'is-success');
    formStatus.focus();
  });

  document.querySelector('[data-current-year]').textContent = new Date().getFullYear();
})();
