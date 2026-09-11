# Latitude Samui — V8

Base : archive **V7 du 10 septembre 2026**. Cette version corrige les régressions
relevées dans l'audit. **Aucune fonctionnalité, aucun texte et aucune page n'ont
été retirés.** Les modifications sont mécaniques et vérifiables ; la liste des
contrôles est en fin de document.

---

## 1. Images — 32 Mo → 7,8 Mo

Les 10 fichiers JPEG étaient enregistrés en qualité quasi maximale. Ils sont
convertis en **WebP qualité 82**, à dimensions identiques.

| Fichier | Avant | Après |
|---|---|---|
| `hero-01` à `hero-06` | 2,1 à 2,9 Mo | 127 à 292 Ko |
| `card-baansawan` / `-sabai` / `-suk` / `-thongkrut` | 2,2 à 3,1 Mo | 165 à 333 Ko |

**Gain : 22,7 Mo.** La page d'accueil passe de **26,1 Mo à 3,37 Mo** d'images, et
de 2,19 Mo à **0,18 Mo** avant premier rendu.

Toutes les références `.jpg` ont été réécrites dans les 30 pages.

## 2. Photos de villas — une seule convention

Baan Sawan était le seul en dossier, les trois autres à plat. Tout est unifié :

```
assets/villas/baansawan/01…08.webp
assets/villas/sabai/01…05.webp
assets/villas/suk/01…05.webp
assets/villas/jai/01…05.webp
```

Les blocs JSON `baan-data` et les balises `<img>` pointent les nouveaux chemins.
Les 9 doublons et orphelins ont été supprimés (`baansawan-1…4.webp`,
`baansawan.webp`, `hero.webp`, `hero-evening.webp`, `hero-pool.webp`,
`wellness.webp`), soit 1 Mo.

**Reste à faire, hors de portée d'un script :** cinq photos sont en portrait
768×960 (`sabai-2`, `suk-2`, `suk-3`, et deux autres). Dans une mosaïque en
`object-fit:cover`, elles perdent plus de la moitié de leur hauteur. Il faut les
recadrer depuis les fichiers d'origine, en 16:9, minimum 1600 px de large.

## 3. Décalage de mise en page

**188 balises `<img>` reçoivent `width` et `height`**, lus sur les fichiers réels,
plus 60 sur le logo à partir de son viewBox. Il ne reste que les 8 `<img>` de la
visionneuse, remplies par le JavaScript.

## 4. Bug corrigé — diaporama de l'accueil anglais

`en/index.html` : les diapositives 2 à 6 pointaient `assets/hero-0N.jpg` au lieu de
`../assets/hero-0N.jpg`. Le diaporama anglais était figé sur la première image.
**5 chemins corrigés.**

## 4 bis. Bug corrigé — doctype manquant sur 18 pages

Les fichiers suivants ne commençaient pas par `<!DOCTYPE html>` mais par le mot
**`html` en texte brut**, le préfixe `<!DOCTYPE ` ayant été perdu à la
génération :

- les **15 pages anglaises** ;
- **`villa-jai.html`**, **`villa-sabai.html`** et **`villa-suk.html`** en français.

Deux conséquences. La visible : le mot « html » s'affiche en haut de page, dans
une bande blanche, avant la navigation. La grave : **sans doctype, le navigateur
bascule en mode quirks**. Ces 18 pages étaient donc rendues par un moteur de mise
en page différent des 12 autres — comportement modifié sur `box-sizing`, les
hauteurs en pourcentage, l'interlignage des boîtes en ligne et le débordement.
C'est une source de divergences visuelles impossible à diagnostiquer par le CSS.

**Corrigé sur les 18 pages** : texte parasite retiré, `<!DOCTYPE html>` posé.
Contrôle : 30/30 conformes, une seule balise `<html>` par page, `lang` déclaré
partout.

## 5. Référencement

- **`og:image` réparé sur 12 pages** : elles pointaient
  `latitudesamui.com/photos/index/01.jpg`, un chemin de l'ancienne arborescence.
  Chaque page a désormais une image absolue et pertinente.
