(() => {
  'use strict';

  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('[data-nav]');
  const navToggle = document.querySelector('[data-nav-toggle]');

  const pixelDebug = new URLSearchParams(window.location.search).get('debug_pixel') === '1';
  const trackedEvents = new Set();
  const attributionKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];
  let attribution = {};

  try {
    attribution = JSON.parse(sessionStorage.getItem('silvia_attribution') || '{}');
    const urlParams = new URLSearchParams(window.location.search);
    attributionKeys.forEach((key) => {
      const value = urlParams.get(key);
      if (value) attribution[key] = value;
    });
    if (Object.keys(attribution).length) sessionStorage.setItem('silvia_attribution', JSON.stringify(attribution));
  } catch (_) {
    attribution = {};
  }

  const campaignParams = () => {
    const params = {};
    if (attribution.utm_source) params.source = attribution.utm_source;
    if (attribution.utm_campaign) params.campaign = attribution.utm_campaign;
    return params;
  };

  const sendPixelEvent = (method, name, params = {}) => {
    const eventParams = { ...params, ...campaignParams() };
    if (pixelDebug) console.info(`[Silvia Pixel] ${name}`, ...(Object.keys(eventParams).length ? [eventParams] : []));
    if (typeof window.fbq === 'function') window.fbq(method, name, ...(Object.keys(eventParams).length ? [eventParams] : []));
  };

  const trackOnce = (method, name, params) => {
    if (trackedEvents.has(name)) return;
    trackedEvents.add(name);
    sendPixelEvent(method, name, params);
  };

  const trackCustomOnce = (name, params) => trackOnce('trackCustom', name, params);

  // Call only after the form provider confirms a successful submission.
  window.trackLeadSuccess = function trackLeadSuccess() {
    trackOnce('track', 'Lead');
  };

  const timeMilestones = [
    { milliseconds: 10000, event: 'Silvia_10s' },
    { milliseconds: 30000, event: 'Silvia_30s' },
    { milliseconds: 60000, event: 'Silvia_60s' }
  ];
  let activeMilliseconds = 0;
  let visibleSince = document.visibilityState === 'visible' ? performance.now() : null;
  let milestoneTimer;

  const currentActiveTime = () => activeMilliseconds + (visibleSince === null ? 0 : performance.now() - visibleSince);
  const scheduleMilestone = () => {
    clearTimeout(milestoneTimer);
    if (document.visibilityState !== 'visible') return;
    const next = timeMilestones.find(({ event }) => !trackedEvents.has(event));
    if (!next) return;
    milestoneTimer = window.setTimeout(() => {
      trackCustomOnce(next.event);
      scheduleMilestone();
    }, Math.max(0, next.milliseconds - currentActiveTime()));
  };

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      visibleSince = performance.now();
      scheduleMilestone();
      return;
    }
    if (visibleSince !== null) activeMilliseconds += performance.now() - visibleSince;
    visibleSince = null;
    clearTimeout(milestoneTimer);
  });
  scheduleMilestone();

  const scrollMilestones = [25, 50, 75, 90];
  let scrollTicking = false;
  const checkScrollMilestones = () => {
    const pageHeight = document.documentElement.scrollHeight;
    const depth = pageHeight ? ((window.scrollY + window.innerHeight) / pageHeight) * 100 : 100;
    scrollMilestones.forEach((percent) => {
      if (depth >= percent) trackCustomOnce(`Scroll_${percent}`, { percent });
    });
    scrollTicking = false;
  };
  const requestScrollCheck = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(checkScrollMilestones);
  };
  window.addEventListener('scroll', requestScrollCheck, { passive: true });
  window.addEventListener('resize', requestScrollCheck);
  window.addEventListener('load', requestScrollCheck);
  requestScrollCheck();

  document.querySelectorAll('[data-track="demo"]').forEach((cta) => {
    cta.addEventListener('click', () => trackCustomOnce('Demo_Click', { location: cta.dataset.location }));
  });

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

  form.addEventListener('focusin', (event) => {
    if (event.target.matches('input, textarea, select')) trackCustomOnce('Form_Start');
  });

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

    trackCustomOnce('Form_Attempt');

    // TODO: Replace this placeholder with Formspree, EmailJS or a serverless endpoint.
    formStatus.textContent = '¡Gracias por tu interés! El canal de solicitudes estará habilitado próximamente; tus datos no fueron enviados.';
    formStatus.classList.add('is-visible', 'is-success');
    formStatus.focus();
  });

  document.querySelector('[data-current-year]').textContent = new Date().getFullYear();
})();
