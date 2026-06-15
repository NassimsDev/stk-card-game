# 🎯 MEGA PROMPT — Nouvelle conversation Claude (Architecture STK Game)

> Document à copier-coller tel quel dans une nouvelle conversation Claude pour repartir sur l'architecture technique sans contexte préalable.

---

## 📋 Partie 1 — Le méga prompt (à copier-coller)

```
Tu es mon CTO virtuel et Lead Front-end React senior.

CONTEXTE PROJET :
Je développe avec mon équipe (2 devs débutants React + 2 designers) un jeu de cartes digital pour le client STK Architecture, une agence d'architecture bio-inspirée. Le jeu existe en version physique et doit être adapté en version web.

CONCEPT DU JEU :
- 22 paires de cartes (44 cartes au total)
- Chaque paire associe une carte "Inspiration" (élément du vivant : baleine, lotus, gecko, papillon...) et une carte "Innovation" (application humaine inspirée : éoliennes, surface hydrofuge, adhésif, panneaux solaires...)
- Le joueur doit trouver les bonnes associations entre Inspiration et Innovation
- Le but pédagogique est de comprendre le biomimétisme

PARCOURS UTILISATEUR (plusieurs écrans, plusieurs rounds) :
1. ÉCRAN D'INTRO/ACCUEIL : animation des cartes qui tournent en arrière-plan (mouvement organique, sensation de respiration), titre "Associer le vivant à l'innovation", sous-texte "Observez les cartes, identifiez les liens, puis révélez les principes du biomimétisme", bouton "Commencer l'exploration"

2. ÉCRAN DE JEU (RÉPÉTÉ POUR CHAQUE ROUND/SÉQUENCE) :
   - Indicateur "Séquence X/Y" en haut à droite
   - Logo STK en haut à gauche
   - Grilles de cartes/carrés visuels à gauche et à droite (indicateur de progression)
   - 2 cartes au centre : une Inspiration (gauche) + une Innovation (droite)
   - Texte sous chaque carte avec un titre court + sous-titre ("Inspiration" / "Innovation")
   - Boutons d'action : "Lier" (valider la paire), "Réessayer" si erreur, "Suivant" pour passer
   - Flèches gauche/droite pour naviguer entre les cartes d'un même round

3. ÉCRAN DE PISTE D'OBSERVATION (en cas d'erreur ou avant lien) :
   - Affiche les 2 cartes choisies
   - Titre "Piste d'observation"
   - Petit texte explicatif "Observez comment une forme peut réduire l'effort d'un mouvement"
   - Bouton "Réessayer"

4. ÉCRAN D'EXPLICATION / RÉUSSITE :
   - Affiche les 2 cartes liées
   - Titre "Le lien biomimétique"
   - Texte pédagogique expliquant le lien entre Inspiration et Innovation
   - Bouton "Suivant" pour passer au round suivant

5. ÉCRAN DE FIN :
   - Message de félicitations
   - Récapitulatif des liens découverts
   - Bouton "Recommencer"

LOGIQUE DE ROUNDS :
- Les 22 paires sont réparties en plusieurs séquences/rounds (par exemple 4 rounds de 5-6 paires)
- À l'intérieur d'un round, le joueur enchaîne les paires une par une
- Quand un round est terminé, on passe au suivant
- L'écran de jeu est le MÊME composant à chaque round, seules les données changent

CONTRAINTES TECHNIQUES :
- Stack : React 18 + Vite (déjà initialisés)
- Pas de TypeScript (équipe débutante)
- Pas de backend, données dans un JSON local
- State management : Context API + useReducer (pas de Redux, pas de Zustand)
- Styles : CSS Modules
- Animations : Framer Motion
- Routing simple via un state currentScreen (pas de react-router)
- Déploiement : Vercel
- Sprint d'urgence de 2 jours (mais on veut du code propre et scalable malgré tout)

PUBLIC CIBLE : enfants 8+, grand public, clients de l'agence, écoles.

DA / UI :
- Univers sobre, organique, élégant (cf. site STK Architecture)
- Couleurs naturelles : beige cassé (#f1eee7), verts doux, bleus profonds
- Pas d'esthétique enfantine ou trop ludique
- Animations douces, mouvements de respiration, transitions lentes

MA DEMANDE :
Propose-moi une architecture React COMPLÈTE et PROFESSIONNELLE pour ce projet.

Je veux :

1. ARBORESCENCE COMPLÈTE du projet
   - Structure des dossiers (components/, screens/, hooks/, context/, data/, utils/, animations/, styles/, assets/)
   - Justification de chaque dossier
   - Convention de nommage des fichiers

2. LISTE EXHAUSTIVE DES COMPOSANTS à créer
   - Pour chaque composant : son rôle, ses props attendues, ses dépendances
   - Distinction claire entre composants atomiques (Card, Button) et composants d'écran (HomeScreen, GameScreen)
   - Distinction logique vs UI

3. SCHÉMA DU MODÈLE DE DONNÉES JSON
   - Structure des paires
   - Structure des rounds/séquences
   - Champs nécessaires pour chaque carte (title, subtitle, image, description, explanation, etc.)

4. ÉTAT GLOBAL (Context + useReducer)
   - État initial complet
   - Liste des actions du reducer (avec types)
   - Hook custom useGame() exposant les actions et l'état

5. FLUX UTILISATEUR EN CODE
   - Comment on passe d'un écran à l'autre
   - Comment on gère la sélection d'une carte
   - Comment on gère la validation d'une paire
   - Comment on enchaîne les rounds

6. ANIMATIONS RECOMMANDÉES
   - Quelles animations à quel endroit
   - Quels variants Framer Motion réutilisables

7. ANTI-PATTERNS À ÉVITER
   - Quelles erreurs courantes ne PAS faire avec cette architecture

8. EXEMPLE DE CODE pour les 3 pièces les plus importantes :
   - Le GameContext + reducer
   - Le hook useGame
   - Un écran (GameScreen) qui orchestre Card + Button + ProgressIndicator

Sois ULTRA précis, professionnel, et donne-moi quelque chose que je puisse directement transmettre à mes développeurs. Pense scalabilité, lisibilité, maintenabilité. L'équipe est junior donc le code doit être limpide et bien commenté.

Si tu as besoin d'informations supplémentaires (par exemple : combien de rounds exactement, est-ce que les paires sont mélangées, est-ce qu'on garde la progression, etc.) pose-moi les questions AVANT de me donner l'architecture.
```

