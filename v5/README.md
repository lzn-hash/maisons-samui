# Latitude Samui — V5

Version autonome en français et en anglais, conçue à partir du design de `/v4` et des pages actives de la racine.

## Parcours disponibles

- Accueil et collection de villas.
- Baan Sawan, Sabai, Suk et Jai : galerie, navigation clavier et tactile, collections d’intérieur et de jardin, demandes de brochure, estimation et visite.
- Thong Krut Village : présentation du programme en préparation.
- Notre approche, Koh Samui, équipe, parcours d’achat, FAQ et boutique en préparation.
- Contact, confidentialité et page 404.
- Toutes les pages ont leur équivalent dans `en/`. Le choix de langue est mémorisé ; une première visite depuis un navigateur non francophone est orientée vers l’anglais.

## Mise à jour

Les sources de contenu sont `build.py` et `pages.py`. Exécuter `python3 v5/build.py` depuis la racine, ou `python3 build.py` depuis ce dossier. Les HTML générés sont de véritables pages statiques : navigation, contenu et FAQ restent lisibles sans JavaScript. La feuille commune est `css/site.css`.

Les images fournies ont été redimensionnées et compressées en WebP. `assets/sources.json` conserve leur provenance dans le dépôt initial. Le logo est le SVG complet `latitude-samui-soutenu-final-test.svg`, copié sans recomposition dans `assets/logo.svg`.

## Contact

Aucun service d’envoi n’était configuré dans la V4 : clé Web3Forms factice et absence d’endpoint Odoo. La V5 prépare donc un email avec les informations saisies et la configuration sélectionnée. Le visiteur clique ensuite pour ouvrir sa messagerie ou copier sa demande. Aucun envoi réussi n’est simulé.

Les points d’intégration `LATITUDE_LEAD_SUBMITTER`, `LATITUDE_ODOO_LEAD_ENDPOINT` et `LATITUDE_WEB3FORMS_KEY` sont conservés. Ils peuvent être définis avant `contact.js` dans `js/config.js` lorsqu’un service réel est disponible. L’endpoint doit accepter le payload JSON et confirmer l’envoi ; le test réel de réception devra alors être effectué. Mettre aussi à jour la page de confidentialité lors du raccordement.

Le chat existant `latitude-samui.odoo.com`, canal 2, est chargé sur activation du bouton. Si le service ne répond pas, un lien email reste disponible. Aucun message de test n’a été envoyé.

## Contenu commercial

Les quatre villas et leurs surfaces/prix proviennent des pages actives de la racine. Sabai conserve une livraison estimée au T4 2028. Les autres villas conservent une durée indicative de construction de 12 à 18 mois, sans reprendre les dates 2027 contradictoires de l’accueil V4.

Thong Krut Village est présenté comme un projet en préparation : environ vingt lots envisagés, prix de départ envisagé de 215 000 €, à confirmer au lancement. La boutique conserve son statut d’ouverture prochaine. Les anciens montants de la FAQ et les promesses juridiques, garanties et rendements non étayés ont été remplacés par des formulations propres à chaque proposition et contrat.

Les pages portent `noindex, nofollow` pour cette version de travail. Les métadonnées de partage déjà présentes pour l’accueil et Baan Sawan sont préservées. Avant un lancement commercial, valider les informations, les rendus de chaque villa, les prestations, les prix, les dates et la documentation puis retirer `noindex` dans le générateur.

## Vérifications réalisées

Vérification statique de toutes les pages FR/EN, des liens internes, ancres, assets, identifiants, titres et syntaxe JavaScript. Vérification du payload de demande et de la transmission des collections dans le brouillon d’email. Aucune navigation automatisée ni aucun envoi vers un service réel n’a été effectué.
