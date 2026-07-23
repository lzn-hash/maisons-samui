# Audit technique après refonte — Latitude Samui site v2

## 1. Typographie

Le système est désormais limité à deux familles sur l’index et les nouvelles pages :

- Cormorant Garamond : titres, accroches éditoriales et noms de villas.
- Inter : navigation, boutons, informations commerciales et textes fonctionnels.

Les pages villas utilisaient déjà ces deux familles. La nouvelle page d’accueil ne conserve plus les anciennes références à DM Serif Display, Italiana ou Caveat.

## 2. Couleurs

Les variables communes sont alignées sur la base Villa Sabai :

- Jungle : #1A2E22
- Jungle profond : #14241B
- Terracotta : #B8623F
- Or : #C9A058
- Or clair : #D4A945
- Crème : #FAF7F0
- Sable clair : #F2EDE2
- Encre : #1A1E1A
- Texte secondaire : #4A4E4A

Le terracotta reste réservé aux actions principales et à la grande section contact. Les cinq étapes conservent toutes un cercle vert jungle.

## 3. Nettoyage de l’index

L’index a été reconstruit avec un fichier CSS propre au lieu de modifier l’ancien empilement de variantes.

Supprimé de la nouvelle version :

- ancien CSS du modal trois étapes ;
- classes inutilisées des variantes de cartes précédentes ;
- gestionnaire JavaScript obsolète recherchant #mainNav ;
- bouton de test glass/sombre de la navigation ;
- répétitions de styles de la section équipe et du parcours ;
- ancienne référence à Blockestate ;
- affirmations « depuis 2010 », « quinze ans » et « quarante-deux villas ».

## 4. Navigation et footer

- Navigation partagée par index, pages éditoriales et pages villas.
- Sous-menu Notre approche sur ordinateur.
- Accordéons Les villas et Notre approche sur mobile.
- CTA de navigation transformé en vrai bouton accessible.
- Footer partagé via footer.js afin d’éviter les divergences entre les pages.
- Les liens Histoire ont été remplacés par Notre approche et Koh Samui.

## 5. Animations et accessibilité

- Diaporama synchronisé sur huit secondes.
- Zoom Ken Burns réduit à 7,5 %.
- Bouton pause/reprise ajouté.
- Zone interactive des indicateurs agrandie sans modifier leur apparence.
- prefers-reduced-motion désactive le Ken Burns, les transitions du slideshow et les apparitions.
- Les cartes villas sont entièrement cliquables.
- Les cartes apparaissent individuellement avec un décalage progressif.
- Les cartes équipe gardent un effet principalement photographique, sans mouvement excessif.

## 6. Images et performances

- Première image Hero préchargée et prioritaire.
- Slides suivantes chargées en différé.
- Images des cartes et sections secondaires en lazy loading.
- Les cartes villas utilisent de vrais éléments img avec textes alternatifs.
- Les photos d’équipe disposent d’un fond placeholder si les fichiers ne sont pas encore présents.
- Les futures photos Koh Samui utilisent une racine dédiée photos/koh-samui avec un fallback temporaire.

## 7. Cohérence avec les pages villas

Points désormais partagés :

- mêmes familles de caractères ;
- mêmes variables de couleurs ;
- même navigation ;
- même footer ;
- même formulaire contact ;
- même hiérarchie des boutons ;
- mêmes intitulés de villas et orientations ;
- mêmes racines d’images.

Limite restante :

Les pages villas conservent encore leur CSS historique intégré dans chaque fichier. Ce CSS est fonctionnel mais plus volumineux que le nouvel index. Une étape ultérieure pourra extraire leurs styles communs dans un fichier villa.css sans changer le rendu.

## 8. Contenus temporaires à remplacer avant mise en production

- numéro de téléphone thaïlandais ;
- photos verticales de l’équipe ;
- galerie photographique dédiée à Koh Samui ;
- image distante de la section contact ;
- coordonnées exactes des cartes des villas ;
- clé Web3Forms réelle ;
- validation juridique finale des formulations relatives aux modes d’acquisition et paiements crypto.
