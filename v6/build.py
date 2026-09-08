"""Build only the V6 homepage from the agreed V4/V5 components.

python3 v6/build.py
V5 stays unchanged. Non-home routes deliberately point to ../v5/.
The Sites copy rewrites those links to its existing root-level V5 routes.
"""
from pathlib import Path
import re
import shutil
import sys

ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parent
V5 = PROJECT / 'v5'
sys.path.insert(0, str(V5))
import build as v5

def replace_once(text, old, new):
    assert text.count(old) == 1, (old, text.count(old))
    return text.replace(old, new, 1)

def section(text, cls):
    return re.search(r'<section class="'+re.escape(cls)+r'"[^>]*>.*?</section>', text, re.S).group()

def svg(paths):
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths+'</svg>'

original = (ROOT / 'reference-v4/index.html').read_text()
hero = section(original, 'hero')
hero = re.sub(r'photos/index/(\d+).jpg', r'assets/hero-\1.jpg', hero)
hero = hero.replace(' onclick="openContactModal({intent:\'brochure\',source:\'home-hero\'})"', ' data-contact="brochure" data-source="home-hero"')
hero = re.sub(r' onerror="[^"]*"', '', hero)
hero = re.sub(r' data-path="[^"]*"', '', hero)

cards = original.split('  <div class="vg" id="villas">', 1)[1].split('  <p class="vnote">', 1)[0]
cards = '<div class="vg" id="villas">' + cards
cards = re.sub(r'photos/(thongkrut|suk|sabai|baansawan)/card.jpg', r'assets/card-\1.jpg', cards)
cards = cards.replace('href="#contact"', 'href="thong-krut-village.html"')
cards = re.sub(r' onerror="[^"]*"| data-path="[^"]*"', '', cards)
cards = re.sub(r' class="vcard ([^"]*)"', lambda m: ' class="vcard '+re.sub(r'\s*reveal|\s*d[1-4]', '', m[1])+'"', cards)
cards = cards.replace('<small>À partir de*</small>', '<small>À partir de</small>')
cards = re.sub(r'(<b>[\d ]+ €)(</b>)', r'\1<sup>*</sup>\2', cards)
# Preserve card labels/layout; add useful accessible descriptions to linked images.
cards = re.sub(r'(<img src="assets/card-([a-z]+).jpg" alt=")"', lambda m: m[1]+{'thongkrut':'Thong Krut Village','suk':'Villa Suk','sabai':'Villa Sabai','baansawan':'Villa Baan Sawan'}[m[2]]+'"', cards)
cards += '<p class="vnote">* Prix de départ en configuration « Essentielle » : villa équipée, non meublée. Mobilier, décoration et aménagements paysagers complémentaires en option.</p>'

content = v5.home()
content = replace_once(content, section(content, 'home-hero'), hero)
content = replace_once(content, section(content, 'section collection-home'), '<section class="villas-mosaic" aria-label="Les villas">'+cards+'</section>')
content = replace_once(content, 'Une maison qui respire. Un horizon qui apaise. Une équipe qui connaît l’île.', 'Notre mission : rendre les villas d’architecte plus accessibles à Koh Samui.')
content = content.replace('class="large-copy"', 'class="mission-copy"')
content = replace_once(content, 'L’architecture est signée.<br><em>L’atmosphère est la vôtre.</em>', 'Votre villa,<br><em>à votre façon.</em>')
content = replace_once(content, 'Trois expertises.<br><em>Un engagement commun.</em>', 'Une équipe complémentaire,<br><em>présente à chaque étape.</em>')
content = replace_once(content, 'Du premier échange<br><em>à votre premier matin.</em>', 'Cinq étapes,<br><em>un accompagnement constant.</em>')
content = replace_once(content, 'Cinq étapes pour avancer avec une vision claire, du choix de la villa à la remise des clés.', 'Du premier échange à la remise des clés, chaque étape est expliquée, suivie et documentée.')
content = content.replace('Carte Blanche', 'Essentielle').replace('Éveil des Sens', 'Éveil des sens').replace('Art de Vivre', 'Art de vivre')
# Collection specifications are still being defined with the architects.
content = content.replace('Meublée et prête à vivre', 'Une proposition intermédiaire').replace('Un intérieur signature', 'La proposition la plus complète')
content = re.sub(r'<p class="eyebrow">.*?</p>', '', content)
content = content.replace('<section class="island-band">', '<section class="island-band" id="ile">')
content = content.replace('<section class="team-teaser section dark-section">', '<section class="team-teaser section dark-section" id="equipe">')
content = content.replace('<section class="section"><div class="section-heading "><div><h2>Votre villa,', '<section class="section" id="personnalisation"><div class="section-heading "><div><h2>Votre villa,')
content = content.replace('<section class="section"><div class="section-heading "><div><h2>Cinq étapes,', '<section class="section" id="parcours"><div class="section-heading "><div><h2>Cinq étapes,')
icons = re.findall(r'<span class="step-icon" aria-hidden="true">(.*?)</span>', original)
assert len(icons) == 5
for i, icon in enumerate(icons, 1):
    icon = icon.replace('<svg ', '<svg aria-hidden="true" ')
    content = replace_once(content, f'<span class="step-number">0{i}</span>', f'<div class="step-marker"><span class="step-number">0{i}</span>{icon}</div>')

