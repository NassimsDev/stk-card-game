# Nature's Blueprint — STK Architecture

Jeu de cartes digital sur le biomimétisme, conçu pour STK Architecture.  
Application web sans backend, jouable depuis n'importe quel navigateur.

---

## Le projet

Nature's Blueprint est un jeu d'association de cartes pédagogique : le joueur doit relier un élément naturel (*Inspiration*) à l'innovation humaine qui s'en inspire (*Innovation*). Le jeu couvre 21 paires biomimétiques réparties en 3 séquences, de la nageoire de baleine aux éoliennes WhalePower, en passant par la termitière et le bâtiment Eastgate.

Adapté d'un jeu physique existant de STK Architecture, la version digitale ajoute animations, feedback sonore, système d'indices et déploiement continu.

---

## État actuel — fonctionnalités

### Fonctionnel

| Fonctionnalité | État |
|---|---|
| Écran d'accueil animé (44 cartes en fond) | Terminé |
| Onboarding 3 slides avec vidéos | Terminé |
| Sélection des cartes (clic + drag & drop) | Terminé |
| Validation d'une paire (animation correcte/incorrecte) | Terminé |
| Système d'indices (bouton `?` par carte) | Terminé |
| Feedback sonore (6 effets + musique de fond) | Terminé |
| Bouton mute (persistant, position fixe) | Terminé |
| Affichage de l'explication biomimétique après bonne réponse | Terminé |
| Piste d'observation après mauvaise réponse | Terminé |
| 3 séquences avec écrans de transition | Terminé |
| Écran de fin avec récap et lien STK | Terminé |
| Responsive (laptop + hauteurs réduites) | Terminé |

### Présent dans le code mais inactif

| Élément | Situation |
|---|---|
| `GameContext.jsx` + `useGame.js` | Définis, non utilisés — la logique est gérée localement dans `GameRound` |
| `GameScreen` page | Existante, non branchée dans le routing |
| `CardGrid`, `CardPreview`, `SequenceIndicator` | Composants existants, non utilisés dans le rendu actuel |
| `LandingScreen copy/` | Dossier doublon à supprimer |
| `react-router-dom` | Installé, jamais importé |
| Raccourci dev `Shift+F` (saut vers fin) | Présent dans `App.jsx`, à retirer avant livraison |

---

## Contenu — les 21 paires

| # | Inspiration | Innovation | Thème |
|---|---|---|---|
| 1 | Aile de papillon | Panneaux solaires | Thermorégulation |
| 2 | Nageoires de baleine | Éoliennes WhalePower | Aérodynamisme |
| 3 | Bec du martin-pêcheur | TGV japonais | Aérodynamisme |
| 4 | Patte de gecko | Adhésif Geckskin | Adhésion |
| 5 | Fruit de bardane | Velcro | Fixation |
| 6 | Coquille de nautile | Turboréacteurs | Aérodynamisme |
| 7 | Peau de requin | Combinaison de natation | Hydrodynamisme |
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

---

## Structure du projet

```
stk-card-game/
├── public/
│   └── assets/
│       ├── cards/
│       │   ├── inspiration/     # 21 images WebP
│       │   ├── innovation/      # 21 images WebP
│       │   └── glow/            # 42 overlays lumineux
│       ├── sounds/              # 6 effets + musique de fond
│       └── videos/              # intro, réussite, échec
├── src/
│   ├── components/
│   │   ├── Button/
│   │   ├── CardGrid/
│   │   ├── CardPreview/
│   │   ├── GameRound.jsx        # Composant central du jeu
│   │   ├── Logo/
│   │   ├── MiniCard/
│   │   └── SequenceIndicator/
│   ├── context/
│   │   └── GameContext.jsx      # Context API (défini, non utilisé)
│   ├── data/
│   │   └── pairs.json           # Source de vérité — 21 paires
│   ├── hooks/
│   │   └── useGame.js           # Hook custom (défini, non utilisé)
│   ├── pages/
│   │   ├── LandingScreen/       # Écran d'accueil
│   │   ├── UnboardingScreen/    # Onboarding 3 slides
│   │   └── GameScreen/          # Page non branchée
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
| CSS Modules | Styles par composant |
| Context API + useState | Gestion d'état (local dans GameRound) |
| pairs.json | Données du jeu — jamais hardcodées dans le code |
| Vercel | Hébergement avec déploiement continu depuis GitHub |

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

Les images des cartes sont dans `public/assets/cards/` au format WebP.  
Le chemin dans le JSON doit correspondre exactement au nom du fichier.

---

## Déploiement

Chaque push sur la branche `main` déclenche automatiquement un nouveau build sur Vercel.  
Le jeu est servi en HTTPS sans configuration supplémentaire.

---

*Nature's Blueprint — STK Architecture © 2026*