---

## 🏗️ Partie 2 — Architecture type proposée (référence)

Voici ce que tu peux *t'attendre* à recevoir comme réponse, pour que tu valides en amont la direction. C'est aussi la version que je te recommande comme **architecture cible**.

### 2.1 Arborescence complète

```
stk-game/
├── public/
│   └── assets/
│       └── cards/                     # Images des cartes (webp optimisé)
│           ├── inspiration/
│           │   ├── baleine.webp
│           │   ├── lotus.webp
│           │   └── ...
│           └── innovation/
│               ├── eoliennes.webp
│               ├── surface-hydrofuge.webp
│               └── ...
│
├── src/
│   ├── components/                    # COMPOSANTS RÉUTILISABLES (atomiques)
│   │   ├── Card/
│   │   │   ├── Card.jsx               # La carte (image + titre + sous-titre)
│   │   │   ├── Card.module.css
│   │   │   └── index.js
│   │   ├── Button/
│   │   │   ├── Button.jsx             # Bouton générique (Lier, Réessayer, Suivant)
│   │   │   ├── Button.module.css
│   │   │   └── index.js
│   │   ├── ProgressIndicator/
│   │   │   ├── ProgressIndicator.jsx  # Les grilles de carrés à gauche/droite
│   │   │   ├── ProgressIndicator.module.css
│   │   │   └── index.js
│   │   ├── SequenceCounter/
│   │   │   ├── SequenceCounter.jsx    # "Séquence 1/4" en haut à droite
│   │   │   ├── SequenceCounter.module.css
│   │   │   └── index.js
│   │   ├── Logo/
│   │   │   ├── Logo.jsx               # Logo STK
│   │   │   ├── Logo.module.css
│   │   │   └── index.js
│   │   ├── NavArrows/
│   │   │   ├── NavArrows.jsx          # Flèches gauche/droite (navigation cartes)
│   │   │   ├── NavArrows.module.css
│   │   │   └── index.js
│   │   ├── FloatingCards/
│   │   │   ├── FloatingCards.jsx      # L'animation de cartes qui flottent (Home)
│   │   │   ├── FloatingCards.module.css
│   │   │   └── index.js
│   │   └── Layout/
│   │       ├── Layout.jsx             # Wrapper global (logo + counter + contenu)
│   │       ├── Layout.module.css
│   │       └── index.js
│   │
│   ├── screens/                       # ÉCRANS DU JEU (pages)
│   │   ├── HomeScreen/
│   │   │   ├── HomeScreen.jsx         # Écran d'intro avec cartes qui flottent
│   │   │   ├── HomeScreen.module.css
│   │   │   └── index.js
│   │   ├── GameScreen/
│   │   │   ├── GameScreen.jsx         # Écran de jeu (le coeur du jeu, réutilisé à chaque round)
│   │   │   ├── GameScreen.module.css
│   │   │   └── index.js
│   │   ├── ObservationScreen/
│   │   │   ├── ObservationScreen.jsx  # "Piste d'observation" en cas d'erreur
│   │   │   ├── ObservationScreen.module.css
│   │   │   └── index.js
│   │   ├── ExplanationScreen/
│   │   │   ├── ExplanationScreen.jsx  # "Le lien biomimétique" écran de réussite
│   │   │   ├── ExplanationScreen.module.css
│   │   │   └── index.js
│   │   └── EndScreen/
│   │       ├── EndScreen.jsx          # Écran de fin / félicitations
│   │       ├── EndScreen.module.css
│   │       └── index.js
│   │
│   ├── context/                       # ÉTAT GLOBAL
│   │   ├── GameContext.jsx            # Provider + Context
│   │   └── gameReducer.js             # Reducer (logique des actions)
│   │
│   ├── hooks/                         # HOOKS CUSTOM
│   │   ├── useGame.js                 # API publique du state (actions + getters)
│   │   ├── useScreenTransition.js     # Gestion des transitions d'écran
│   │   └── useLocalStorage.js         # (V2) persistence
│   │
│   ├── utils/                         # HELPERS PURS (zéro React)
│   │   ├── matchPair.js               # Vérifie si 2 cartes forment une paire
│   │   ├── shuffleArray.js            # Shuffle (Fisher-Yates) pour l'ordre des cartes
│   │   ├── getRoundProgress.js        # Calcule la progression d'un round
│   │   └── constants.js               # Constantes (SCREENS, ACTION_TYPES, etc.)
│   │
│   ├── animations/                    # VARIANTS FRAMER MOTION RÉUTILISABLES
│   │   ├── cardVariants.js            # Animations des cartes (entrée, hover, selected)
│   │   ├── screenVariants.js          # Transitions d'écran (fade, slide)
│   │   ├── floatingVariants.js        # L'animation de la home (cartes qui flottent)
│   │   └── feedbackVariants.js        # Validation correcte / incorrecte (shake, pulse)
│   │
│   ├── data/
│   │   ├── pairs.json                 # Les 22 paires + métadonnées rounds
│   │   └── rounds.js                  # (optionnel) logique de découpage en rounds
│   │
│   ├── styles/                        # CSS GLOBAUX
│   │   ├── variables.css              # Tokens design (couleurs, typo, espacements)
│   │   ├── reset.css                  # Reset CSS basique
│   │   ├── typography.css             # Règles typo globales
│   │   └── global.css                 # Import des 3 ci-dessus + base body/html
│   │
│   ├── App.jsx                        # Routing simple (switch sur currentScreen) + GameProvider
│   └── main.jsx                       # Entry point (ReactDOM.render)
│
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── index.html
├── package.json
├── vite.config.js                     # Avec alias @ → /src
└── README.md
```

