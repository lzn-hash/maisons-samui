# Latitude Samui — index V6

Scope: homepage only, in French. Other destinations link to the existing V5 pages.

- V4 hero retained (six original photos, copy, typography, controls and motion).
- V4 villa mosaic retained, with consistent price asterisks and the Essentielle explanation.
- Complete approved logo copied byte for byte from V5.
- White mobile menu, V5 navigation structure without the boutique, subtle lime underlines on hover/focus, keyboard controls and reduced-motion support.
- Typography reference: V5's approach introduction « Le beau a du sens quand il se vit bien. ». Section titles use Cormorant Garamond 400 at `clamp(42px, 4.6vw, 72px)`, line-height 1.06 and letter-spacing -0.028em; 43px up to a 560px viewport. Section paragraphs, including the opening and closing, use Manrope 400, 16px and line-height 1.75 on desktop and mobile. These values are centralized as CSS tokens in rem. Hero and card typography remain unchanged; the hero tagline is pure white.
- Island heading: « Une île où l’on prend le temps de vivre. »
- Each collection combines its existing interior photo in the upper-left half and its garden photo in the lower-right half, separated diagonally. Explanatory copy sits beside the section title.
- The full V4 journey (heading, introduction, five cards, icons and descriptions) is restored with a light palette.
- A continuous, darkened beach photograph fills the closing section. Invitation and « Nous contacter » sit on the left, contact details on the right; they stack in reading order on mobile. Telephone is explicitly a placeholder pending a real number. The footer retains the dark jungle background; « Nous contacter » uses a jungle fill animation on hover.
- Chat styles the actual Odoo launcher. Its visibility and click behavior remain owned by Odoo; no unconditional fake chat button is created.
- The existing contact form still prepares an email unless its existing integration hooks are configured.

The three collection names are Essentielle, Éveil des sens and Art de vivre. Detailed option contents remain subject to the architects’ proposal.

Run `python3 v6/build.py` from the repository root. It uses the existing V5 generator and frozen V4 references to generate only `v6/index.html` and supporting files. Source assets in `v6/assets` are originals, not regenerated imagery. Run with `--stage` in the Sites checkout to copy the homepage into `dist/v6`, adapting links to the V5 routes already hosted at the root. The original V5 is unchanged.

Validation: static HTML/assets/link checks, preservation checks for hero/cards/logo, JavaScript syntax and targeted native-launcher integration checks. No browser QA or real contact messages are sent as part of this change.


## Notre approche — V6

La page `notre-approche.html` est générée par `approach.py` via `build.py`. Elle réutilise la navigation, le logo, les styles typographiques et la section de contact de l’index. Les liens « Notre approche » de l’index restent désormais en V6.

Le configurateur fourni (`reference-configurateur-v9.html`, archive de référence non publiée) est intégré en une seule section, thème jungle fixe. `configurator.html`, `css/configurator.css` et `js/configurator.js` en sont les sources adaptées : six images locales, sélections indépendantes, détails en dialogue, transmission explicite au formulaire de contact existant. Pas de faux envoi ni de prix calculé.

Les prestations du fichier fourni restent indicatives, à valider par l’architecte. La surface 152 m² de sa maquette diffère des 148 m² de Sabai dans V5 : la surface n’est donc pas reprise dans cet exemple. Les gammes intérieures utilisent les noms validés sur l’index (Essentielle, Éveil des sens, Art de vivre) ; l’extérieur intermédiaire conserve Horizon, comme dans le configurateur fourni.
