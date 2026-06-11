(() => {
  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImg = document.querySelector('[data-lightbox-img]');
  const closeBtn = document.querySelector('[data-lightbox-close]');
  let lastModalTrigger = null;
  let lastLightboxTrigger = null;

  const getFocusable = (scope) => Array.from(scope.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  )).filter((el) => !el.hasAttribute('hidden'));

  const setExpanded = (trigger, value) => {
    if (trigger && trigger.hasAttribute('aria-expanded')) {
      trigger.setAttribute('aria-expanded', value ? 'true' : 'false');
    }
  };

  const closeAllModals = ({ returnFocus = true } = {}) => {
    document.querySelectorAll('.memory-modal.is-open').forEach((modal) => {
      modal.classList.remove('is-open');
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
    });
    document.documentElement.classList.remove('has-memory-modal');
    setExpanded(lastModalTrigger, false);
    if (returnFocus && lastModalTrigger) {
      lastModalTrigger.focus({ preventScroll: true });
    }
    lastModalTrigger = null;
  };

  const openModal = (id, trigger) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    closeAllModals({ returnFocus: false });
    lastModalTrigger = trigger || null;
    setExpanded(lastModalTrigger, true);
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
    document.documentElement.classList.add('has-memory-modal');

    const close = modal.querySelector('[data-modal-close]');
    const heading = modal.querySelector('h2, h3, [tabindex="-1"]');
    const focusTarget = close || heading || getFocusable(modal)[0] || modal;
    if (focusTarget === heading && !focusTarget.hasAttribute('tabindex')) {
      focusTarget.setAttribute('tabindex', '-1');
    }
    focusTarget.focus({ preventScroll: true });
  };

  const openLightbox = (clickedCard) => {
    if (!lightbox || !lightboxImg) return;
    const fullImageSrc = clickedCard.getAttribute('data-full');
    const thumbnailAlt = clickedCard.querySelector('img')?.getAttribute('alt') || '';
    const captionText = clickedCard.querySelector('figcaption')?.textContent?.replace(/\s+/g, ' ').trim() || '';
    const finalAlt = thumbnailAlt || captionText || 'תמונה מוגדלת';
    if (!fullImageSrc) return;

    lastLightboxTrigger = clickedCard;
    lightboxImg.setAttribute('src', fullImageSrc);
    lightboxImg.setAttribute('alt', finalAlt);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('has-lightbox');
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  };

  const closeLightbox = ({ returnFocus = true } = {}) => {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('has-lightbox');
    lightboxImg.removeAttribute('src');
    if (returnFocus && lastLightboxTrigger && typeof lastLightboxTrigger.focus === 'function') {
      lastLightboxTrigger.focus({ preventScroll: true });
    }
    lastLightboxTrigger = null;
  };

  document.addEventListener('click', (event) => {
    const modalTrigger = event.target.closest('[data-modal-target]');
    if (modalTrigger) {
      event.preventDefault();
      openModal(modalTrigger.getAttribute('data-modal-target'), modalTrigger);
      return;
    }

    const modalClose = event.target.closest('[data-modal-close]');
    if (modalClose) {
      closeAllModals();
      return;
    }

    const clickedCard = event.target.closest('[data-full]');
    if (clickedCard) {
      event.preventDefault();
      openLightbox(clickedCard);
    }
  });

  document.querySelectorAll('.memory-modal').forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeAllModals();
    });

    modal.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const focusable = getFocusable(modal);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeLightbox());
  }

  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (lightbox && lightbox.classList.contains('is-open')) {
      closeLightbox();
      return;
    }
    closeAllModals();
  });
})();
