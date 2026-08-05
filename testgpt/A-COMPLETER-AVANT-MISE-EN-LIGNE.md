# À compléter avant la mise en ligne publique

Ce fichier recense les valeurs de test encore présentes dans le site.
Elles n'empêchent pas le site de fonctionner, mais doivent être remplacées
avant toute diffusion commerciale. Ne pas publier ce fichier sur le site
public (il est ignoré par le sitemap).

---

## 1. Numéro de téléphone — `+66 (0) 77 000 000`

Numéro fictif. À remplacer par le numéro réel.

| Fichier | Occurrence |
|---|---|
| `footer.js` | `<a href="tel:+6677000000">+66 (0) 77 000 000</a>` |
| `index.html` | bloc contact, classe `.contact-value` |

Remplacer **deux valeurs** à chaque fois : le `href="tel:..."` (format
international sans espaces ni parenthèses, ex. `tel:+66771234567`) et le
texte affiché.

---

## 2. Coordonnées Google Maps — `9.4512, 100.0412`

Coordonnées de test. Présentes **3 fois dans chacune des 4 pages villa**
(iframe de la carte, lien « Ouvrir dans Maps », et attribut de secours).

Chaque villa devrait à terme avoir ses propres coordonnées :

| Villa | Coordonnées réelles |
|---|---|
| Villa Sabai | à renseigner |
| Villa Suk | à renseigner |
| Villa Jai | à renseigner |
| Baan Sawan | à renseigner |

Pour les obtenir : clic droit sur le point exact dans Google Maps →
les coordonnées apparaissent en haut du menu, au format `9.4512, 100.0412`.

**Remarque commerciale :** pour un projet non encore construit, il est
courant de ne pas publier la parcelle exacte. Un point centré sur le
quartier (Lamai) avec la mention « emplacement approximatif » est une
pratique acceptée, et évite les visites sauvages sur le terrain.

---

## 3. Clé Web3Forms — `WEB3FORMS_KEY`

Dans `contact.js`. Sans cette clé, **aucun formulaire n'est transmis** :
les demandes sont perdues silencieusement.

Créer une clé gratuite sur web3forms.com (associée à
`contact@latitudesamui.com`), puis remplacer la valeur.

Après remplacement, tester un envoi réel depuis chacun des trois parcours
du formulaire : contact, brochure, estimation.

---

## 4. Informations légales

Dans `mentions-legales.html` et `confidentialite.html`, les blocs encadrés
en sable signalent les informations à fournir :

- numéro de licence IFZA et adresse du siège de BlockEstate FZ-LLC
- nom du directeur de la publication
- raison sociale exacte et numéro DBD de l'entité thaïlandaise
- adresse postale du responsable de traitement
- le cas échéant, représentant dans l'Union européenne (article 27 du RGPD,
  requis si vous ciblez le marché européen sans établissement dans l'UE —
  c'est votre cas, à faire valider par un conseil)

Supprimer les blocs `.legal-todo` une fois les informations renseignées.

---

## 5. Prix au mètre carré (à arbitrer)

Villa Sabai, Villa Suk et Villa Jai sont toutes affichées à **510 000 €**
pour des surfaces habitables de 148, 152 et 146 m².

Un acquéreur attentif calculera : 3 446 €/m² pour Sabai, 3 355 € pour Suk,
3 493 € pour Jai. L'écart de 4 % entre Suk et Jai n'est pas justifié par
le discours actuel.

Deux options cohérentes :

1. **Assumer le prix unique** — le justifier explicitement (« une gamme,
   un prix, trois orientations ») ; l'écart de surface devient un détail
   d'implantation et non un critère de valeur.
2. **Différencier légèrement** — par exemple 500 000 / 510 000 / 505 000 €.
   L'écart reste faible mais la logique devient lisible.

Recommandation : l'option 2 si l'écart de surface est réel et mesuré,
l'option 1 s'il s'agit de variantes d'un même modèle sur des parcelles
équivalentes.
