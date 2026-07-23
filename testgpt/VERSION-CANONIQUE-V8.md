# Latitude Samui — version canonique v8

Cette version corrige l’effondrement visuel constaté lors de l’ouverture du fichier
`notre-approche.html` hors de son dossier complet.

## Cause

Le fichier individuel précédemment fourni dépendait de `site.css`.
Ouvert seul depuis un autre emplacement, la feuille de style n’était pas trouvée.
La section apparaissait donc comme du HTML brut :
image pleine largeur, aucun fond jungle, aucune flèche et labels sous l’image.

## Corrections

- Images Carte Blanche et Art de Vivre limitées chacune à leur moitié.
- Fond jungle, flèche centrale et labels restaurés.
- Fallbacks photographiques temporaires si les images locales ne sont pas accessibles.
- CSS critique de la section intégré directement dans la page canonique.
- Création de `notre-approche-v5-standalone.html`, totalement autonome :
  CSS, navigation, footer et formulaire sont intégrés au fichier.

## Usage

Pour le déploiement :
- utiliser le dossier complet `latitude-samui-site-v8-canonical`.

Pour tester directement dans ChatGPT ou en ouvrant un fichier seul :
- utiliser `notre-approche-v5-standalone.html`.
