"""Approach content; reuse the homepage shell and approved contact section."""
import re


def render_approach(home, root):
    closing = re.search(r'<section class="closing" id="contact">.*?</section>', home, re.S).group()
    configurator = (root / 'configurator.html').read_text()
    main = '''<section class="page-hero with-photo approach-hero">
      <img src="assets/approach.webp" alt="Architecture ouverte sur l’extérieur à Koh Samui" loading="eager" fetchpriority="high" decoding="async">
      <div class="page-hero-content"><h1>Une attention particulière<br>à <em>chaque villa.</em></h1>
      <p class="hero-lead">Une collection volontairement limitée pour suivre chaque projet de près, de sa conception à la remise des clés.</p>
      <a class="text-link on-dark" href="#approche">Découvrir notre approche <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 4v16m-7-7 7 7 7-7"/></svg></a></div>
    </section>
    <section class="section intro-section" id="approche">
      <h2>Des villas pensées pour<br><em>vivre à Koh Samui.</em></h2>
      <div class="intro-copy">
        <p>Chaque villa part d’un terrain, d’une orientation et d’un mode de vie. Nous recherchons des espaces fluides, une relation naturelle avec l’extérieur et des choix cohérents avec le climat tropical.</p>
        <p>La personnalisation vient ensuite donner à la maison votre caractère. Les gammes intérieures et les aménagements extérieurs se choisissent séparément, avec des prestations détaillées et un chiffrage propre à votre projet.</p>
      </div>
    </section>
    <section class="editorial-split approach-followup">
      <div class="editorial-image"><img src="assets/construction.webp" alt="Suivi de la construction d’une villa à Koh Samui" loading="lazy" decoding="async"></div>
      <div class="editorial-copy">
        <h2>Un lien direct pour assurer<br><em>un suivi régulier.</em></h2>
        <p>Nous coordonnons le développement des villas et le suivi des chantiers avec les équipes et partenaires locaux. Les décisions prises avec vous sont ainsi transmises aux intervenants et suivies dans leur réalisation.</p>
        <p>Architectes, ingénieurs, entreprises et avocats interviennent chacun dans leur domaine. Nous faisons le lien entre eux pour vous tenir informé de l’avancement et préparer les choix à venir.</p>
        <a class="text-link" href="../v5/equipe.html">Découvrir l’équipe <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7"/></svg></a>
      </div>
    </section>'''+configurator+closing
    page = re.sub(r'<main id="main">.*?</main>', lambda _: '<main id="main">'+main+'</main>', home, flags=re.S)
    page = page.replace('data-page="index"', 'data-page="notre-approche"').replace('class="has-photo-hero v6"', 'class="has-photo-hero v6 approach-page"')
    page = page.replace('href="notre-approche.html" >', 'href="notre-approche.html" aria-current="page">')
    page = page.replace('href="../v5/en/index.html"', 'href="../v5/en/notre-approche.html"')
    page = re.sub(r'<title>.*?</title>', '<title>Notre approche — Latitude Samui</title>', page)
    description = 'Des villas pensées pour Koh Samui, un suivi de proximité et des gammes intérieures et extérieures à composer selon votre projet.'
    page = re.sub(r'(<meta (?:name="description"|property="og:description") content=")[^"]*', lambda m: m[1]+description, page)
    page = re.sub(r'(<meta property="og:title" content=")[^"]*', r'\1Notre approche — Latitude Samui', page)
    page = page.replace('<link rel="preload" as="image" href="assets/hero-01.jpg" fetchpriority="high">', '')
    page = page.replace('<script defer src="js/hero.js"></script>', '')
    page = page.replace('</head>', '<link rel="stylesheet" href="css/approach.css"><link rel="stylesheet" href="css/configurator.css"><script defer src="js/configurator.js"></script></head>')
    return page
