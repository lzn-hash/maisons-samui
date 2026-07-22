/* ============================================================
   LATITUDE SAMUI — Navigation unifiée / Mobile v1
   Usage : <div id="site-nav"></div> + <script src="nav.js"></script>
   ============================================================ */
(function () {
  'use strict';

  var path = window.location.pathname;
  var fileName = (path.split('/').pop() || 'index.html').toLowerCase();
  var isIndex = /^(|index\.html)$/.test(fileName);
  var H = isIndex ? '' : 'index.html';

  var VILLAS = [
    { href: 'villa-baansawan.html', name: 'Baan <em>Sawan</em>', sub: "L'exception · Vue mer 360°" },
    { href: 'villa-sabai.html', name: 'Villa <em>Sabai</em>', sub: 'Lamai N°I · Sud / jardin' },
    { href: 'villa-suk.html', name: 'Villa <em>Suk</em>', sub: 'Lamai N°II · Est / lever de soleil' },
    { href: 'villa-jai.html', name: 'Villa <em>Jai</em>', sub: 'Lamai N°III · Ouest / coucher de soleil' }
  ];

  var css = `
    body.sn-menu-open{overflow:hidden;touch-action:none}
    nav.sn{position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;padding:.55rem 2rem;background:rgba(255,255,255,.06);backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);border-bottom:1px solid rgba(255,255,255,.12);transition:background .4s ease,border-color .4s ease,transform .35s ease}
    nav.sn.scrolled{background:rgba(26,30,26,.94);border-bottom-color:rgba(201,160,88,.15)}
    .sn-logo{display:inline-flex;align-items:center;text-decoration:none;transition:opacity .3s}
    .sn-logo:hover{opacity:.85}
    .sn-logo img{height:48px;width:auto;display:block}
    .sn-links{display:flex;gap:2.2rem;align-items:center;list-style:none;margin:0;padding:0}
    .sn-links>li{position:relative}
    .sn-links a{font-family:Inter,sans-serif;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:rgba(250,247,240,.85);text-decoration:none;transition:color .3s;cursor:pointer}
    .sn-links a:hover{color:#d4a945}
    .sn-cta{background:#b8623f;color:#faf7f0!important;padding:.65rem 1.2rem;transition:background .3s!important}
    .sn-cta:hover{background:#a4552f;color:#faf7f0!important}
    .sn-dd-toggle{display:inline-flex;align-items:center;gap:.4rem}
    .sn-dd-toggle svg{width:10px;height:10px;transition:transform .3s}
    .sn-dd:hover .sn-dd-toggle svg{transform:rotate(180deg)}
    .sn-dd-panel{position:absolute;top:calc(100% + 30px);left:50%;transform:translateX(-50%) translateY(6px);min-width:290px;background:#14241b;border:1px solid rgba(201,160,88,.25);padding:.6rem 0;opacity:0;visibility:hidden;transition:all .25s ease;box-shadow:0 18px 50px rgba(0,0,0,.45)}
    .sn-dd:hover .sn-dd-panel,.sn-dd:focus-within .sn-dd-panel{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0)}
    .sn-dd-panel::before{content:"";position:absolute;top:-34px;left:0;right:0;height:34px}
    .sn-dd-panel a{display:block;padding:.75rem 1.4rem;text-transform:none;letter-spacing:.02em}
    .sn-dd-panel a:hover{background:rgba(201,160,88,.08)}
    .sn-dd-name{display:block;font-family:"Cormorant Garamond",serif;font-size:1.15rem;color:#faf7f0;line-height:1.2}
    .sn-dd-name em{font-style:italic;color:#d4a945}
    .sn-dd-sub{display:block;font-family:Inter,sans-serif;font-size:.62rem;letter-spacing:.08em;color:rgba(250,247,240,.5);margin-top:.15rem;text-transform:uppercase}
    .sn-burger{display:none;width:44px;height:44px;align-items:center;justify-content:center;background:rgba(13,16,13,.18);border:1px solid rgba(250,247,240,.2);cursor:pointer;color:#faf7f0;padding:0}
    .sn-burger svg{width:24px;height:24px;display:block}
    .sn-mobile-backdrop{position:fixed;inset:0;z-index:1090;border:0;background:rgba(13,16,13,.58);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .3s ease,visibility .3s ease}
    .sn-mobile-backdrop.open{opacity:1;visibility:visible;pointer-events:auto}
    .sn-mobile{position:fixed;top:0;right:0;bottom:0;z-index:1100;width:min(90vw,410px);height:100vh;height:100dvh;background:#14241b;color:#faf7f0;transform:translateX(102%);transition:transform .38s cubic-bezier(.22,1,.36,1);display:flex;flex-direction:column;box-shadow:-24px 0 70px rgba(0,0,0,.35);padding:max(1rem,env(safe-area-inset-top)) 1.25rem max(1rem,env(safe-area-inset-bottom))}
    .sn-mobile.open{transform:translateX(0)}
    .sn-mobile-head{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding-bottom:1rem;border-bottom:1px solid rgba(201,160,88,.16);flex:0 0 auto}
    .sn-mobile-head img{height:38px;width:auto;display:block}
    .sn-close{width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:rgba(250,247,240,.04);border:1px solid rgba(250,247,240,.16);color:#faf7f0;cursor:pointer;padding:0}
    .sn-close svg{width:22px;height:22px;display:block}
    .sn-mobile-scroll{overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:1.2rem .1rem 1rem;scrollbar-width:none}
    .sn-mobile-scroll::-webkit-scrollbar{display:none}
    .sn-mobile a{text-decoration:none}
    .sn-m-primary{display:block;font-family:"Cormorant Garamond",serif;font-size:1.65rem;line-height:1.1;font-weight:500;color:#faf7f0;padding:.82rem 0;border-bottom:1px solid rgba(201,160,88,.13)}
    .sn-m-primary:active{color:#d4a945}
    .sn-m-villas-toggle{width:100%;display:flex;align-items:center;justify-content:space-between;gap:1rem;background:transparent;border:0;border-bottom:1px solid rgba(201,160,88,.13);padding:.82rem 0;color:#faf7f0;font-family:"Cormorant Garamond",serif;font-size:1.65rem;line-height:1.1;text-align:left;cursor:pointer}
    .sn-m-villas-toggle svg{width:18px;height:18px;color:#d4a945;transition:transform .3s ease}
    .sn-m-villas-toggle[aria-expanded="true"] svg{transform:rotate(180deg)}
    .sn-m-villas-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .35s ease;background:rgba(250,247,240,.025)}
    .sn-m-villas-panel.open{grid-template-rows:1fr}
    .sn-m-villas-inner{overflow:hidden}
    .sn-m-villa{position:relative;display:block;padding:.8rem .7rem .8rem 1rem;border-left:1px solid rgba(201,160,88,.24)}
    .sn-m-villa+.sn-m-villa{border-top:1px solid rgba(201,160,88,.08)}
    .sn-m-villa .sn-dd-name{font-size:1.28rem}
    .sn-m-villa .sn-dd-sub{font-size:.56rem;line-height:1.45}
    .sn-m-villa.current{background:rgba(201,160,88,.08);border-left:3px solid #d4a945;padding-left:calc(1rem - 2px)}
    .sn-m-villa.current::after{content:"En cours";position:absolute;right:.65rem;top:.9rem;font-family:Inter,sans-serif;font-size:.48rem;letter-spacing:.15em;text-transform:uppercase;color:#d4a945}
    .sn-mobile-foot{margin-top:auto;flex:0 0 auto;padding-top:.9rem;border-top:1px solid rgba(201,160,88,.16);background:#14241b}
    .sn-m-cta{width:100%;min-height:52px;display:flex;align-items:center;justify-content:center;gap:.7rem;background:#b8623f;color:#faf7f0;border:0;font-family:Inter,sans-serif;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;font-weight:600;padding:.9rem 1rem;cursor:pointer}
    .sn-m-cta svg{width:16px;height:16px}
    .sn-m-footnote{margin-top:.65rem;text-align:center;font-family:Inter,sans-serif;font-size:.62rem;line-height:1.5;color:rgba(250,247,240,.48)}
    section[id]{scroll-margin-top:84px}
    @media(max-width:900px){
      .sn-links{display:none}.sn-burger{display:flex}nav.sn{padding:max(.45rem,env(safe-area-inset-top)) 1rem .45rem}.sn-logo img{height:38px}section[id]{scroll-margin-top:68px}
    }
    @media(min-width:901px){.sn-mobile,.sn-mobile-backdrop{display:none!important}}
    @media(prefers-reduced-motion:reduce){.sn-mobile,.sn-mobile-backdrop,.sn-m-villas-panel,.sn-m-villas-toggle svg{transition:none}}
  `;

  var chevron = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
  var arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

  function villaLinks(cls) {
    return VILLAS.map(function (v) {
      var current = fileName === v.href.toLowerCase();
      return '<a href="' + v.href + '" class="' + cls + (current ? ' current' : '') + '"' + (current ? ' aria-current="page"' : '') + '>'
        + '<span class="sn-dd-name">' + v.name + '</span>'
        + '<span class="sn-dd-sub">' + v.sub + '</span></a>';
    }).join('');
  }

  var isVillaPage = VILLAS.some(function (v) { return fileName === v.href.toLowerCase(); });
  var navHtml = ''
    + '<nav class="sn" aria-label="Navigation principale">'
    +   '<a href="' + (isIndex ? '#' : 'index.html') + '" class="sn-logo">'
    +     '<img src="assets/logo-horizontal.svg" alt="Latitude Samui — Luxury Homes Koh Samui"></a>'
    +   '<ul class="sn-links">'
    +     '<li class="sn-dd"><a href="' + H + '#villas" class="sn-dd-toggle">Les Villas ' + chevron + '</a><div class="sn-dd-panel">' + villaLinks('') + '</div></li>'
    +     '<li><a href="' + H + '#histoire">Histoire</a></li>'
    +     '<li><a href="' + H + '#parcours">Étapes</a></li>'
    +     '<li><a href="boutique.html">Boutique</a></li>'
    +     '<li><a href="faq.html">FAQ</a></li>'
    +     '<li><a href="' + H + '#contact">Contact</a></li>'
    +     '<li><a class="sn-cta" role="button" onclick="openContactModal()">Nous contacter</a></li>'
    +   '</ul>'
    +   '<button class="sn-burger" id="snBurger" type="button" onclick="snOpenMobile()" aria-label="Ouvrir le menu" aria-controls="snMobile" aria-expanded="false">'
    +     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>'
    +   '</button>'
    + '</nav>'
    + '<button type="button" class="sn-mobile-backdrop" id="snBackdrop" onclick="snCloseMobile()" aria-label="Fermer le menu"></button>'
    + '<aside class="sn-mobile" id="snMobile" aria-hidden="true" aria-label="Menu mobile">'
    +   '<div class="sn-mobile-head"><a href="' + (isIndex ? '#' : 'index.html') + '"><img src="assets/logo-horizontal.svg" alt="Latitude Samui"></a>'
    +     '<button class="sn-close" id="snClose" type="button" onclick="snCloseMobile()" aria-label="Fermer le menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>'
    +   '<div class="sn-mobile-scroll">'
    +     '<button type="button" class="sn-m-villas-toggle" id="snVillasToggle" aria-expanded="' + (isVillaPage ? 'true' : 'false') + '" aria-controls="snVillasPanel" onclick="snToggleVillas()"><span>Les Villas</span>' + chevron + '</button>'
    +     '<div class="sn-m-villas-panel' + (isVillaPage ? ' open' : '') + '" id="snVillasPanel"><div class="sn-m-villas-inner">' + villaLinks('sn-m-villa') + '</div></div>'
    +     '<a href="' + H + '#histoire" class="sn-m-primary">Histoire</a>'
    +     '<a href="' + H + '#parcours" class="sn-m-primary">Étapes</a>'
    +     '<a href="boutique.html" class="sn-m-primary">Boutique</a>'
    +     '<a href="faq.html" class="sn-m-primary">FAQ</a>'
    +     '<a href="' + H + '#contact" class="sn-m-primary">Contact</a>'
    +   '</div>'
    +   '<div class="sn-mobile-foot"><button class="sn-m-cta" type="button" onclick="snCloseMobile();openContactModal()">Nous contacter ' + arrow + '</button><div class="sn-m-footnote">Un échange personnel, sans relance automatique.</div></div>'
    + '</aside>';

  var style = document.createElement('style');
  style.id = 'latitude-nav-styles';
  style.textContent = css;
  document.head.appendChild(style);

  var mount = document.getElementById('site-nav');
  if (mount) mount.innerHTML = navHtml;
  else document.body.insertAdjacentHTML('afterbegin', navHtml);

  var navEl = document.querySelector('nav.sn');
  var mobile = document.getElementById('snMobile');
  var backdrop = document.getElementById('snBackdrop');
  var burger = document.getElementById('snBurger');
  var closeButton = document.getElementById('snClose');
  var lastFocus = null;

  function onScroll() {
    navEl.classList.toggle('scrolled', window.scrollY > 120);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  window.snOpenMobile = function () {
    lastFocus = document.activeElement;
    mobile.classList.add('open');
    backdrop.classList.add('open');
    mobile.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('sn-menu-open');
    window.setTimeout(function () { closeButton.focus(); }, 40);
  };

  window.snCloseMobile = function () {
    if (!mobile.classList.contains('open')) return;
    mobile.classList.remove('open');
    backdrop.classList.remove('open');
    mobile.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('sn-menu-open');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  };

  window.snToggleVillas = function () {
    var toggle = document.getElementById('snVillasToggle');
    var panel = document.getElementById('snVillasPanel');
    var open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    panel.classList.toggle('open', !open);
  };

  mobile.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { window.snCloseMobile(); });
  });

  document.addEventListener('keydown', function (e) {
    if (!mobile.classList.contains('open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      window.snCloseMobile();
      return;
    }
    if (e.key === 'Tab') {
      var focusable = Array.prototype.slice.call(mobile.querySelectorAll('a[href],button:not([disabled])'));
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) window.snCloseMobile();
  });
})();