### 2.2 Liste des composants détaillée

#### Composants atomiques (réutilisables)

| Composant | Rôle | Props principales |
|---|---|---|
| `Card` | Une carte du jeu | `variant` ('inspiration'/'innovation'), `title`, `subtitle`, `image`, `description`, `isSelected`, `isMatched`, `onClick` |
| `Button` | Bouton générique | `label`, `variant` ('primary'/'secondary'), `onClick`, `disabled` |
| `ProgressIndicator` | Grille de carrés gauche/droite | `total`, `current`, `position` ('left'/'right') |
| `SequenceCounter` | "Séquence X/Y" | `current`, `total` |
| `Logo` | Logo STK | (aucune) |
| `NavArrows` | Flèches navigation cartes | `onPrev`, `onNext`, `canPrev`, `canNext` |
| `FloatingCards` | Animation cartes flottantes Home | (aucune, autonome) |
| `Layout` | Wrapper global | `children` |

#### Composants d'écran (screens)

| Écran | Rôle | State qu'il consomme |
|---|---|---|
| `HomeScreen` | Intro avec `FloatingCards` + CTA | `startGame` action |
| `GameScreen` | **Le cœur du jeu**, MÊME composant pour CHAQUE round | `currentRound`, `currentPair`, `selectedInspiration`, `selectedInnovation`, actions |
| `ObservationScreen` | Affiche "Piste d'observation" si erreur | `selectedPair`, `resetAttempt` action |
| `ExplanationScreen` | "Le lien biomimétique" après réussite | `lastMatchedPair`, `nextPair` action |
| `EndScreen` | Fin du jeu | `restartGame` action |

