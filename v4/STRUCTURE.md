# Latitude Samui — structure du dépôt

```
/
├─ index.html                    accueil
├─ villa-baansawan.html          fiche villa (trame des suivantes)
├─ favicon.ico                   obligatoirement à la racine
├─ site.webmanifest              à la racine (start_url et scope = /)
│
├─ css/
│  ├─ base.css                   socle commun — chargé par TOUTES les pages
│  ├─ home.css                   sections propres à l'accueil
│  └─ villa.css                  sections propres aux fiches villas
│
├─ js/
│  ├─ site.js                    nav, apparitions, diaporama hero, Live Chat
│  ├─ contact.js                 modal de contact partagée
│  └─ villa.js                   galerie, lightbox, configurateur
│
├─ assets/
│  ├─ brand/
│  │  ├─ latitude-logo.svg           lockup monochrome — EN SERVICE dans la nav et le footer
│  │  ├─ latitude-logo-bicolore.svg  lockup jungle + tilleul (variante)
│  │  ├─ latitude-logo-nav.svg       lockup sans baseline (réserve)
│  │  └─ latitude-mark-ivoire.svg    pictogramme seul, filigrane des réserves photo
│  │
│  └─ icons/
│     ├─ favicon.svg
│     ├─ apple-touch-icon.png
│     ├─ safari-pinned-tab.svg
│     ├─ icon-192x192.png / icon-512x512.png
│     ├─ maskable-icon-192x192.png / maskable-icon-512x512.png
│     ├─ mstile-150x150.png
│     └─ browserconfig.xml
│
└─ photos/
   ├─ index/  baansawan/  sabai/  suk/  jai/  thongkrut/
```

## Ordre de chargement des feuilles

`base.css` **toujours en premier**, la feuille de page ensuite :

```html
<!-- accueil -->
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/home.css">

<!-- fiche villa -->
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/villa.css">
```

## Ce qui vit dans base.css

Jetons de design (`:root`), reset, `.h-sec`, `.lead`, famille `.btn`, `.ulink`,
`.reveal` et `.d1`–`.d4`, gabarit `.sec` / `.sec-head`, réserves photo `.ph`,
**navigation complète** et **pied de page**.

Une seule règle à modifier pour changer la nav sur tout le site.
Le `<header>` reste écrit en dur dans le HTML de chaque page : c'est la
navigation principale, celle que Google suit pour découvrir les fiches villas,
elle ne doit pas dépendre de JavaScript.

## Deux règles à ne pas casser

1. **`favicon.ico` reste à la racine.** Les navigateurs le demandent à
   `/favicon.ico` sans lire le HTML. Tout le reste peut vivre dans
   `assets/icons/` puisque c'est déclaré par balise `<link>`.
2. **Les chemins internes sont relatifs à leur propre fichier.**
   `base.css` pointe le pictogramme en `../assets/brand/`,
   `site.webmanifest` pointe ses icônes en `assets/icons/`,
   `browserconfig.xml` pointe la tuile en `mstile-150x150.png` (même dossier).