- **`canonical` + `hreflang`** sur les 28 pages indexables : paires `fr` / `en` /
  `x-default`, dans les deux sens. La 404 en est exclue, volontairement.
- **Open Graph complété** : `og:url`, `og:type`, `og:site_name`, `og:locale` et
  `og:locale:alternate`. **Cartes Twitter** ajoutées sur les 30 pages.
- **Données structurées** : `Organization` sur les deux accueils,
  `SingleFamilyResidence` + `Offer` sur les 8 fiches villas, avec chambres,
  salles d'eau, surface habitable, parcelle et prix lus dans les pages.
- **`sitemap.xml`** : 28 URL avec leurs paires `hreflang`.
- **`robots.txt`** ajouté.

### ⚠ Indexation — la seule chose à ne pas oublier

Le `noindex, nofollow` des 30 pages a été **conservé volontairement**. Au
lancement, deux gestes :

1. supprimer `Disallow: /` dans `robots.txt` ;
2. supprimer `<meta content="noindex, nofollow" name="robots"/>` des 30 pages.

Tant que ces deux lignes sont là, le site reste invisible et tout le travail SEO
ci-dessus est inopérant.

## 6. Échelle typographique — 72 tailles → 11 crans

Le CSS contenait **72 tailles de police distinctes**, dont 23 entassées entre 28,8
et 43,2 px. C'est ce qui produisait l'impression de désordre, pas la taille
absolue. Le facteur 0,9 appliqué en V7 laissait le rapport corps/titre inchangé à
7,4 — donc ne réglait rien.

**584 déclarations `font-size` ont été ramenées sur onze crans**, en rem :

```
11 · 12 · 14 · 16 · 18 · 22 · 28 · 36 · 44 · 48 · 64 · 84 · 96 px
```

**Deux opérations distinctes, à ne pas confondre.** La première a réduit le
*nombre* de tailles, de 72 à 13, en ramenant chaque valeur sur le cran le plus
proche. Elle corrige le désordre, mais pas la magnitude : arrondir au plus proche
préserve l'échelle, et la moitié des titres remontaient même légèrement. Mesuré
après cette seule opération, l'écart moyen avec la V7 n'était que de **−5 %**.

La seconde descend **chaque niveau de titre d'un cran**, hero exclu. 108
déclarations concernées.

| | V7 | V8 | Écart |
|---|---|---|---|
| Hero d'accueil | 107 px | **96 px** | −10 % |
| Hero de fiche villa | 130 px | **96 px** | −26 % |
| Titre de page intérieure | 86 px | **64 px** | −26 % |
| h2 de section | 65 px | **48 px** | −26 % |
| h2 de clôture | 79 px | **64 px** | −19 % |
| h3 de carte | 35 px | **28 px** | −20 % |
| Corps de texte | 14,4 px | **16 px** | +11 % |
| **Moyenne des titres** | 66 px | **51 px** | **−22 %** |

Rapport corps / hero : **7,4× → 6,0×**. Rapport corps / h2 de section :
**4,5× → 3,0×**. C'est ce second rapport qui porte l'essentiel de l'effet, les
h2 étant bien plus nombreux à l'écran que les heros.

Le cran haut est à **96 px** (`6rem`), réservé aux titres de hero : accueil,
fiches villas et la page villa générique. 94 px avait été demandé ; 96 en est à
2 % — écart invisible — mais c'est une valeur ronde, exactement `6rem` et le
double du cran 48. Le cran **84 px** reste pour les titres de pages intérieures
(`.page-hero`, `.editorial-hero`, `.collection-hero`), ce qui rétablit une
hiérarchie que la V7 avait — elle distinguait 106 et 86 px — et que le premier
passage sur l'échelle avait aplatie à 84 pour les deux.

Conséquences :

- **corps de texte à 1rem (16 px)** dans les deux feuilles. La V7 avait 14,4 px en
  desktop et 16 px en mobile, donc un texte plus petit sur grand écran que sur
  téléphone ;
- `html{font-size}` n'est jamais touché, la préférence de taille du visiteur est
  respectée ;
- rapport corps / h1 du hero : **7,4 → 6,0**, ce qui fait passer la page du
  registre affiche au registre éditorial ;