### 2.3 Schéma JSON des données

```json
{
  "metadata": {
    "version": "1.0.0",
    "totalPairs": 22,
    "totalRounds": 4
  },
  "rounds": [
    {
      "id": 1,
      "label": "Séquence 1",
      "theme": "Aérodynamisme et glisse",
      "pairIds": [1, 2, 3, 4, 5, 6]
    },
    {
      "id": 2,
      "label": "Séquence 2",
      "theme": "Matériaux et adhérence",
      "pairIds": [7, 8, 9, 10, 11]
    },
    {
      "id": 3,
      "label": "Séquence 3",
      "theme": "Énergie et thermorégulation",
      "pairIds": [12, 13, 14, 15, 16, 17]
    },
    {
      "id": 4,
      "label": "Séquence 4",
      "theme": "Architecture et structure",
      "pairIds": [18, 19, 20, 21, 22]
    }
  ],
  "pairs": [
    {
      "id": 1,
      "inspiration": {
        "title": "Nageoires de baleine",
        "subtitle": "Inspiration",
        "image": "/assets/cards/inspiration/baleine.webp",
        "description": "Sa morphologie brise la résistance du courant pour glisser avec un effort minimal.",
        "alt": "Baleine à bosse nageant dans l'océan profond"
      },
      "innovation": {
        "title": "Éoliennes",
        "subtitle": "Innovation",
        "image": "/assets/cards/innovation/eoliennes.webp",
        "description": "Ces pales géantes tournent même par vent très faible grâce à leur profil unique.",
        "alt": "Pales d'éolienne avec cannelures imitant la baleine"
      },
      "explanation": {
        "title": "Le lien biomimétique",
        "body": "Les bosses sur les nageoires de la baleine créent des micro-vortex qui améliorent sa portance. Sculptées de la même façon, ces pales d'éoliennes captent le vent avec beaucoup moins de frottement.",
        "observationHint": "Observez comment une forme peut réduire l'effort d'un mouvement.",
        "source": "Whalepower, Canada"
      }
    }
  ]
}
```

### 2.4 État global — Reducer

#### État initial

```js
const initialState = {
  currentScreen: 'home',          // 'home' | 'game' | 'observation' | 'explanation' | 'end'
  currentRoundId: 1,              // round actuel
  currentPairIndex: 0,            // index de la paire dans le round
  selectedInspirationId: null,    // carte inspiration sélectionnée
  selectedInnovationId: null,     // carte innovation sélectionnée
  matchedPairIds: [],             // paires déjà trouvées
  lastAttemptStatus: null,        // null | 'correct' | 'incorrect'
  attemptsByPair: {},             // { pairId: nbAttempts }
};
```

#### Actions du reducer

| Action | Payload | Effet |
|---|---|---|
| `START_GAME` | - | Passe à l'écran `game`, round 1, paire 0 |
| `SELECT_INSPIRATION` | `id` | Mémorise l'inspiration sélectionnée |
| `SELECT_INNOVATION` | `id` | Mémorise l'innovation sélectionnée |
| `VALIDATE_PAIR` | - | Vérifie le matching, set status, ajoute à matchedPairIds si correct |
| `GO_TO_OBSERVATION` | - | Passe à l'écran observation (erreur) |
| `GO_TO_EXPLANATION` | - | Passe à l'écran explication (réussite) |
| `RESET_ATTEMPT` | - | Réinitialise les sélections, retour à game |
| `NEXT_PAIR` | - | Passe à la paire suivante (et au round suivant si fin) |
| `NEXT_ROUND` | - | Passe au round suivant |
| `FINISH_GAME` | - | Passe à l'écran end |
| `RESTART_GAME` | - | Reset complet de l'état |

