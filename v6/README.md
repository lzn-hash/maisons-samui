# Latitude Samui — index V6

Scope: homepage only, in French. Other destinations link to the existing V5 pages.

- V4 hero retained (six original photos, copy, typography, controls and motion).
- V4 villa mosaic retained, with consistent price asterisks and the Essentielle explanation.
- Complete approved logo copied byte for byte from V5.
- White mobile menu, V5 navigation structure without the boutique, keyboard controls and reduced-motion support.
- V5 editorial sections, titles approximately 10% larger and body copy 10–12% larger on desktop; restrained increase on mobile.
- Intro mission, personalisation title, team title and journey title/introduction follow the agreed copy. Step descriptions remain V5, with V4 icons.
- Contact details overlay the left photo. Telephone is explicitly a placeholder pending a real number.
- Chat styles the actual Odoo launcher. Its visibility and click behavior remain owned by Odoo; no unconditional fake chat button is created.
- The existing contact form still prepares an email unless its existing integration hooks are configured.

The three collection names are Essentielle, Éveil des sens and Art de vivre. Detailed option contents remain subject to the architects’ proposal.

Run `python3 v6/build.py` from the repository root. It uses the existing V5 generator and frozen V4 references to generate only `v6/index.html` and supporting files. Source assets in `v6/assets` are originals, not regenerated imagery. Run with `--stage` in the Sites checkout to copy the homepage into `dist/v6`, adapting links to the V5 routes already hosted at the root. The original V5 is unchanged.

Validation: static HTML/assets/link checks, preservation checks for hero/cards/logo, JavaScript syntax and targeted native-launcher integration checks. No browser QA or real contact messages are sent as part of this change.
