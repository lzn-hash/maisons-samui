# Latitude Samui — manifeste de version canonique v3

## Version à utiliser

Le dossier entier `latitude-samui-site-v3-canonical` est désormais la seule base à utiliser.

Fichiers maîtres :
- `index.html`
- `villa-sabai.html`
- `villa-baansawan.html`
- `villa-suk.html`
- `villa-jai.html`
- `notre-approche.html`
- `koh-samui.html`
- `nav.js`
- `footer.js`
- `contact.js`
- `site.css`

## Réconciliation des fichiers Claude

### `villa-sabai(1).html`

Cette version est presque identique à la page Sabai canonique précédente.

Conservé :
- Hero adaptatif aux écrans desktop peu hauts.
- Galerie mobile horizontale avec compteur.
- Swipe dans la lightbox.
- Cartes de personnalisation horizontales sur mobile.
- Activation visuelle de la carte la plus proche du centre.
- Popup de détail plein écran sur mobile.
- Carte Google chargée uniquement à la demande.
- Chargement différé des images secondaires.

Améliorations conservées de la version Latitude :
- intents explicites `brochure`, `estimate` et `visit`;
- `window.VILLA_CONTEXT`;
- configuration intérieure/jardin transmise à l’estimation;
- footer partagé;
- formulaire contact v2.

### `villa-sabai-mobile-v1.html`

Cette version est une branche mobile parallèle, et non une version supérieure complète.

Éléments déjà présents sous une forme plus robuste dans la version canonique :
- galerie en scroll-snap;
- swipe lightbox;
- popup détail plein écran;
- cartes actives au centre du carrousel;
- commandes tactiles agrandies;
- façade de carte Google.

Éléments volontairement non repris :
- ancien CSS du modal copié dans le HTML;
- appels génériques `openContactModal()` sans intention;
- absence de `window.VILLA_CONTEXT`;
- ancien footer dupliqué;
- sticky bar qui masque les libellés et les choix;
- ancienne structure de carte sans lien externe.

### `nav (1).js`

Repris :
- bouton rond glass / sombre;
- classe `.sn-dark`;
- mémorisation via `localStorage`;
- positionnement desktop et mobile;
- icône et animation de rotation.

Conservé depuis la nouvelle navigation :
- menu `Notre approche`;
- sous-menu philosophie / équipe / méthode;
- entrée `Koh Samui`;
- CTA accessible sous forme de bouton;
- contexte de villa transmis au formulaire;
- accordéons mobiles séparés.

## Formulaire contact

Aucun nouveau `contact.js` Claude n’a été fourni dans les trois fichiers à comparer.

La version canonique reste donc le formulaire v2 :
- Brochure : une étape.
- Estimation : une étape.
- Contact général : deux étapes.
- Visite : deux étapes.
- Thumbnail 16/9 pour brochure et estimation.
- Métadonnées d’intention, villa, source et configuration.
