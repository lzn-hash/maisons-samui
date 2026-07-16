/* ============================================================
   LATITUDE SAMUI — Navigation unifiée
   Une seule source de vérité pour toutes les pages.
   Usage : <div id="site-nav"></div> + <script src="nav.js"></script>
   ============================================================ */
(function () {
  // Détection : sommes-nous sur l'index ? (ancres directes vs index.html#)
  var path = window.location.pathname;
  var isIndex = /\/$|index\.html$/.test(path);
  var H = isIndex ? '' : 'index.html';

  var VILLAS = [
    { href: 'villa-baansawan.html', name: 'Baan <em>Sawan</em>', sub: "L'exception · Vue mer 360°" },
    { href: 'villa-sabai.html',     name: 'Villa <em>Sabai</em>', sub: 'Lamai N°I · Sud / jardin' },
    { href: 'villa-suk.html',       name: 'Villa <em>Suk</em>',   sub: 'Lamai N°II · Est / lever de soleil' },
    { href: 'villa-jai.html',       name: 'Villa <em>Jai</em>',   sub: 'Lamai N°III · Ouest / coucher de soleil' }
  ];

  var css = ''
  + 'nav.sn{position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;'
  + 'padding:0.55rem 2rem;background:rgba(255,255,255,0.06);backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);'
  + 'border-bottom:1px solid rgba(255,255,255,0.12);transition:background 0.4s ease, border-color 0.4s ease;}'
  + 'nav.sn.scrolled{background:rgba(26,30,26,0.92);border-bottom-color:rgba(201,160,88,0.15);}'
  + '.sn-logo{display:inline-flex;align-items:center;text-decoration:none;transition:opacity .3s;}'
  + '.sn-logo:hover{opacity:.85;}'
  + '.sn-logo img{height:48px;width:auto;display:block;}'
  + '.sn-links{display:flex;gap:2.2rem;align-items:center;list-style:none;margin:0;padding:0;}'
  + '.sn-links>li{position:relative;}'
  + '.sn-links a{font-family:Inter,sans-serif;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;'
  + 'color:rgba(250,247,240,.85);text-decoration:none;transition:color .3s;cursor:pointer;}'
  + '.sn-links a:hover{color:#d4a945;}'
  + '.sn-cta{background:#b8623f;color:#faf7f0!important;padding:.65rem 1.2rem;transition:background .3s!important;}'
  + '.sn-cta:hover{background:#a4552f;color:#faf7f0!important;}'
  /* dropdown */
  + '.sn-dd-toggle{display:inline-flex;align-items:center;gap:.4rem;}'
  + '.sn-dd-toggle svg{width:10px;height:10px;transition:transform .3s;}'
  + '.sn-dd:hover .sn-dd-toggle svg{transform:rotate(180deg);}'
  + '.sn-dd-panel{position:absolute;top:calc(100% + 30px);left:50%;transform:translateX(-50%) translateY(6px);min-width:290px;'
  + 'background:#14241b;border:1px solid rgba(201,160,88,0.25);padding:.6rem 0;opacity:0;visibility:hidden;'
  + 'transition:all .25s ease;box-shadow:0 18px 50px rgba(0,0,0,.45);}'
  + '.sn-dd:hover .sn-dd-panel,.sn-dd:focus-within .sn-dd-panel{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0);}'
  + '.sn-dd-panel::before{content:"";position:absolute;top:-34px;left:0;right:0;height:34px;}'
  + '.sn-dd-panel a{display:block;padding:.75rem 1.4rem;text-transform:none;letter-spacing:.02em;}'
  + '.sn-dd-panel a:hover{background:rgba(201,160,88,0.08);}'
  + '.sn-dd-name{display:block;font-family:"Cormorant Garamond",serif;font-size:1.15rem;color:#faf7f0;line-height:1.2;}'
  + '.sn-dd-name em{font-style:italic;color:#d4a945;}'
  + '.sn-dd-sub{display:block;font-family:Inter,sans-serif;font-size:.62rem;letter-spacing:.08em;color:rgba(250,247,240,.5);margin-top:.15rem;text-transform:uppercase;}'
  /* burger */
  + '.sn-burger{display:none;background:none;border:none;cursor:pointer;color:#faf7f0;padding:.4rem;}'
  + '.sn-burger svg{width:26px;height:26px;display:block;}'
  /* panneau mobile */
  + '.sn-mobile{position:fixed;inset:0;z-index:1100;background:#14241b;padding:1.2rem 1.6rem 2.4rem;'
  + 'transform:translateX(100%);transition:transform .35s cubic-bezier(.22,1,.36,1);overflow-y:auto;display:flex;flex-direction:column;}'
  + '.sn-mobile.open{transform:translateX(0);}'
  + '.sn-mobile-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:2.2rem;}'
  + '.sn-mobile-head img{height:40px;width:auto;}'
  + '.sn-close{background:none;border:none;color:#faf7f0;cursor:pointer;padding:.4rem;}'
  + '.sn-close svg{width:26px;height:26px;display:block;}'
  + '.sn-mobile a{text-decoration:none;}'
  + '.sn-m-link{display:block;font-family:"Cormorant Garamond",serif;font-size:1.7rem;font-weight:500;color:#faf7f0;'
  + 'padding:.75rem 0;border-bottom:1px solid rgba(201,160,88,0.14);}'
  + '.sn-m-group{padding:.9rem 0 .4rem;border-bottom:1px solid rgba(201,160,88,0.14);}'
  + '.sn-m-group-label{font-family:Inter,sans-serif;font-size:.66rem;letter-spacing:.3em;text-transform:uppercase;color:#d4a945;margin-bottom:.5rem;}'
  + '.sn-m-villa{display:block;padding:.55rem 0 .55rem .9rem;}'
  + '.sn-m-villa .sn-dd-name{font-size:1.35rem;}'
  + '.sn-mobile .sn-m-cta{display:block;text-align:center;background:#b8623f;color:#faf7f0;font-family:Inter,sans-serif;'
  + 'font-size:.78rem;letter-spacing:.18em;text-transform:uppercase;font-weight:500;padding:1rem;margin-top:2rem;border:none;cursor:pointer;width:100%;}'
  + '@media (max-width:900px){.sn-links{display:none;}.sn-burger{display:block;}nav.sn{padding:.5rem 1.1rem;}.sn-logo img{height:38px;}}'
  /* offset pour ancres sous nav fixe */
  + 'section[id]{scroll-margin-top:84px;}';

  var chevron = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';

  function villaLinks(cls) {
    return VILLAS.map(function (v) {
      return '<a href="' + v.href + '" class="' + cls + '">'
        + '<span class="sn-dd-name">' + v.name + '</span>'
        + '<span class="sn-dd-sub">' + v.sub + '</span></a>';
    }).join('');
  }

  var navHtml = ''
  + '<nav class="sn" aria-label="Navigation principale">'
  +   '<a href="' + (isIndex ? '#' : 'index.html') + '" class="sn-logo">'
  +     '<img src="assets/logo-horizontal.svg" alt="Latitude Samui — Luxury Homes Koh Samui" /></a>'
  +   '<ul class="sn-links">'
  +     '<li class="sn-dd"><a href="' + H + '#villas" class="sn-dd-toggle">Les Villas ' + chevron + '</a>'
  +       '<div class="sn-dd-panel">' + villaLinks('') + '</div></li>'
  +     '<li><a href="' + H + '#histoire">Histoire</a></li>'
  +     '<li><a href="' + H + '#parcours">Étapes</a></li>'
  +     '<li><a href="boutique.html">Boutique</a></li>'
  +     '<li><a href="faq.html">FAQ</a></li>'
  +     '<li><a href="' + H + '#contact">Contact</a></li>'
  +     '<li><a class="sn-cta" onclick="openContactModal()">Prendre rendez-vous</a></li>'
  +   '</ul>'
  +   '<button class="sn-burger" onclick="snOpenMobile()" aria-label="Ouvrir le menu">'
  +     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">'
  +     '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>'
  +   '</button>'
  + '</nav>'
  + '<div class="sn-mobile" id="snMobile" aria-hidden="true">'
  +   '<div class="sn-mobile-head">'
  +     '<img src="assets/logo-horizontal.svg" alt="Latitude Samui" />'
  +     '<button class="sn-close" onclick="snCloseMobile()" aria-label="Fermer le menu">'
  +       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">'
  +       '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>'
  +   '</div>'
  +   '<div class="sn-m-group">'
  +     '<div class="sn-m-group-label">Les Villas</div>' + villaLinks('sn-m-villa')
  +   '</div>'
  +   '<a href="' + H + '#histoire" class="sn-m-link">Histoire</a>'
  +   '<a href="' + H + '#parcours" class="sn-m-link">Étapes</a>'
  +   '<a href="boutique.html" class="sn-m-link">Boutique</a>'
  +   '<a href="faq.html" class="sn-m-link">FAQ</a>'
  +   '<a href="' + H + '#contact" class="sn-m-link">Contact</a>'
  +   '<button class="sn-m-cta" onclick="snCloseMobile();openContactModal()">Prendre rendez-vous</button>'
  + '</div>';

  // Injection
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var mount = document.getElementById('site-nav');
  if (mount) {
    mount.innerHTML = navHtml;
  } else {
    document.body.insertAdjacentHTML('afterbegin', navHtml);
  }

  // Transparence au scroll : nav transparente sur le hero, ink sobre après défilement
  var navEl = document.querySelector('nav.sn');
  function onScroll() {
    if (window.scrollY > 180) navEl.classList.add('scrolled');
    else navEl.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // état initial correct au chargement (utile si on arrive déjà scrollé)

  // API mobile
  window.snOpenMobile = function () {
    document.getElementById('snMobile').classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.snCloseMobile = function () {
    document.getElementById('snMobile').classList.remove('open');
    document.body.style.overflow = '';
  };
  // fermer le panneau quand on clique un lien (ancres même page)
  document.querySelectorAll('#snMobile a').forEach(function (a) {
    a.addEventListener('click', function () { window.snCloseMobile(); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.snCloseMobile();
  });
})();
