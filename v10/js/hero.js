(() => {
'use strict';
function track() {}
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
      pauseButton.setAttribute('aria-label', document.documentElement.lang==='en'?(userPaused?'Resume slideshow':'Pause slideshow'):(userPaused?'Relancer le diaporama':'Mettre le diaporama en pause'));
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


initHero();
})();