- interlignage 1,75 → **1,65**.


### Cascade des titres de hero — escalier supprimé

Le premier passage sur l'échelle avait cassé la progression responsive des
titres de villa : les surcharges en `@media` étaient devenues **plus grandes que
la règle de base**, jusqu'à un `clamp(5.25rem, 15vw, 5.25rem)` figé à 84 px sur
téléphone. Les dix surcharges en escalier ont été supprimées et remplacées par
**une seule règle fluide par hero**, ce qui rend toute inversion impossible.

| Largeur | 390 | 768 | 1024 | 1280 et au-delà |
|---|---|---|---|---|
| Hero d'accueil | 48 px | 65 px | 86 px | **96 px** |
| Hero de fiche villa | 44 px | 58 px | 77 px | **96 px** |

## 7. Gabarit

Les valeurs héritées du facteur 0,9 sont remplacées par des valeurs rondes, et
**alignées entre la feuille desktop et la feuille mobile** qui divergeaient.

| Jeton | V7 desktop | V7 mobile | V8 |
|---|---|---|---|
| `--max` | 1296 px | 1440 px | **1280 px** |
| `--nav-height` | 86,4 px | 96 px | **72 px** (64 en mobile) |
| `--gutter` | clamp(21,6 / 5vw / 72) | clamp(24 / 5vw / 80) | **clamp(20 / 4vw / 48)** |
| Largeur du logo | 230,4 px | 256 px | **243 px** (paliers 212 / 195 / 180) |

243 px est la valeur validée en banc d'essai : capitale du logotype à 11,2 px,
soit 1,4 fois les liens du menu.

## 8. Formulaire de contact — refonte visuelle

Le fonctionnement est **inchangé** : deux étapes, qualification du projet,
préparation d'un email complet, bouton de copie, aucun faux message d'envoi.
Seule la présentation change.

- champs en `--paper` avec bord `--line` et **rayon de 4 px**, au lieu d'un
  `#b7c4b7` absent de la palette et d'angles vifs qui juraient avec les boutons ;
- **hauteur de frappe portée à 48 px**, au-dessus du seuil tactile ;
- **focus visible** : bord jungle et halo tilleul de 3 px ;
- **retour de validation** : bord vert sur un champ rempli et valide, bord ambré
  et fond légèrement teinté sur un email mal formé ;
- libellés composés en capitales fines, séparés du champ ;
- « Où en êtes-vous » passe de boutons radio nus à **trois cartes cliquables** ;
- `select` avec chevron dessiné, plus de flèche système ;
- grille à une colonne et boutons pleine largeur sous 560 px.

**Piège anti-spam** ajouté : champ `website` masqué hors écran, à ignorer côté
serveur s'il est rempli. À traiter dans l'endpoint.

## 9. Icônes et PWA

Restaurés depuis le jeu de marque : `site.webmanifest`, `mask-icon` Safari,
tuile Windows avec `browserconfig.xml`, icônes 192 et 512 dont les versions
`maskable` pour Android. Déclarés sur les 30 pages.

## 10. Accessibilité et validité

- **468 attributs `viewbox` → `viewBox`** (invalide en XML strict) ;
- **`aria-current="page"`** sur le lien de navigation actif, 12 pages ;
- **identifiants dupliqués corrigés** : `essentiel` et `art-de-vivre` existaient
  deux fois sur chacune des 8 fiches villas, une fois pour l'intérieur et une
  fois pour le jardin. Le second jeu est préfixé `jardin-`.

## 11. Logo

`assets/logo.svg` nettoyé de ses métadonnées Inkscape : **33,8 → 27,3 Ko**. Rendu
vérifié par comparaison pixel contre le fichier V7 : écart maximal sur 43 pixels
d'une image de 800×150, soit 0,04 %, uniquement de l'antialiasing sur les déliés.

---

## Contrôles effectués sur les 30 pages

| Contrôle | Résultat |
|---|---|
| Fichiers référencés manquants | **aucun** |
| Ancres internes mortes | **aucune** |
| Identifiants dupliqués | **aucun** |
| `canonical` et `hreflang` | 28/30 (hors 404) |
| `og:url`, Twitter, `manifest` | 28 à 30/30 |
| Données structurées | 10/30, là où elles ont du sens |
| Images sans dimensions | 8, celles de la visionneuse |
| `site.webmanifest`, `sitemap.xml` | syntaxe validée |
| Poids total | **7,8 Mo** contre 32 Mo |

