(function () {
  'use strict';

  // ====== NAVIGATION : glass ou ink sombre ======
  // Bouton rond conservé à la demande. Le choix est mémorisé
  // dans localStorage et reste identique d'une page à l'autre.
  var NAV_DARK_TEST = true;

  var path = window.location.pathname;
  var fileName = (path.split('/').pop() || 'index.html').toLowerCase();
  var isIndex = /^(|index\.html)$/.test(fileName);
  var indexPrefix = isIndex ? '' : 'index.html';

  var VILLAS = [
    { href: 'villa-baansawan.html', name: 'Baan <em>Sawan</em>', contactName: 'Baan Sawan', sub: 'Lamai Heights · Vue mer panoramique' },
    { href: 'villa-sabai.html', name: 'Villa <em>Sabai</em>', contactName: 'Sabai', sub: 'Lamai · Orientation sud · Jardin tropical' },
    { href: 'villa-suk.html', name: 'Villa <em>Suk</em>', contactName: 'Suk', sub: 'Lamai · Orientation est · Lever du soleil' },
    { href: 'villa-jai.html', name: 'Villa <em>Jai</em>', contactName: 'Jai', sub: 'Lamai · Orientation ouest · Coucher du soleil' }
  ];

  var APPROACH = [
    { href: 'notre-approche.html#philosophie', name: 'Notre philosophie', sub: 'Une collection limitée et une relation directe' },
    { href: 'notre-approche.html#equipe', name: "L'équipe", sub: 'Stratégie, construction et technologie' },
    { href: 'notre-approche.html#methode', name: 'Notre méthode', sub: 'Du terrain à la remise des clés' }
  ];

  var css = `
    body.sn-menu-open{overflow:hidden;touch-action:none}
    nav.sn{position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;padding:.55rem 2rem;background:rgba(255,255,255,.06);backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);border-bottom:1px solid rgba(255,255,255,.12);transition:background .4s ease,border-color .4s ease}
    nav.sn.scrolled,body.page-light nav.sn{background:rgba(26,30,26,.95);border-bottom-color:rgba(201,160,88,.16)}
    nav.sn.sn-dark{background:rgba(26,30,26,.94);backdrop-filter:none;-webkit-backdrop-filter:none;border-bottom-color:rgba(201,160,88,.15)}
    .sn-test{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;border:1px solid rgba(250,247,240,.4);background:transparent;color:#faf7f0;cursor:pointer;padding:0;margin-left:1.2rem;transition:border-color .3s,transform .3s;flex-shrink:0}
    .sn-test:hover{border-color:#d4a945;transform:rotate(180deg)}
    .sn-test svg{width:15px;height:15px;display:block}

    .sn-logo{display:inline-flex;align-items:center;text-decoration:none;transition:opacity .3s}
    .sn-logo:hover{opacity:.85}.sn-logo img{height:48px;width:auto;display:block}
    .sn-links{display:flex;gap:1.7rem;align-items:center;list-style:none;margin:0 0 0 auto;padding:0}
    .sn-links>li{position:relative}
    .sn-link,.sn-dd-toggle{font-family:Inter,sans-serif;font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;color:rgba(250,247,240,.88);text-decoration:none;transition:color .3s;cursor:pointer;white-space:nowrap}
    .sn-link:hover,.sn-dd-toggle:hover,.sn-link[aria-current="page"]{color:#d4a945}
    .sn-cta{border:0;background:#b8623f;color:#faf7f0;padding:.72rem 1.2rem;font-family:Inter,sans-serif;font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;font-weight:600;cursor:pointer;transition:background .3s}
    .sn-cta:hover{background:#9f4f31}
    .sn-dd-toggle{display:inline-flex;align-items:center;gap:.35rem}
    .sn-dd-toggle svg{width:10px;height:10px;transition:transform .25s}
    .sn-dd:hover .sn-dd-toggle svg,.sn-dd:focus-within .sn-dd-toggle svg{transform:rotate(180deg)}
    .sn-dd-panel{position:absolute;top:calc(100% + 28px);left:50%;transform:translateX(-50%) translateY(6px);min-width:310px;background:#14241b;border:1px solid rgba(201,160,88,.25);padding:.55rem 0;opacity:0;visibility:hidden;transition:opacity .25s ease,transform .25s ease,visibility .25s;box-shadow:0 18px 50px rgba(0,0,0,.4)}
    .sn-dd:hover .sn-dd-panel,.sn-dd:focus-within .sn-dd-panel{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0)}
    .sn-dd-panel::before{content:"";position:absolute;top:-32px;left:0;right:0;height:32px}
    .sn-dd-panel a{display:block;padding:.76rem 1.35rem;text-decoration:none;transition:background .25s}
    .sn-dd-panel a:hover,.sn-dd-panel a:focus-visible{background:rgba(201,160,88,.08);outline:none}
    .sn-dd-name{display:block;font-family:"Cormorant Garamond",serif;font-size:1.14rem;color:#faf7f0;line-height:1.15}
    .sn-dd-name em{font-style:italic;color:#d4a945}
    .sn-dd-sub{display:block;font-family:Inter,sans-serif;font-size:.57rem;letter-spacing:.07em;color:rgba(250,247,240,.5);margin-top:.2rem;text-transform:uppercase;line-height:1.4}
    .sn-burger{display:none;width:44px;height:44px;align-items:center;justify-content:center;background:rgba(13,16,13,.2);border:1px solid rgba(250,247,240,.22);cursor:pointer;color:#faf7f0;padding:0}
    .sn-burger svg{width:24px;height:24px}
    .sn-mobile-backdrop{position:fixed;inset:0;z-index:1090;border:0;background:rgba(13,16,13,.58);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .3s,visibility .3s}
    .sn-mobile-backdrop.open{opacity:1;visibility:visible;pointer-events:auto}
    .sn-mobile{position:fixed;top:0;right:0;bottom:0;z-index:1100;width:min(90vw,410px);height:100dvh;background:#14241b;color:#faf7f0;transform:translateX(102%);transition:transform .38s cubic-bezier(.22,1,.36,1);display:flex;flex-direction:column;box-shadow:-24px 0 70px rgba(0,0,0,.35);padding:max(1rem,env(safe-area-inset-top)) 1.25rem max(1rem,env(safe-area-inset-bottom))}
    .sn-mobile.open{transform:translateX(0)}
    .sn-mobile-head{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding-bottom:1rem;border-bottom:1px solid rgba(201,160,88,.16)}
    .sn-mobile-head img{height:38px;width:auto}.sn-close{width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:rgba(250,247,240,.04);border:1px solid rgba(250,247,240,.16);color:#faf7f0;cursor:pointer}
    .sn-close svg{width:22px;height:22px}
    .sn-mobile-scroll{overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:1.1rem .1rem 1rem;scrollbar-width:none}
    .sn-mobile-scroll::-webkit-scrollbar{display:none}
    .sn-m-primary{display:block;font-family:"Cormorant Garamond",serif;font-size:1.58rem;line-height:1.1;font-weight:500;color:#faf7f0;padding:.8rem 0;border-bottom:1px solid rgba(201,160,88,.13);text-decoration:none}
    .sn-m-toggle{width:100%;display:flex;align-items:center;justify-content:space-between;gap:1rem;background:transparent;border:0;border-bottom:1px solid rgba(201,160,88,.13);padding:.8rem 0;color:#faf7f0;font-family:"Cormorant Garamond",serif;font-size:1.58rem;line-height:1.1;text-align:left;cursor:pointer}
    .sn-m-toggle svg{width:18px;height:18px;color:#d4a945;transition:transform .3s}
    .sn-m-toggle[aria-expanded="true"] svg{transform:rotate(180deg)}
    .sn-m-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .35s;background:rgba(250,247,240,.025)}
    .sn-m-panel.open{grid-template-rows:1fr}.sn-m-inner{overflow:hidden}
    .sn-m-item{position:relative;display:block;padding:.78rem .7rem .78rem 1rem;border-left:1px solid rgba(201,160,88,.24);text-decoration:none}
    .sn-m-item+.sn-m-item{border-top:1px solid rgba(201,160,88,.08)}
    .sn-m-item.current{background:rgba(201,160,88,.08);border-left:3px solid #d4a945;padding-left:calc(1rem - 2px)}
    .sn-mobile-foot{margin-top:auto;padding-top:.9rem;border-top:1px solid rgba(201,160,88,.16)}
    .sn-m-cta{width:100%;min-height:52px;display:flex;align-items:center;justify-content:center;gap:.7rem;background:#b8623f;color:#faf7f0;border:0;font-family:Inter,sans-serif;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;font-weight:600;padding:.9rem 1rem;cursor:pointer}
    .sn-m-footnote{margin-top:.65rem;text-align:center;font:300 .62rem/1.5 Inter,sans-serif;color:rgba(250,247,240,.48)}
    section[id]{scroll-margin-top:84px}
    @media(max-width:1080px){.sn-links{gap:1.05rem}.sn-link,.sn-dd-toggle,.sn-cta{font-size:.62rem;letter-spacing:.12em}}
    @media(max-width:900px){.sn-links{display:none}.sn-burger{display:flex}nav.sn{padding:max(.45rem,env(safe-area-inset-top)) 1rem .45rem}.sn-logo img{height:38px}section[id]{scroll-margin-top:68px}.sn-test{margin-left:auto;margin-right:.8rem}}
    @media(min-width:901px){.sn-mobile,.sn-mobile-backdrop{display:none!important}}
    @media(prefers-reduced-motion:reduce){.sn-mobile,.sn-mobile-backdrop,.sn-m-panel,.sn-m-toggle svg,.sn-dd-panel{transition:none}}
  `;

  var chevron = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
  var arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

  function itemLinks(items, mobileClass) {
    return items.map(function (item) {
      var current = fileName === item.href.split('#')[0].toLowerCase();
      return '<a href="' + item.href + '" class="' + mobileClass + (current ? ' current' : '') + '"' + (current ? ' aria-current="page"' : '') + '>'
        + '<span class="sn-dd-name">' + item.name + '</span>'
        + '<span class="sn-dd-sub">' + item.sub + '</span></a>';
    }).join('');
  }


  var testBtn = NAV_DARK_TEST
    ? '<button class="sn-test" type="button" onclick="snToggleDark()" aria-label="Basculer entre navigation glass et sombre" title="Tester glass / sombre">'
      + '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/>'
      + '<path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg></button>'
    : '';

  var currentVilla = VILLAS.find(function (villa) {
    return fileName === villa.href.toLowerCase();
  }) || null;

  var isApproach = fileName === 'notre-approche.html';
  var isIsland = fileName === 'koh-samui.html';

  var navHtml = ''
    + '<nav class="sn" aria-label="Navigation principale">'
    +   '<a href="' + (isIndex ? '#top' : 'index.html') + '" class="sn-logo"><img src="assets/logo-horizontal.svg" alt="Latitude Samui — Luxury Homes Koh Samui"></a>'
    +   '<ul class="sn-links">'
    +     '<li class="sn-dd"><a href="' + indexPrefix + '#villas" class="sn-dd-toggle">Les villas ' + chevron + '</a><div class="sn-dd-panel">' + itemLinks(VILLAS, '') + '</div></li>'
    +     '<li class="sn-dd"><a href="notre-approche.html" class="sn-dd-toggle"' + (isApproach ? ' aria-current="page"' : '') + '>Notre approche ' + chevron + '</a><div class="sn-dd-panel">' + itemLinks(APPROACH, '') + '</div></li>'
    +     '<li><a href="koh-samui.html" class="sn-link"' + (isIsland ? ' aria-current="page"' : '') + '>Koh Samui</a></li>'
    +     '<li><a href="' + indexPrefix + '#parcours" class="sn-link">Étapes</a></li>'
    +     '<li><a href="boutique.html" class="sn-link">Boutique</a></li>'
    +     '<li><a href="faq.html" class="sn-link">FAQ</a></li>'
    +     '<li><button class="sn-cta" type="button" onclick="snOpenContact(\'nav-desktop\')">Nous contacter</button></li>'
    +   '</ul>'
    +   testBtn
    +   '<button class="sn-burger" id="snBurger" type="button" onclick="snOpenMobile()" aria-label="Ouvrir le menu" aria-controls="snMobile" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>'
    + '</nav>'
    + '<button type="button" class="sn-mobile-backdrop" id="snBackdrop" onclick="snCloseMobile()" aria-label="Fermer le menu"></button>'
    + '<aside class="sn-mobile" id="snMobile" aria-hidden="true" aria-label="Menu mobile">'
    +   '<div class="sn-mobile-head"><a href="' + (isIndex ? '#top' : 'index.html') + '"><img src="assets/logo-horizontal.svg" alt="Latitude Samui"></a><button class="sn-close" id="snClose" type="button" onclick="snCloseMobile()" aria-label="Fermer le menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>'
    +   '<div class="sn-mobile-scroll">'
    +     '<button type="button" class="sn-m-toggle" id="snVillasToggle" aria-expanded="' + (currentVilla ? 'true' : 'false') + '" aria-controls="snVillasPanel" onclick="snTogglePanel(\'snVillasToggle\',\'snVillasPanel\')"><span>Les villas</span>' + chevron + '</button>'
    +     '<div class="sn-m-panel' + (currentVilla ? ' open' : '') + '" id="snVillasPanel"><div class="sn-m-inner">' + itemLinks(VILLAS, 'sn-m-item') + '</div></div>'
    +     '<button type="button" class="sn-m-toggle" id="snApproachToggle" aria-expanded="' + (isApproach ? 'true' : 'false') + '" aria-controls="snApproachPanel" onclick="snTogglePanel(\'snApproachToggle\',\'snApproachPanel\')"><span>Notre approche</span>' + chevron + '</button>'
    +     '<div class="sn-m-panel' + (isApproach ? ' open' : '') + '" id="snApproachPanel"><div class="sn-m-inner"><a href="notre-approche.html" class="sn-m-item"><span class="sn-dd-name">Vue d’ensemble</span><span class="sn-dd-sub">Notre manière de concevoir et construire</span></a>' + itemLinks(APPROACH, 'sn-m-item') + '</div></div>'
    +     '<a href="koh-samui.html" class="sn-m-primary">Koh Samui</a>'
    +     '<a href="' + indexPrefix + '#parcours" class="sn-m-primary">Étapes</a>'
    +     '<a href="boutique.html" class="sn-m-primary">Boutique</a>'
    +     '<a href="faq.html" class="sn-m-primary">FAQ</a>'
    +   '</div>'
    +   '<div class="sn-mobile-foot"><button class="sn-m-cta" type="button" onclick="snCloseMobile();snOpenContact(\'nav-mobile\')">Nous contacter ' + arrow + '</button><div class="sn-m-footnote">Une réponse adaptée à votre projet.</div></div>'
    + '</aside>';

  var style = document.createElement('style');
  style.id = 'latitude-nav-styles';
  style.textContent = css;
  document.head.appendChild(style);

  var mount = document.getElementById('site-nav');
  if (mount) mount.innerHTML = navHtml;
  else document.body.insertAdjacentHTML('afterbegin', navHtml);

  var navElement = document.querySelector('nav.sn');
  var mobile = document.getElementById('snMobile');
  var backdrop = document.getElementById('snBackdrop');
  var burger = document.getElementById('snBurger');
  var closeButton = document.getElementById('snClose');
  var lastFocus = null;

  function onScroll() {
    navElement.classList.toggle('scrolled', window.scrollY > 120);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ====== Bascule glass / ink sombre, mémorisée entre les pages ======
  window.snToggleDark = function () {
    var on = navElement.classList.toggle('sn-dark');
    try { localStorage.setItem('snNavDark', on ? '1' : '0'); } catch (error) {}
  };

  if (NAV_DARK_TEST) {
    try {
      if (localStorage.getItem('snNavDark') === '1') navElement.classList.add('sn-dark');
    } catch (error) {}
  }

  window.snOpenContact = function (source) {
    if (typeof window.openContactModal !== 'function') return;
    window.openContactModal({
      intent: 'contact',
      villa: currentVilla ? currentVilla.contactName : null,
      source: source || 'navigation'
    });
  };

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

  window.snTogglePanel = function (toggleId, panelId) {
    var toggle = document.getElementById(toggleId);
    var panel = document.getElementById(panelId);
    var open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    panel.classList.toggle('open', !open);
  };

  mobile.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', window.snCloseMobile);
  });

  document.addEventListener('keydown', function (event) {
    if (!mobile.classList.contains('open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      window.snCloseMobile();
      return;
    }
    if (event.key === 'Tab') {
      var focusable = Array.prototype.slice.call(mobile.querySelectorAll('a[href],button:not([disabled])'));
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) window.snCloseMobile();
  });
})();