### 2.5 Flux utilisateur en code

```
HomeScreen
  → user clique "Commencer l'exploration"
  → dispatch START_GAME
  → currentScreen devient 'game'

GameScreen (round 1, paire 0)
  → user clique carte Inspiration A → dispatch SELECT_INSPIRATION
  → user clique carte Innovation B → dispatch SELECT_INNOVATION
  → user clique "Lier" → dispatch VALIDATE_PAIR
      ↓
      Si A.id === B.id (matching) :
        → lastAttemptStatus = 'correct'
        → ajoute à matchedPairIds
        → dispatch GO_TO_EXPLANATION
        → ExplanationScreen affiche le lien biomimétique
        → user clique "Suivant" → dispatch NEXT_PAIR
            ↓
            Si paire suivante dispo dans le round → retour GameScreen
            Si fin du round → dispatch NEXT_ROUND → GameScreen avec nouveau round
            Si dernier round terminé → dispatch FINISH_GAME → EndScreen
      ↓
      Si A.id !== B.id (erreur) :
        → lastAttemptStatus = 'incorrect'
        → dispatch GO_TO_OBSERVATION
        → ObservationScreen affiche les 2 cartes + hint
        → user clique "Réessayer" → dispatch RESET_ATTEMPT
        → retour GameScreen avec sélections vides

EndScreen
  → user clique "Recommencer" → dispatch RESTART_GAME → HomeScreen
```

### 2.6 Animations clés

| Endroit | Animation | Tech |
|---|---|---|
| HomeScreen — fond | Cartes qui flottent en boucle | Framer Motion `animate` + loop infini sur translateY |
| Transition d'écran | Fade + léger slide | Framer Motion `AnimatePresence` |
| Card — entrée | Apparition staggered (les 2 cartes arrivent décalées) | Framer Motion `variants` + `staggerChildren` |
| Card — hover | Scale légère + ombre douce | CSS `transition` |
| Card — selected | Bordure + glow doux | CSS classes + Framer |
| Validation correcte | Glow vert + pulse + rapprochement des 2 cartes | Framer keyframes |
| Validation incorrecte | Shake horizontal court | Framer keyframes |
| ExplanationScreen | Texte qui apparaît en fade-in lent | Framer Motion |

### 2.7 Anti-patterns à éviter

1. ❌ **GameScreen qui contient toute la logique** — il doit déléguer au hook `useGame`
2. ❌ **Un composant par écran qui gère son propre state** — le state vit dans le Context
3. ❌ **Dupliquer le composant `GameScreen` pour chaque round** — c'est le MÊME composant, seules les données changent
4. ❌ **useEffect partout pour dériver des données** — utilise des variables calculées
5. ❌ **Prop drilling** — passe par le hook `useGame()` qui s'abonne au Context
6. ❌ **Hardcoder le nombre de rounds dans le code** — viens du JSON
7. ❌ **Mélanger logique métier et UI dans les composants** — la logique vit dans le reducer et les utils
8. ❌ **Animer des propriétés non-GPU** (width, top, left) — préfère transform et opacity
9. ❌ **Importer pairs.json dans chaque composant** — passe par le Context

### 2.8 Exemple de code — les 3 pièces critiques

#### `src/context/gameReducer.js`