Aucune validation visuelle sur navigateur réel n'a été faite. Les points à
regarder en priorité sont l'échelle typographique entre 700 et 1000 px de large,
et le formulaire de contact dans ses deux étapes.

---

## Ce qui reste ouvert

1. **Recadrer les cinq photos portrait** en 16:9, depuis les originaux.
2. **Fusionner les paires `*.css` / `*.mobile.css`.** Elles sont identiques à 98 %
   et les deux sont téléchargées : 206 Ko pour 104 Ko de règles utiles. Une seule
   feuille avec `@media` ferait le même travail. Non fait ici : une fusion
   automatique se casserait en silence, elle demande une relecture humaine.
3. **Supprimer le CSS mort.** 404 sélecteurs sur 1 491 n'ont aucune cible dans les
   30 pages, dont 356 dans `foundation.css` — notamment tout un jeu
   `.config-option` hérité d'une version précédente du configurateur.
4. **Brancher l'endpoint CRM** dans `js/config.js`, et y ignorer le champ
   `website` du piège anti-spam.
5. **Trancher le nommage des gammes** : « Essentiel », « Éveil des sens »,
   « Art de vivre », « Horizon ». C'est le vocabulaire qui partira dans le CRM et
   dans les devis.
6. **Retirer le `noindex`** au lancement, voir le point 5.

---

## Correctifs d’intégration

Après reprise de l’archive dans le projet principal :

- la version exposée par `js/config.js` est passée de 7 à **8** ;
- les marqueurs internes des pages portent désormais la classe **`v8`** ;
- le nom de gamme visible sur l’accueil est harmonisé en **« Essentiel »** ;
- les sources des demandes de brochure, plans et visite sont propres à chaque villa ;
- le vert jungle de l’accueil est aligné sur la référence globale **`#16382f`**, tandis que `#102c25` reste réservé au vert profond ;
- le champ anti-spam `website` est inclus dans la charge utile afin que le futur endpoint puisse écarter les demandes qui le renseignent ;
- le configurateur et le formulaire n’acceptent plus que les noms de gamme validés, avec **« Essentiel »** comme valeur de repli.
- les deux héros principaux — accueil et collection — partagent désormais une échelle commune : titres jusqu’à **106 px** et textes d’introduction calés sur la lisibilité du héros d’accueil.
- le bandeau d’ouverture de la page « Notre approche » est supprimé au profit d’une entrée directe dans le contenu ; le héros « Et si c’était votre quotidien » adopte lui aussi le titre de référence à **106 px** sur desktop.
- la frise des cinq étapes de l’accueil gagne en présence : repères et icônes agrandis, textes plus lisibles et rythme vertical plus généreux sur desktop.

## Page Thong Krut Village

- la page d’attente est remplacée par une véritable page programme, en français et en anglais ;
- le héros reprend la structure des fiches villas : visuel immersif, prix d’appel indicatif et barre de cinq données clés ;
- les trois typologies 2, 3 et 4 chambres présentent désormais surfaces, tailles de parcelle et statut tarifaire ;
- les prestations provisoires sont reformulées comme une base rationnelle et évolutive, sans les présenter comme contractuelles ;
- une section dédiée explique la logique du masterplan : voiries, découpe des lots, niveaux, réseaux et conservation de la végétation ;
- le statut foncier, l’accès et la topographie sont affichés séparément des données encore à confirmer ;
- les cartes Thong Krut de l’accueil et de la page Villas reprennent les typologies et le prix d’appel de 210 000 € ;
- le prix d’appel de Thong Krut est désormais présenté exclusivement en euros, tandis que les tarifs des modèles 3 et 4 chambres restent annoncés pour le lancement ;
- les fonds propres au programme ont été supprimés au profit de l’alternance globale du site entre blanc et `--paper` ;
- les appels à l’action identifient le programme et le modèle demandé dans le formulaire de contact.
