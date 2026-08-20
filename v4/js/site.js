/* Latitude Samui — comportements partagés : navigation, reveals, hero et thème Live Chat Odoo. */
(function () {
  'use strict';

  function track(eventName, details) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: eventName }, details || {}));
  }

  function initNavigation() {
    var nav = document.getElementById('nav');
    var burger = document.getElementById('burger');
    if (!nav || !burger) return;

    function closeMenu() {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Ouvrir le menu');
    }

    function onScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 24);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });

    nav.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
        burger.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  function initReveals() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (element) { element.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(function (element) { observer.observe(element); });
  }

  function initHero() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var slides = Array.prototype.slice.call(hero.querySelectorAll('.slide'));
    var indicators = Array.prototype.slice.call(hero.querySelectorAll('.indicator'));
    var pauseButton = hero.querySelector('.hero-pause');
    if (slides.length < 2 || !pauseButton) return;

    var current = Math.max(0, slides.findIndex(function (slide) { return slide.classList.contains('active'); }));
    var duration = Number(hero.dataset.duration) || 6500;
    var remaining = duration;
    var cycleStartedAt = 0;
    var timer = null;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var userPaused = reducedMotion;
    var touchStartX = null;

    function loadSlide(index) {
      var slide = slides[(index + slides.length) % slides.length];
      var image = slide && slide.querySelector('img[data-src]');
      if (!image) return;
      image.src = image.dataset.src;
      image.removeAttribute('data-src');
    }

    function restartIndicator(index) {
      indicators.forEach(function (indicator) { indicator.classList.remove('active'); });
      if (!indicators[index]) return;
      void indicators[index].offsetWidth;
      indicators[index].classList.add('active');
    }

    function show(index, source) {
      var next = (index + slides.length) % slides.length;
      loadSlide(next);
      slides[current].classList.remove('active');
      current = next;
      slides[current].classList.add('active');
      remaining = duration;
      restartIndicator(current);
      loadSlide(current + 1);
      if (source) track('hero_slide_change', { slide_index: current + 1, interaction: source });
    }

    function schedule(delay) {
      window.clearTimeout(timer);
      remaining = Math.max(80, delay || duration);
      if (userPaused || document.hidden) return;
      cycleStartedAt = Date.now();
      timer = window.setTimeout(function () {
        show(current + 1, 'automatic');
        schedule(duration);
      }, remaining);
    }

    function renderPauseState() {
      hero.classList.toggle('paused', userPaused);
      pauseButton.setAttribute('aria-pressed', String(userPaused));
      pauseButton.setAttribute('aria-label', userPaused ? 'Relancer le diaporama' : 'Mettre le diaporama en pause');
    }

    function setPaused(next) {
      if (next === userPaused) return;
      if (next) {
        var elapsed = cycleStartedAt ? Date.now() - cycleStartedAt : 0;
        remaining = Math.max(80, remaining - elapsed);
        window.clearTimeout(timer);
      }
      userPaused = next;
      renderPauseState();
      if (!userPaused) schedule(remaining);
      track('hero_pause_toggle', { paused: userPaused });
    }

    function manuallyShow(index, source) {
      show(index, source);
      if (!userPaused) schedule(duration);
    }

    indicators.forEach(function (indicator, index) {
      indicator.addEventListener('click', function () { manuallyShow(index, 'indicator'); });
    });
    pauseButton.addEventListener('click', function () { setPaused(!userPaused); });

    hero.addEventListener('touchstart', function (event) {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    hero.addEventListener('touchend', function (event) {
      if (touchStartX === null) return;
      var delta = event.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(delta) < 48) return;
      manuallyShow(current + (delta < 0 ? 1 : -1), 'swipe');
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        var elapsed = cycleStartedAt ? Date.now() - cycleStartedAt : 0;
        remaining = Math.max(80, remaining - elapsed);
        window.clearTimeout(timer);
      } else if (!userPaused) {
        schedule(remaining);
      }
    });

    renderPauseState();
    loadSlide(current + 1);
    if (!userPaused) schedule(duration);
  }

  function initLiveChatStyling() {
    var themeId = 'latitude-livechat-theme';
    var theme = `
      :host {
        --latitude-livechat-ink: #1a1e1a;
        --latitude-livechat-cream: #fffdf9;
        --latitude-livechat-jungle: #1a2e22;
      }

      .o-livechat-LivechatButton {
        width: 62px !important;
        height: 62px !important;
        box-shadow: 0 12px 34px rgba(9, 17, 12, .24) !important;
        transition: filter .3s ease, transform .25s ease, box-shadow .25s ease !important;
      }

      .o-livechat-LivechatButton:hover {
        transform: translateY(-2px) scale(1.025);
        box-shadow: 0 16px 38px rgba(9, 17, 12, .3) !important;
      }

      .o-livechat-LivechatButton > i {
        font-size: 25px !important;
      }

      .o-livechat-LivechatButton-notification {
        top: 50% !important;
        right: calc(100% + 14px) !important;
        bottom: auto !important;
        transform: translateY(-50%);
        padding: 12px 17px !important;
        border: 1px solid rgba(26, 30, 26, .1);
        border-radius: 999px !important;
        background: var(--latitude-livechat-cream) !important;
        box-shadow: 0 10px 30px rgba(9, 17, 12, .15) !important;
      }

      .o-livechat-LivechatButton-notification p {
        color: var(--latitude-livechat-ink) !important;
        font-family: "Manrope", system-ui, sans-serif !important;
        font-size: 10px !important;
        font-weight: 600 !important;
        line-height: 1.15 !important;
        letter-spacing: .12em;
        text-transform: uppercase;
      }

      .o-livechat-LivechatButton-animate {
        animation: latitude-livechat-notification-in .5s cubic-bezier(.2, .75, .25, 1) forwards !important;
      }

      @keyframes latitude-livechat-notification-in {
        0% { opacity: 0; transform: translateY(-50%) scale(.72); }
        65% { opacity: 1; transform: translateY(-50%) scale(1.035); }
        100% { opacity: 1; transform: translateY(-50%) scale(1); }
      }

      @media (min-width: 641px) {
        .o-mail-ChatWindow:not(.o-mobile) {
          width: 440px !important;
          height: min(88vh, 680px) !important;
          border-radius: 14px !important;
          box-shadow: 0 20px 55px rgba(9, 17, 12, .22) !important;
        }
      }

      @media (max-width: 640px) {
        .o-livechat-LivechatButton {
          width: 56px !important;
          height: 56px !important;
        }

        .o-livechat-LivechatButton-notification {
          display: none !important;
        }
      }
    `;

    function styleRoot(root) {
      if (!root || !root.shadowRoot || root.shadowRoot.getElementById(themeId)) return;
      var style = document.createElement('style');
      style.id = themeId;
      style.textContent = theme;
      root.shadowRoot.appendChild(style);
    }

    function scan() {
      document.querySelectorAll('.o-livechat-root').forEach(styleRoot);
    }

    scan();
    var observer = new MutationObserver(scan);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(function () { observer.disconnect(); }, 30000);
  }

  initNavigation();
  initReveals();
  initHero();
  initLiveChatStyling();
})();