pin = svg('<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0Z"/><circle cx="12" cy="10" r="3"/>')
phone = svg('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 1.9Z"/>')
mail = svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>')
details = f'''<address class="photo-contact">
  <div>{pin}<div><span>Retrouvons-nous</span><p>Bophut, Koh Samui</p></div></div>
  <div>{phone}<div><span>Téléphone / WhatsApp</span><p class="contact-placeholder">Numéro à renseigner</p></div></div>
  <div>{mail}<div><span>Écrivez-nous</span><a href="mailto:contact@latitudesamui.com">contact@latitudesamui.com</a></div></div>
</address>'''
content = content.replace('<section class="closing">', '<section class="closing" id="contact">')
content = replace_once(content, '<div class="closing-photo">'+v5.image('beach.webp','Plage bordée de palmiers à Koh Samui')+'</div>', '<div class="closing-photo">'+v5.image('beach.webp','Plage bordée de palmiers à Koh Samui')+details+'</div>')

nav = v5.nav('index')
nav = re.sub(r'<a href="boutique.html">.*?</a>', '', nav)
nav = nav.replace('loading="lazy"', 'loading="eager"')
nav = nav.replace('Parlons de votre projet', 'Nous contacter')
nav = nav.replace('href="en/index.html"', 'href="../v5/en/index.html"')
nav = nav.replace('<div class="nav-actions">', '<div class="nav-actions">')
footer = '''<footer class="home-footer"><a class="brand" href="#top" aria-label="Latitude Samui — accueil"><img src="assets/logo.svg" alt="Latitude Samui — Villas & Lifestyle" loading="lazy"></a><p>Villas & art de vivre · Koh Samui, Thaïlande</p><div><a href="faq.html">Vos questions</a><a href="confidentialite.html">Confidentialité</a></div></footer>'''
dialogs = v5.dialogs().split('<dialog class="lightbox"', 1)[0]
dialogs = dialogs.replace('<p class="eyebrow" id="contact-context">', '<p id="contact-context" hidden>')
head = (V5/'index.html').read_text().split('<body',1)[0]
head = head.replace('href="css/site.css"', 'href="css/foundation.css"')
head = head.replace('</head>', '<link rel="stylesheet" href="css/v4-preserved.css"><link rel="stylesheet" href="css/home.css"><link rel="preload" as="image" href="assets/hero-01.jpg" fetchpriority="high"><link rel="preconnect" href="https://latitude-samui.odoo.com" crossorigin></head>')
html = head+'<body id="top" data-page="index" class="has-photo-hero v6">'+nav+'<main id="main">'+content+'</main>'+footer+dialogs+'<noscript><p class="noscript-notice">Contact : <a href="mailto:contact@latitudesamui.com">contact@latitudesamui.com</a>.</p></noscript></body></html>'
html = re.sub(r'href="([a-z][a-z-]*\.html(?:#[^"]*)?)"', lambda m: 'href="'+('index.html' if m[1]=='index.html' else '../v5/'+m[1])+'"', html)
# Keep generated markup readable without changing text nodes.
html = re.sub(r'(?<=>)(?=<(?:section|/section|header|main|footer|dialog|link|script)\b)', '\n', html)
(ROOT/'index.html').write_text(html)

for directory in ['css','js','assets']:
    (ROOT/directory).mkdir(exist_ok=True)
shutil.copyfile(V5/'css/site.css', ROOT/'css/foundation.css')
shutil.copyfile(V5/'js/contact.js', ROOT/'js/contact.js')
(ROOT/'js/config.js').write_text("/* Existing contact integration hooks are retained. */\nwindow.LATITUDE_SITE = {version: 6};\n")
for name in ['logo.svg','favicon.svg','apple-touch-icon.png','island.webp','beach.webp','interieur-carte-blanche.webp','interieur-eveil-des-sens.webp','interieur-art-de-vivre.webp']:
    shutil.copyfile(V5/'assets'/name, ROOT/'assets'/name)
shutil.copyfile(V5/'favicon.ico', ROOT/'favicon.ico')

# Exact V4 hero/card rules, plus their original hero-only button styles.
base = (ROOT/'reference-v4/css/base.css').read_text()
home = (ROOT/'reference-v4/css/home.css').read_text()
preserved = home.split('/* ---------- Bandeau d’introduction',1)[0] if '/* ---------- Bandeau d’introduction' in home else home.split('/* ---------- Bandeau d\'introduction',1)[0]
preserved += home.split('/* ---------- Mosaïque villas ---------- */',1)[1].split('/* ---------- Île ---------- */',1)[0]
buttons = base.split('/* ---------- Boutons ---------- */',1)[1].split('/* ---------- Apparition au scroll ---------- */',1)[0]
buttons = re.sub(r'(^|})(\s*)([^{}]+)\{', lambda m: m[1]+m[2]+','.join('.hero '+s.strip() for s in m[3].split(','))+'{', buttons)
(ROOT/'css/v4-preserved.css').write_text('/* V4 hero and villa mosaic, intentionally preserved. */\n'+buttons+'\n'+preserved)

# Reuse the full V4 slideshow behavior (six frames, pause and swipe).
script = (ROOT/'reference-v4/js/site.js').read_text()
hero_js = script[script.index('  function initHero()'):script.index('  function initLiveChatStyling()')]
(ROOT/'js/hero.js').write_text("(() => {\n'use strict';\nfunction track() {}\n"+hero_js+'\ninitHero();\n})();\n')
html = (ROOT/'index.html').read_text().replace('<script defer src="js/site.js"></script>', '<script defer src="js/site.js"></script><script defer src="js/hero.js"></script><script defer src="js/chat.js"></script>')
(ROOT/'index.html').write_text(html)

if '--stage' in sys.argv:
    target = PROJECT/'dist/v6'
    target.mkdir(exist_ok=True)
    for name in ['assets','css','js']:
        shutil.copytree(ROOT/name, target/name, dirs_exist_ok=True)
    shutil.copyfile(ROOT/'favicon.ico', target/'favicon.ico')
    (target/'index.html').write_text(html.replace('href="../v5/', 'href="../'))
print('Generated V6 index only; V4/V5 source untouched.')
