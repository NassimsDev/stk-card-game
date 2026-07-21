# Nature's Blueprint — STK Architecture

Jeu de cartes digital sur le biomimétisme, conçu pour STK Architecture.  
Application web sans backend, jouable depuis n'importe quel navigateur.

---

## Le projet

Bloom est un jeu d'association de cartes pédagogique : le joueur doit relier un élément naturel (*Inspiration*) à l'innovation humaine qui s'en inspire (*Innovation*). Le jeu couvre 21 paires biomimétiques réparties en 3 séquences, des nageoires de baleine aux éoliennes, en passant par la termitière et le Eastgate Building.

Adapté d'un jeu physique existant pour le cabinet STK Architecture, la version digitale ajoute animations, feedback sonore, système d'indices, traduction en 3 langues et déploiement continu.

---

## État actuel — fonctionnalités

### Fonctionnel

| Fonctionnalité | État |
|---|---|
| Écran d'accueil animé (48 cartes en fond) | Terminé |
| Onboarding 3 slides avec vidéos | Terminé |
| Sélection des cartes (clic + drag & drop, + carrousel tactile sur mobile) | Terminé |
| Validation d'une paire (animation correcte/incorrecte) | Terminé |
| Système d'indices (bouton `?` par carte) | Terminé |
| Feedback sonore (6 effets + 3 pistes de fond) | Terminé |
| Sélecteur d'ambiance sonore (Oiseaux / Pluie / Fleuve) | Terminé |
| Bouton mute (persistant, position fixe) | Terminé |
| Affichage de l'explication biomimétique après bonne réponse | Terminé |
| Piste d'observation après mauvaise réponse | Terminé |
| 3 séquences avec écrans de transition | Terminé |
| Écran de fin avec récap et lien STK | Terminé |
| Responsive (laptop + hauteurs réduites) | Terminé |
| **Ma collection** — overlay listant les paires déjà trouvées (relecture des explications), CTA en haut à droite du header sur desktop, swipe depuis le bord droit sur mobile | Terminé |
| Coupure/reprise automatique du son en arrière-plan (écran verrouillé, changement d'onglet/d'appli, via l'API Page Visibility) | Terminé |
| Mélange du carrousel mobile garanti sans jamais placer les 2 cartes d'une même paire côte à côte | Terminé |
| Vibration mobile (`navigator.vibrate`) en complément du son sur une mauvaise réponse — non supporté par Safari/iOS (limitation WebKit, tous navigateurs confondus) | Terminé |
| **Traduction FR / EN / TR** — bouton de cycle en bas à gauche, textes d'interface + contenu des 21 paires + visuels de cartes par langue, préchargement en arrière-plan des langues non actives | Terminé |
| **Revoir les explications** — bouton `?` dans le header de GameRound, réaffiche l'onboarding en overlay sans perdre la progression de la séquence en cours | Terminé |

### À nettoyer avant livraison

| Élément | Situation |
|---|---|
| Raccourcis dev `Shift+F` (écran de fin), `Shift+D` (séquence 2), `Shift+T` (séquence 3) | Présents dans `App.jsx`, à retirer avant livraison |

---

## Contenu — les 21 paires

| # | Inspiration | Innovation | Thème |
|---|---|---|---|
| 1 | Aile de papillon | Panneaux solaires | Thermorégulation |
| 2 | Nageoires de baleine | Éoliennes | Aérodynamisme |
| 3 | Bec du martin-pêcheur | TGV japonais | Aérodynamisme |
| 4 | Patte de gecko | Adhésif Geckskin | Adhésion |
| 5 | Fruit de bardane | Velcro | Fixation |
| 6 | Coquille de nautile | Turboréacteurs | Aérodynamisme |
| 7 | Peau de requin | Combinaison de natation | Hydrodynamique |
| 8 | Papillon Greta oto | Verre antireflet | Optique |
| 9 | Scarabée du Namib | Filets capteurs de rosée | Hydrologie |
| 10 | Cicatrisation cutanée | Béton auto-réparant | Matériaux |
| 11 | Éponge panier de Vénus | 30 St Mary Axe | Structure |
| 12 | Feuille de lotus | Surfaces hydrophobes | Surfaces |
| 13 | Corail | Ciment bas carbone | Matériaux |
| 14 | Luciole | Lampes LED | Optique |
| 15 | Trompe de moustique | Aiguille médicale indolore | Médecine |
| 16 | Manchots empereurs | Logements District 11 | Thermorégulation |
| 17 | Termitière | Bâtiment Eastgate | Thermorégulation |
| 18 | Moule | Adhésif fort | Adhésion |
| 19 | Zèbre | Camouflage Dazzle | Camouflage |
| 20 | Orchidée | Gardens by the Bay | Architecture |
| 21 | Os humain | Tour Eiffel | Structure |

Titres, descriptions et visuels ci-dessus en français — voir [Internationalisation](#internationalisation-fr--en--tr) pour l'anglais et le turc.

---

## Internationalisation (FR / EN / TR)

Le jeu est jouable en français, anglais et turc. Pas de librairie i18n : un système maison léger, pensé pour ne jamais dupliquer `pairs.json` en entier par langue.

### Le bouton de langue

En bas à gauche de l'écran, un bouton unique fait défiler les langues en boucle :

```
FR → EN → TR → FR → ...
```

Il affiche toujours la **prochaine** langue du cycle (`NEXT_LANG_LABEL` dans `App.jsx`). La langue choisie est mémorisée dans `localStorage` (`stk-lang`) et restaurée à la prochaine visite.

### Deux sources de texte différentes

| Contenu | Fichier | Mécanisme |
|---|---|---|
| Interface (boutons, onboarding, écrans de transition/fin, indices...) | `src/i18n/strings.js` | Un objet `{ fr: {...}, en: {...}, tr: {...} }`, une entrée par clé ; `t('gameRound.link')` lit la clé dans la langue active |
| Contenu des 21 paires (titres, descriptions, explications, thème) | `src/data/pairs.json` | Le français reste les champs de base (`title`, `shortDescription`...) ; chaque paire porte en plus un bloc additif `translations.en` et `translations.tr` avec les mêmes clés. `localizePair(pair, lang)` (dans `gameRound.constants.js`) fusionne les overrides par-dessus le français à la volée — jamais de duplication du fichier |

### Visuels des cartes

Les cartes anglaises et turques ont le texte intégré à l'image (pas de calque de texte séparé), donc chaque langue a son propre jeu d'images :

```
public/assets/cards/{french|english|turkish}/{inspiration|innovation|glow}/card-xxx-01.webp
```

Le champ `image` de chaque paire pointe vers la version française ; les blocs `translations.en.*.image` / `translations.tr.*.image` pointent vers les dossiers `english`/`turkish` correspondants. `getGlowPath(type, id, lang)` fait la même bascule pour les halos lumineux.

### Préchargement en arrière-plan

Au montage de l'app, `LangProvider` précharge (via `requestIdleCallback`, donc sans ralentir le chargement initial) les visuels des **langues non actives**. Résultat : la première bascule de langue est instantanée, sans attendre le téléchargement des images.

### Ajouter une langue

1. Ajouter un bloc dans `strings.js` (copier `en`, tout traduire).
2. Ajouter un bloc `translations.<code>` par paire dans `pairs.json` (copier `translations.en`, tout traduire, adapter les chemins d'image).
3. Créer `public/assets/cards/<dossier>/{inspiration,innovation,glow}/` avec les visuels (au minimum des copies du français en attendant les vrais visuels).
4. Ajouter le code langue à `LANG_CYCLE` (`LangContext.jsx`) et à `LANG_FOLDERS` (`gameRound.constants.js` + `preloadCardImages.js`).
5. Ajouter le libellé du bouton à `NEXT_LANG_LABEL` (`App.jsx`).

---

## Parcours de jeu

```
Écran d'accueil
      ↓ "Commencer l'exploration"
Onboarding (3 slides tutoriel)
      ↓ "Commencer"
Séquence 1 — 8 paires
      ↓ fin de séquence
Transition → Séquence 2 — 8 paires
      ↓ fin de séquence
Transition → Séquence 3 — 5 paires
      ↓ fin de séquence
Écran de fin (récap + lien STK)
```

À chaque paire :
- Sélection d'une carte Inspiration + une carte Innovation
- Clic "Lier" → animation correcte (glow + explication) ou incorrecte (shake + piste d'observation)
- Possibilité d'afficher un indice (`?`) avant de valider

Dès la première paire trouvée (dans la séquence en cours, ou héritée d'une séquence précédente), un CTA **"Ma collection"** apparaît en haut à droite du header (desktop) — sur mobile, une languette sur le bord droit s'ouvre au tap ou au swipe. L'overlay liste toutes les paires découvertes avec leur explication biomimétique, pour pouvoir les relire à tout moment sans interrompre la partie.

---

## Structure du projet

```
stk/
├── public/
│   └── assets/
│       ├── cards/
│       │   ├── french/
│       │   │   ├── inspiration/ # 21 images WebP
│       │   │   ├── innovation/  # 21 images WebP
│       │   │   └── glow/        # 42 overlays lumineux
│       │   ├── english/         # même structure, visuels anglais (texte intégré aux images)
│       │   └── turkish/         # même structure, visuels turcs
│       ├── sounds/              # 6 effets + 3 pistes de fond (ambiance)
│       └── videos/              # intro, réussite, échec
├── src/
│   ├── components/
│   │   ├── AmbientSelector/     # Sélecteur de piste de fond (Oiseaux/Pluie/Fleuve)
│   │   ├── Button/
│   │   ├── CardGrid/            # Grilles desktop (colonnes Inspiration / Innovation)
│   │   ├── CardSlot/            # Emplacements centraux (carte sélectionnée + indice)
│   │   ├── CarouselSection/     # Carrousel mobile (Swiper, arc radial)
│   │   ├── CollectionOverlay/   # "Ma collection" — relecture des paires trouvées
│   │   └── Logo/                # Logo STK cliquable (retour à l'accueil)
│   ├── data/
│   │   └── pairs.json           # Source de vérité — 21 paires + traductions EN/TR par paire
│   ├── hooks/
│   │   └── useBackgroundAudio.js # Coupe/reprend le son selon la visibilité de l'onglet
│   ├── i18n/
│   │   ├── strings.js           # Textes d'interface FR/EN/TR (hors contenu des paires)
│   │   ├── LangContext.jsx      # Provider : langue active, cycle FR→EN→TR, préchargement
│   │   ├── useLang.js           # Hook de lecture (lang, t(), toggleLang, setLang)
│   │   └── preloadCardImages.js # Warm-up des visuels des langues non actives
│   ├── pages/
│   │   ├── LandingScreen/       # Écran d'accueil
│   │   ├── OnboardingScreen/    # Onboarding 3 slides (aussi réutilisé en overlay de révision)
│   │   └── GameRound/           # Écran de jeu principal (+ useGameRound.js, le reducer de jeu)
│   ├── utils/
│   │   └── soundManager.js      # Singleton audio
│   ├── styles/
│   │   └── variables.css
│   └── App.jsx                  # Machine d'état principale
```

---

## Stack technique

| Technologie | Rôle |
|---|---|
| React 19 + Vite | Framework UI et bundler |
| Framer Motion | Animations (cartes, transitions, feedback) |
| Swiper | Carrousel tactile mobile (arc radial de cartes) |
| CSS Modules | Styles par composant |
| useReducer + useState | Gestion d'état, locale à chaque écran (pas de state global) |
| Context API (`LangContext`) | Langue active + fonction `t()`, système i18n maison FR/EN/TR |
| pairs.json | Données du jeu — jamais hardcodées dans le code |
| Netlify | Hébergement avec déploiement continu depuis GitHub |

---

## Lancer le projet

```bash
npm install
npm run dev       # localhost:5173
npm run build     # build production
npm run preview   # prévisualiser le build
```

---

## Modifier le contenu

Toutes les données du jeu sont dans [src/data/pairs.json](src/data/pairs.json).  
Modifier une paire, corriger un texte ou ajouter une carte ne nécessite aucune modification du code.



Les images des cartes sont dans `public/assets/cards/{french|english|turkish}/` au format WebP.  
Le chemin dans le JSON doit correspondre exactement au nom du fichier, pour la bonne langue.

Les textes d'interface (hors contenu des paires) sont dans [src/i18n/strings.js](src/i18n/strings.js),dans les 3 langues.

---

## Déploiement

Chaque push sur la branche `main` déclenche automatiquement un nouveau build sur Netlify.  
Le jeu est servi en HTTPS sans configuration supplémentaire.

---

*Nature's Blueprint — STK Architecture © 2026*
