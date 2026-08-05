# Latitude Samui — version canonique V17

Base : V16. Cette version corrige les points relevés lors de l'audit complet
(design, typographie, couleurs, espacements, mise en page, contenu, mobile).

---

## 1. Architecture CSS — refonte majeure

Le CSS des pages villas était **dupliqué à l'identique dans les quatre pages**
(similarité mesurée : 100,0 %), soit 57 Ko répétés quatre fois.

- Extraction dans un fichier partagé **`villa.css`**.
- Les quatre pages villas chargent désormais ce fichier au lieu d'un bloc
  `<style>` interne.
- Poids par page : **115 Ko → 59 Ko**. Total du site : 460 Ko → 293 Ko.
- Toute modification de design des villas ne se fait plus qu'**une seule fois**.

## 2. Points de rupture (breakpoints) unifiés

Les pages villas utilisaient neuf seuils différents (380, 600, 640, 720, 760,
761, 768, 900, 1100 px), avec un chevauchement entre 760 et 768 qui créait une
bande de 8 px où le style était hybride.

Hiérarchie ramenée à cinq paliers cohérents :

| Palier | Usage |
|---|---|
| 380 px | très petits téléphones |
| 640 px | petits téléphones |
| 768 px | mobile (palier principal) |
| 900 px | tablette |
| 1100 px | petit ordinateur portable |

## 3. Correction d'un débordement horizontal préexistant

Sur **villa-suk, villa-jai et villa-baansawan**, la ligne de caractéristiques
débordait de 23 px entre 769 et 795 px de large (bug présent en V16). Villa
Sabai y échappait uniquement parce que son libellé de livraison était plus
court.

La grille des caractéristiques est désormais resserrée sur la bande
769–900 px. Vérifié sans débordement sur les quatre villas.

## 4. Optimisation mobile de la page d'accueil

Cinq sections sur six conservaient leur espacement d'ordinateur sur téléphone
(96 à 104 px). Seule `.promise` était réduite.

- `villas`, `island-preview`, `team`, `journey`, `contact-band` et
  `content-section` passent à 56 px sur mobile.
- Hauteur totale de défilement : 9 694 px → 9 230 px, sans retirer de contenu.

## 5. Accessibilité tactile et lisibilité

- Zones tactiles portées à 44 px (recommandation Apple et Google) :
  bouton d'agrandissement des approches, bouton d'affichage des photos,
  bouton pause du diaporama, indicateurs, liens de temps de trajet,
  liens du pied de page.
- Plancher typographique d'environ 10 px sur mobile pour les micro-libellés
  qui descendaient jusqu'à 7,8 px (`approche-status`, `spec-lab`,
  `section-eyebrow`).

## 6. Performance

- **57 images** dotées des attributs `width` et `height` : l'espace est
  réservé avant le chargement, ce qui supprime les sauts de mise en page
  (indicateur CLS des Core Web Vitals). Le CSS reste maître du rendu.

## 7. Référencement

- **Données structurées JSON-LD** ajoutées : `SingleFamilyResidence` sur
  chaque villa (chambres, salles d'eau, surfaces, prix, localisation) et
  `Organization` sur l'accueil. Permet l'affichage enrichi dans Google.
- **`sitemap.xml`** (9 URL) et **`robots.txt`** créés.
- **Favicon** ajouté sur toutes les pages (il n'était présent que sur l'accueil).

## 8. Pages légales

Deux pages créées, dans le design du site :

- **`mentions-legales.html`** — éditeur, hébergement, propriété
  intellectuelle, caractère non contractuel des visuels et des prix,
  avertissement sur les structures de détention thaïlandaises.
- **`confidentialite.html`** — conformité RGPD : données collectées,
  finalités et bases légales, durées de conservation, sous-traitants,
  transferts hors Union européenne, cookies, exercice des droits.

Liens ajoutés dans le pied de page de toutes les pages.

## 9. Cohérence éditoriale

- Délai de livraison harmonisé sur **« 12–18 mois »** pour les quatre villas
  (Villa Sabai affichait « T4 2028 », une date fixe qui vieillit mal).

## 10. Conservé volontairement

- Le bouton de bascule glass / sombre de la navigation
  (`NAV_DARK_TEST = true`) est **maintenu** à la demande.

---

## Contrôles effectués

**216 combinaisons testées** : 9 pages × 24 largeurs d'écran
(320, 360, 375, 390, 414, 430, 540, 640, 700, 760, 768, 769, 780, 800, 900,
901, 1024, 1180, 1280, 1366, 1440, 1680, 1920, 2560 px).

- Aucun débordement horizontal.
- Aucune erreur JavaScript.
- Comparaison avant/après du rendu des pages villas sur 21 largeurs :
  hauteurs identiques hors corrections voulues.
- Composants interactifs vérifiés après l'externalisation du CSS :
  panneaux de détail des approches, carrousel de pièces, sélection
  d'approche, lightbox, formulaire de contact.

## Reste à faire

Voir **`A-COMPLETER-AVANT-MISE-EN-LIGNE.md`** : clé Web3Forms, numéro de
téléphone réel, coordonnées Google Maps par villa, informations légales de
société, et arbitrage sur le prix au mètre carré des trois villas à 510 000 €.
