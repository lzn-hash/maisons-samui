/* Latitude Samui — interactions réutilisables des pages villas. */
(function () {
  'use strict';

  var gallery = Array.prototype.slice.call(document.querySelectorAll('[data-gallery-src]')).map(function (item) {
    return { src: item.dataset.gallerySrc, caption: item.dataset.galleryCaption || '' };
  });
  var lightbox = document.getElementById('villaLightbox');
  var lightboxImage = document.getElementById('lightboxImage');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxCount = document.getElementById('lightboxCount');
  var lightboxClose = document.getElementById('lightboxClose');
  var currentImage = 0;
  var lastFocus = null;

  function renderGallery(index) {
    if (!gallery.length) return;
    currentImage = (index + gallery.length) % gallery.length;
    lightboxImage.src = gallery[currentImage].src;
    lightboxImage.alt = gallery[currentImage].caption;
    lightboxCaption.textContent = gallery[currentImage].caption;
    lightboxCount.textContent = String(currentImage + 1).padStart(2, '0') + ' / ' + String(gallery.length).padStart(2, '0');
  }

  function openGallery(index) {
    if (!lightbox || !gallery.length) return;
    lastFocus = document.activeElement;
    renderGallery(Number(index) || 0);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('gallery-open');
    lightboxClose.focus();
  }

  function closeGallery() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gallery-open');
    lightboxImage.removeAttribute('src');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  document.querySelectorAll('[data-gallery-index]').forEach(function (button) {
    button.addEventListener('click', function () { openGallery(button.dataset.galleryIndex); });
  });
  var openAll = document.getElementById('openAllPhotos');
  if (openAll) openAll.addEventListener('click', function () { openGallery(0); });
  var prev = document.getElementById('lightboxPrev');
  var next = document.getElementById('lightboxNext');
  if (prev) prev.addEventListener('click', function () { renderGallery(currentImage - 1); });
  if (next) next.addEventListener('click', function () { renderGallery(currentImage + 1); });
  if (lightboxClose) lightboxClose.addEventListener('click', closeGallery);
  if (lightbox) lightbox.addEventListener('click', function (event) { if (event.target === lightbox) closeGallery(); });

  document.addEventListener('keydown', function (event) {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') closeGallery();
    if (event.key === 'ArrowLeft') renderGallery(currentImage - 1);
    if (event.key === 'ArrowRight') renderGallery(currentImage + 1);
  });

  var configuration = { interior: 'Carte Blanche', garden: 'Carte Blanche', touched: false };

  function updateSummary() {
    var label = document.getElementById('configurationLabel');
    if (label) label.textContent = configuration.interior + ' · ' + configuration.garden;
  }

  document.querySelectorAll('.config-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var group = card.dataset.configGroup;
      if (!group) return;
      document.querySelectorAll('.config-card[data-config-group="' + group + '"]').forEach(function (other) {
        other.classList.remove('selected');
        other.setAttribute('aria-pressed', 'false');
      });
      card.classList.add('selected');
      card.setAttribute('aria-pressed', 'true');
      configuration[group] = card.dataset.configValue;
      configuration.touched = true;
      updateSummary();
    });
  });

  window.getPersoSummary = function () {
    return {
      interior: configuration.interior,
      garden: configuration.garden,
      touched: configuration.touched
    };
  };

  document.querySelectorAll('[data-contact-intent]').forEach(function (button) {
    button.addEventListener('click', function () {
      var intent = button.dataset.contactIntent || 'contact';
      var options = {
        intent: intent,
        source: button.dataset.contactSource || 'villa-page',
        villa: window.VILLA_NAME || 'Baan Sawan'
      };
      if (intent === 'estimate') options.configuration = window.getPersoSummary();
      window.openContactModal(options);
    });
  });
})();
