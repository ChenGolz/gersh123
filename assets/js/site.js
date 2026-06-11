(() => {
  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImg = document.querySelector('[data-lightbox-img]');
  const closeBtn = document.querySelector('[data-lightbox-close]');

  const closeAllModals = () => {
    document.querySelectorAll('.memory-modal.is-open').forEach((modal) => {
      modal.classList.remove('is-open');
      modal.hidden = true;
    });
    document.documentElement.classList.remove('has-memory-modal');
  };

  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = false;
    modal.classList.add('is-open');
    document.documentElement.classList.add('has-memory-modal');
    const close = modal.querySelector('[data-modal-close]');
    if (close) close.focus({ preventScroll: true });
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove('is-open');
    document.documentElement.classList.remove('has-lightbox');
    lightboxImg.removeAttribute('src');
  };

  document.addEventListener('click', (event) => {
    const modalTrigger = event.target.closest('[data-modal-target]');
    if (modalTrigger) {
      event.preventDefault();
      openModal(modalTrigger.getAttribute('data-modal-target'));
      return;
    }
    const closeTrigger = event.target.closest('[data-modal-close]');
    if (closeTrigger) {
      closeAllModals();
      return;
    }
    const openImage = event.target.closest('[data-full]');
    if (openImage && lightbox && lightboxImg) {
      const src = openImage.getAttribute('data-full');
      const img = openImage.querySelector('img');
      if (!src) return;
      lightboxImg.src = src;
      lightboxImg.alt = img ? img.alt : 'תמונה מוגדלת מתוך אלבום הזיכרון';
      lightbox.classList.add('is-open');
      document.documentElement.classList.add('has-lightbox');
      if (closeBtn) closeBtn.focus({ preventScroll: true });
    }
  });

  document.querySelectorAll('.memory-modal').forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeAllModals();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (lightbox && lightbox.classList.contains('is-open')) {
      closeLightbox();
      return;
    }
    closeAllModals();
  });
})();