```js
import { SCREENS, ACTION_TYPES } from '@/utils/constants';

export const initialState = {
  currentScreen: SCREENS.HOME,
  currentRoundId: 1,
  currentPairIndex: 0,
  selectedInspirationId: null,
  selectedInnovationId: null,
  matchedPairIds: [],
  lastAttemptStatus: null,
};

export function gameReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.START_GAME:
      return { ...state, currentScreen: SCREENS.GAME };

    case ACTION_TYPES.SELECT_INSPIRATION:
      return { ...state, selectedInspirationId: action.payload };

    case ACTION_TYPES.SELECT_INNOVATION:
      return { ...state, selectedInnovationId: action.payload };

    case ACTION_TYPES.VALIDATE_PAIR: {
      const isMatch =
        state.selectedInspirationId === state.selectedInnovationId;
      return {
        ...state,
        lastAttemptStatus: isMatch ? 'correct' : 'incorrect',
        matchedPairIds: isMatch
          ? [...state.matchedPairIds, state.selectedInspirationId]
          : state.matchedPairIds,
        currentScreen: isMatch ? SCREENS.EXPLANATION : SCREENS.OBSERVATION,
      };
    }

    case ACTION_TYPES.RESET_ATTEMPT:
      return {
        ...state,
        selectedInspirationId: null,
        selectedInnovationId: null,
        lastAttemptStatus: null,
        currentScreen: SCREENS.GAME,
      };

    case ACTION_TYPES.NEXT_PAIR:
      return {
        ...state,
        currentPairIndex: state.currentPairIndex + 1,
        selectedInspirationId: null,
        selectedInnovationId: null,
        lastAttemptStatus: null,
        currentScreen: SCREENS.GAME,
      };

    case ACTION_TYPES.NEXT_ROUND:
      return {
        ...state,
        currentRoundId: state.currentRoundId + 1,
        currentPairIndex: 0,
        selectedInspirationId: null,
        selectedInnovationId: null,
        currentScreen: SCREENS.GAME,
      };

    case ACTION_TYPES.FINISH_GAME:
      return { ...state, currentScreen: SCREENS.END };

    case ACTION_TYPES.RESTART_GAME:
      return initialState;

    default:
      return state;
  }
}
```

#### `src/hooks/useGame.js`

```js
import { useContext } from 'react';
import { GameContext } from '@/context/GameContext';
import { ACTION_TYPES } from '@/utils/constants';
import pairsData from '@/data/pairs.json';

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');

  const { state, dispatch } = ctx;

  // Computed values
  const currentRound = pairsData.rounds.find(
    (r) => r.id === state.currentRoundId
  );
  const currentPairId = currentRound?.pairIds[state.currentPairIndex];
  const currentPair = pairsData.pairs.find((p) => p.id === currentPairId);

  const isLastPairOfRound =
    state.currentPairIndex === (currentRound?.pairIds.length ?? 0) - 1;
  const isLastRound = state.currentRoundId === pairsData.metadata.totalRounds;

  const progress = {
    roundCurrent: state.currentRoundId,
    roundTotal: pairsData.metadata.totalRounds,
    pairCurrentInRound: state.currentPairIndex + 1,
    pairTotalInRound: currentRound?.pairIds.length ?? 0,
    matchedTotal: state.matchedPairIds.length,
    pairsTotal: pairsData.metadata.totalPairs,
  };

  // Actions
  const startGame = () => dispatch({ type: ACTION_TYPES.START_GAME });

  const selectInspiration = (id) =>
    dispatch({ type: ACTION_TYPES.SELECT_INSPIRATION, payload: id });

  const selectInnovation = (id) =>
    dispatch({ type: ACTION_TYPES.SELECT_INNOVATION, payload: id });

  const validatePair = () => dispatch({ type: ACTION_TYPES.VALIDATE_PAIR });

  const resetAttempt = () => dispatch({ type: ACTION_TYPES.RESET_ATTEMPT });

  const goToNext = () => {
    if (!isLastPairOfRound) {
      dispatch({ type: ACTION_TYPES.NEXT_PAIR });
    } else if (!isLastRound) {
      dispatch({ type: ACTION_TYPES.NEXT_ROUND });
    } else {
      dispatch({ type: ACTION_TYPES.FINISH_GAME });
    }
  };

  const restartGame = () => dispatch({ type: ACTION_TYPES.RESTART_GAME });

  return {
    // state
    currentScreen: state.currentScreen,
    currentPair,
    currentRound,
    selectedInspirationId: state.selectedInspirationId,
    selectedInnovationId: state.selectedInnovationId,
    matchedPairIds: state.matchedPairIds,
    lastAttemptStatus: state.lastAttemptStatus,
    progress,

    // actions
    startGame,
    selectInspiration,
    selectInnovation,
    validatePair,
    resetAttempt,
    goToNext,
    restartGame,
  };
}
```

