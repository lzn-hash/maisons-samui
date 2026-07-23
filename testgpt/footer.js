(function () {
  'use strict';

  var css = `
    footer.sf{background:#1a1e1a;color:rgba(255,255,255,.7);padding:4rem 3rem 2rem;border-top:1px solid rgba(255,255,255,.1)}
    .sf-inner{max-width:1400px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:3rem;padding-bottom:3rem;border-bottom:1px solid rgba(255,255,255,.1)}
    .sf-logo img{height:150px;width:auto;display:block;margin-bottom:.55rem}
    .sf-brand p{font-family:"Cormorant Garamond",serif;font-style:italic;font-size:1.04rem;line-height:1.5;color:rgba(255,255,255,.58)}
    .sf-col h4{font-family:"Cormorant Garamond",serif;font-size:.82rem;letter-spacing:.28em;text-transform:uppercase;color:#c9a058;margin-bottom:1.35rem}
    .sf-col ul{list-style:none;margin:0;padding:0}.sf-col li{padding:.34rem 0;font:300 .86rem/1.45 Inter,sans-serif}
    .sf-col a{color:rgba(255,255,255,.68);text-decoration:none;transition:color .25s;cursor:pointer}.sf-col a:hover{color:#d4a945}
    .sf-contact-btn{border:0;background:transparent;padding:0;color:rgba(255,255,255,.68);font:300 .86rem/1.45 Inter,sans-serif;cursor:pointer}.sf-contact-btn:hover{color:#d4a945}
    .sf-bottom{max-width:1400px;margin:0 auto;padding-top:2rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;font:300 .66rem/1.4 Inter,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.43)}
    @media(max-width:900px){footer.sf{padding:3.5rem 1.5rem 2rem}.sf-inner{grid-template-columns:1fr 1fr}.sf-brand{grid-column:1/-1}.sf-logo img{height:122px}}
    @media(max-width:620px){.sf-inner{grid-template-columns:1fr;gap:2rem}.sf-brand{grid-column:auto}.sf-bottom{align-items:flex-start;flex-direction:column}.sf-logo img{height:108px}}
  `;

  var html = ''
    + '<footer class="sf">'
    +   '<div class="sf-inner">'
    +     '<div class="sf-brand"><a href="index.html" class="sf-logo"><img src="assets/logo-full.svg" alt="Latitude Samui — Luxury Homes Koh Samui"></a><p>Villas contemporaines à Koh Samui.</p></div>'
    +     '<div class="sf-col"><h4>Le site</h4><ul>'
    +       '<li><a href="index.html#villas">Les villas</a></li>'
    +       '<li><a href="notre-approche.html">Notre approche</a></li>'
    +       '<li><a href="koh-samui.html">Koh Samui</a></li>'
    +       '<li><a href="index.html#parcours">Étapes</a></li>'
    +       '<li><a href="boutique.html">Boutique</a></li>'
    +       '<li><a href="faq.html">FAQ</a></li>'
    +     '</ul></div>'
    +     '<div class="sf-col"><h4>Les villas</h4><ul>'
    +       '<li><a href="villa-baansawan.html">Baan Sawan</a></li>'
    +       '<li><a href="villa-sabai.html">Villa Sabai</a></li>'
    +       '<li><a href="villa-suk.html">Villa Suk</a></li>'
    +       '<li><a href="villa-jai.html">Villa Jai</a></li>'
    +     '</ul></div>'
    +     '<div class="sf-col"><h4>Contact</h4><ul>'
    +       '<li>Bophut, Koh Samui</li>'
    +       '<li><a href="mailto:contact@latitudesamui.com">contact@latitudesamui.com</a></li>'
    +       '<li><a href="tel:+6677000000">+66 (0) 77 000 000</a></li>'
    +       '<li><button type="button" class="sf-contact-btn" onclick="if(window.snOpenContact){snOpenContact(\'footer\')}else if(window.openContactModal){openContactModal({intent:\'contact\',source:\'footer\'})}">Prendre rendez-vous →</button></li>'
    +     '</ul></div>'
    +   '</div>'
    +   '<div class="sf-bottom"><span>© 2026 Latitude Samui · Koh Samui, Thaïlande</span><span>Cryptos acceptées · BTC · USDC · USDT</span></div>'
    + '</footer>';

  var style = document.createElement('style');
  style.id = 'latitude-footer-styles';
  style.textContent = css;
  document.head.appendChild(style);

  var mount = document.getElementById('site-footer');
  if (mount) mount.innerHTML = html;
})();
