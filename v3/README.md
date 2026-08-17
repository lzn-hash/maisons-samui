# Latitude Samui — master du site

## Pages disponibles

- `index.html` : page d'accueil.
- `villa-baansawan.html` : première page villa complète, utilisée comme trame pour les futures fiches.

## Fichiers partagés

- `js/site.js` : navigation, animations d'apparition, diaporama hero, swipe mobile et chargement progressif des slides.
- `js/contact.js` : modal partagée pour les intentions `contact`, `brochure`, `estimate` et `visit`.
- `js/villa.js` : galerie plein écran, navigation clavier et sélection des options intérieur/jardin.
- `css/villa.css` : système visuel responsive des pages villas.
- `assets/latitude-logo.svg` : sprite SVG externe. Le logo utilise `currentColor`, il reste donc blanc sur le hero puis sombre après le scroll.

Ces fichiers sont conçus pour être réutilisés sur les futures pages villas.

## Live Chat Odoo

La page d'accueil charge le canal Live Chat Odoo `2` au moyen des deux scripts officiels placés dans le `<head>`. Odoo génère la bulle, la fenêtre de discussion et les notifications ; l'ancien bouton WhatsApp factice a été retiré pour éviter un doublon.

Le libellé, les couleurs, le message d'accueil, les horaires et les opérateurs se règlent dans la configuration du canal Live Chat dans Odoo. Le lien autonome de test du canal est :

`https://latitude-samui.odoo.com/im_livechat/support/2`

`js/site.js` ajoute ensuite un thème Latitude dans le Shadow DOM ouvert du widget : bouton de 62 px, notification centrée verticalement et fenêtre desktop de 440 × 680 px maximum. Sous 640 px, la notification textuelle est masquée et le bouton reste compact afin de préserver la surface utile sur mobile.

## Connexion du formulaire à Odoo

Ne pas exposer les identifiants Odoo dans le navigateur. Le point d'entrée recommandé est une fonction Netlify ou une API serveur qui reçoit le payload normalisé `latitude_lead_v1`, puis crée le lead dans Odoo CRM.

```html
<script>
  window.LATITUDE_ODOO_LEAD_ENDPOINT = '/.netlify/functions/odoo-lead';
</script>
```

Une fonction personnalisée peut aussi être fournie :

```js
window.LATITUDE_LEAD_SUBMITTER = async function (lead) {
  // Envoyer le lead vers le backend choisi.
};
```

Web3Forms reste disponible en solution de secours avec `window.LATITUDE_WEB3FORMS_KEY`.

## Photos

Les chemins attendus restent identiques à la maquette (`photos/index`, `photos/sabai`, etc.). Les slides 2 à 6 du hero ne sont plus chargées au premier affichage : `site.js` charge uniquement la prochaine image nécessaire.

La page Baan Sawan utilise huit WebP optimisés dans `photos/baansawan`. Les visuels sont des images d'intention non contractuelles ; cette mention figure également sous la page.

## Créer une nouvelle page villa

Dupliquer `villa-baansawan.html`, remplacer les contenus, les huit sources de galerie et l'objet `window.VILLA_CONTEXT`. Conserver les attributs `data-contact-intent`, `data-config-group` et `data-config-value` : ils relient automatiquement la brochure, la visite et la configuration au formulaire partagé.