#### `src/screens/GameScreen/GameScreen.jsx`

```jsx
import { motion } from 'framer-motion';
import { useGame } from '@/hooks/useGame';
import Card from '@/components/Card';
import Button from '@/components/Button';
import ProgressIndicator from '@/components/ProgressIndicator';
import SequenceCounter from '@/components/SequenceCounter';
import { screenVariants } from '@/animations/screenVariants';
import styles from './GameScreen.module.css';

function GameScreen() {
  const {
    currentPair,
    selectedInspirationId,
    selectedInnovationId,
    selectInspiration,
    selectInnovation,
    validatePair,
    progress,
  } = useGame();

  if (!currentPair) return null;

  const canValidate =
    selectedInspirationId !== null && selectedInnovationId !== null;

  return (
    <motion.section
      className={styles.gameScreen}
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <header className={styles.header}>
        <SequenceCounter
          current={progress.roundCurrent}
          total={progress.roundTotal}
        />
      </header>

      <div className={styles.layout}>
        <ProgressIndicator
          position="left"
          current={progress.pairCurrentInRound}
          total={progress.pairTotalInRound}
        />

        <div className={styles.cardsArea}>
          <Card
            variant="inspiration"
            title={currentPair.inspiration.title}
            subtitle={currentPair.inspiration.subtitle}
            image={currentPair.inspiration.image}
            description={currentPair.inspiration.description}
            isSelected={selectedInspirationId === currentPair.id}
            onClick={() => selectInspiration(currentPair.id)}
          />

          <Card
            variant="innovation"
            title={currentPair.innovation.title}
            subtitle={currentPair.innovation.subtitle}
            image={currentPair.innovation.image}
            description={currentPair.innovation.description}
            isSelected={selectedInnovationId === currentPair.id}
            onClick={() => selectInnovation(currentPair.id)}
          />
        </div>

        <ProgressIndicator
          position="right"
          current={progress.pairCurrentInRound}
          total={progress.pairTotalInRound}
        />
      </div>

      <footer className={styles.footer}>
        <Button
          label="Lier"
          variant="primary"
          onClick={validatePair}
          disabled={!canValidate}
        />
      </footer>
    </motion.section>
  );
}

export default GameScreen;
```

#### `src/App.jsx` (le routing simple)

```jsx
import { AnimatePresence } from 'framer-motion';
import { useGame } from '@/hooks/useGame';
import { SCREENS } from '@/utils/constants';
import HomeScreen from '@/screens/HomeScreen';
import GameScreen from '@/screens/GameScreen';
import ObservationScreen from '@/screens/ObservationScreen';
import ExplanationScreen from '@/screens/ExplanationScreen';
import EndScreen from '@/screens/EndScreen';
import Layout from '@/components/Layout';

const SCREEN_COMPONENTS = {
  [SCREENS.HOME]: HomeScreen,
  [SCREENS.GAME]: GameScreen,
  [SCREENS.OBSERVATION]: ObservationScreen,
  [SCREENS.EXPLANATION]: ExplanationScreen,
  [SCREENS.END]: EndScreen,
};

function AppRouter() {
  const { currentScreen } = useGame();
  const ScreenComponent = SCREEN_COMPONENTS[currentScreen] ?? HomeScreen;

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <ScreenComponent key={currentScreen} />
      </AnimatePresence>
    </Layout>
  );
}

export default AppRouter;
```

---

## 🎯 À transmettre à Nassim

**Ce que Nassim doit comprendre de l'architecture :**

1. **Une seule source de vérité pour le state** : le GameContext + useReducer. Aucun écran ne stocke son state hors UI local (hover, focus).
2. **Le hook `useGame()` est la seule porte d'entrée** : aucun écran n'importe directement le Context, ils passent tous par ce hook.
3. **GameScreen est UN composant** réutilisé à chaque round — pas de duplication.
4. **Les transitions entre écrans** sont pilotées par `currentScreen` dans le state.
5. **Les animations sont externalisées** dans `src/animations/` pour être réutilisables.
6. **Les données sont 100% dans `pairs.json`** — aucune logique métier hardcodée.

---

**Voilà, copie le prompt en haut de ce fichier dans une nouvelle conversation Claude, et il te générera la même architecture (et tu pourras la challenger plus en profondeur).**
