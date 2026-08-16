# Latitude Samui — accueil refactorisé

## Fichiers partagés

- `js/site.js` : navigation, animations d'apparition, diaporama hero, swipe mobile, chargement progressif des slides et bouton WhatsApp.
- `js/contact.js` : modal partagée pour les intentions `contact`, `brochure`, `estimate` et `visit`.
- `assets/latitude-logo.svg` : sprite SVG externe. Le logo utilise `currentColor`, il reste donc blanc sur le hero puis sombre après le scroll.

Ces fichiers sont conçus pour être réutilisés sur les futures pages villas.

## WhatsApp

Sans numéro configuré, le bouton flottant ouvre la modal de contact avec WhatsApp présélectionné. Pour activer plus tard le lien WhatsApp direct, définir avant `js/site.js` :

```html
<script>
  window.LATITUDE_WHATSAPP_NUMBER = '66XXXXXXXXX';
  window.LATITUDE_WHATSAPP_MESSAGE = 'Bonjour, je souhaite échanger au sujet d’un projet Latitude Samui.';
</script>
```

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
