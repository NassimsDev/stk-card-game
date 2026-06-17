# 🏗️ ARCHITECTURE TECHNIQUE — STK Game

> **Document de référence** pour tous les devs. À lire avant d'écrire la moindre ligne de code.

---

## 1. Stack finale validée

| Couche | Choix | Pourquoi |
|---|---|---|
| Framework | **React 18** | Standard, demandé par le brief |
| Bundler | **Vite 5** | Rapide, simple, déjà en place |
| State management | **React Context + useReducer** (1 seul context global) | Pas d'overkill, suffisant pour ce projet |
| Données | **JSON statique** (`src/data/pairs.json`) importé directement | Voir section 3 ci-dessous |
| Styles | **CSS Modules** (un `.module.css` par composant) | Scope local, pas de conflit, simple |
| Animations | **Framer Motion** | Simple, déclaratif, idéal pour des devs juniors |
| Routing | **Pas de react-router** — un state `currentScreen` dans le Context | 4 écrans seulement, useless de surdéployer |
| Tests | **Aucun test automatisé en V1** — tests manuels via checklist | Pas le temps. À introduire en V2. |
| Linting | **ESLint + Prettier** config standard React | Voir `GUIDELINES_EQUIPE.md` |
| Déploiement | **Vercel** (connecté au repo GitHub, déploiement auto) | Gratuit, simple, instantané |

---

## 2. Comparaison data layer : JSON vs LowDB vs Zustand vs Context

| Solution | Verdict | Justification |
|---|---|---|
| **JSON statique** | ✅ **RETENU** | Données 100% statiques (44 cartes, 22 paires). Aucune écriture nécessaire. Import direct = zéro complexité. |
| **LowDB** | ❌ Inutile | LowDB est une "fake DB" en local. Mais on n'a aucune donnée à persister côté server. **C'est de l'overkill pur** pour un dataset constant. |
| **Zustand** | ❌ Trop pour ce projet | Excellent pour des apps avec beaucoup d'écrans et de state cross-cutting. Ici, 4 écrans, 1 game state. Context suffit. |
| **Context API + useReducer** | ✅ **RETENU pour le state runtime** | Parfait pour gérer le state du jeu (paires trouvées, séquence courante, feedback) sans installer de lib. |
| **Redux Toolkit** | ❌ Non | Trop verbeux, courbe d'apprentissage, overkill. |

### Décision finale
- **Données statiques (cartes, paires, textes)** → `src/data/pairs.json`, importé via `import pairs from './data/pairs.json'`
- **State runtime (progression du joueur, état UI)** → Context API + useReducer dans `src/context/GameContext.jsx`
- **Persistence cross-session (optionnel V2)** → `localStorage` (clé `stk-game-progress`)

---

## 3. Modèle de données — `src/data/pairs.json`

### Schéma

```json
{
  "metadata": {
    "version": "1.0.0",
    "totalPairs": 22,
    "sequences": [
      { "id": 1, "name": "Séquence 1", "pairIds": [1, 2, 3, 4, 5, 6] },
      { "id": 2, "name": "Séquence 2", "pairIds": [7, 8, 9, 10, 11] },
      { "id": 3, "name": "Séquence 3", "pairIds": [12, 13, 14, 15, 16, 17] },
      { "id": 4, "name": "Séquence 4", "pairIds": [18, 19, 20, 21, 22] }
    ]
  },
  "pairs": [
    {
      "id": 1,
      "theme": "Aérodynamisme",
      "inspiration": {
        "title": "Nageoires de baleine",
        "subtitle": "Inspiration",
        "image": "/images/cards/baleine.webp",
        "shortDescription": "Sa morphologie brise la résistance du courant pour glisser avec un effort minimal.",
        "alt": "Baleine à bosse nageant dans l'océan"
      },
      "innovation": {
        "title": "Éoliennes",
        "subtitle": "Innovation",
        "image": "/images/cards/eoliennes.webp",
        "shortDescription": "Ces pales géantes tournent même par vent très faible grâce à leur profil unique.",
        "alt": "Pales d'éolienne avec cannelures imitant la baleine"
      },
      "explanation": {
        "title": "Le lien biomimétique",
        "body": "Les bosses sur les nageoires de la baleine créent des micro-vortex qui améliorent sa portance. Sculptées de la même façon, ces pales d'éoliennes captent le vent avec beaucoup moins de frottement.",
        "source": "Whalepower (Canada)"
      }
    }
  ]
}
```

### Règles d'écriture du JSON
- **IDs séquentiels** de 1 à 22, jamais réutilisés
- **Chemins d'images** : toujours `/images/cards/NOM.webp` (Vite sert depuis `/public`)
- **Description courte** : max 120 caractères (pour tenir sur la carte)
- **Explanation body** : max 280 caractères (lisibilité écran)
- **Toujours fournir `alt`** sur les images (accessibilité)

---

## 4. Structure des dossiers

```
stk-game/
├── public/
│   └── images/
│       └── cards/
│           ├── baleine.webp
│           ├── eoliennes.webp
│           └── ...
├── src/
│   ├── components/              # Composants réutilisables (UI atomique)
│   │   ├── Card/
│   │   │   ├── Card.jsx
│   │   │   ├── Card.module.css
│   │   │   └── index.js         # export par défaut depuis Card.jsx
│   │   ├── Button/
│   │   ├── ProgressIndicator/
│   │   └── Layout/
│   ├── screens/                 # Écrans complets (vues "page")
│   │   ├── HomeScreen/
│   │   ├── SequenceView/
│   │   ├── ExplanationScreen/
│   │   └── EndScreen/
│   ├── context/                 # State global
│   │   └── GameContext.jsx
│   ├── hooks/                   # Hooks custom
│   │   ├── useGame.js
│   │   └── useLocalStorage.js   # (V2)
│   ├── utils/                   # Helpers purs
│   │   ├── matchPair.js
│   │   └── shuffleArray.js
│   ├── animations/              # Variants Framer Motion réutilisables
│   │   └── variants.js
│   ├── data/
│   │   └── pairs.json
│   ├── styles/                  # CSS globaux
│   │   ├── variables.css        # tokens design (couleurs, typo, espacements)
│   │   ├── reset.css
│   │   └── global.css
│   ├── App.jsx                  # routing simple + GameProvider
│   └── main.jsx                 # entry point
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── package.json
└── vite.config.js
```

### Règle d'or sur la structure
- **1 composant = 1 dossier** avec son `.jsx`, son `.module.css`, son `index.js`
- **Pas de fichier "utils" géant** : 1 fichier par fonction utilitaire
- **Pas d'imports relatifs profonds** : configure `vite.config.js` avec un alias `@` qui pointe vers `src/` (ex: `import Card from '@/components/Card'`)

---

## 5. State management — comment ça marche

### `GameContext.jsx` — Le seul Context du projet

```jsx
// src/context/GameContext.jsx
import { createContext, useContext, useReducer } from 'react';
import pairs from '@/data/pairs.json';

const GameContext = createContext(null);

const initialState = {
  currentScreen: 'home',         // 'home' | 'sequence' | 'explanation' | 'end'
  currentSequenceId: 1,
  currentPairIndex: 0,           // index dans la séquence courante
  selectedInspirationId: null,
  selectedInnovationId: null,
  matchedPairIds: [],            // les paires validées
  lastAttemptStatus: null,       // null | 'correct' | 'incorrect'
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, currentScreen: 'sequence' };
    case 'SELECT_INSPIRATION':
      return { ...state, selectedInspirationId: action.payload };
    case 'SELECT_INNOVATION':
      return { ...state, selectedInnovationId: action.payload };
    case 'VALIDATE_PAIR': {
      const isMatch = state.selectedInspirationId === state.selectedInnovationId;
      return {
        ...state,
        lastAttemptStatus: isMatch ? 'correct' : 'incorrect',
        matchedPairIds: isMatch
          ? [...state.matchedPairIds, state.selectedInspirationId]
          : state.matchedPairIds,
        currentScreen: isMatch ? 'explanation' : 'sequence',
      };
    }
    case 'NEXT_PAIR':
      // logique pour passer à la paire suivante de la séquence
      return { ...state, currentPairIndex: state.currentPairIndex + 1, currentScreen: 'sequence', selectedInspirationId: null, selectedInnovationId: null };
    case 'RESET_ATTEMPT':
      return { ...state, selectedInspirationId: null, selectedInnovationId: null, lastAttemptStatus: null };
    case 'FINISH_GAME':
      return { ...state, currentScreen: 'end' };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch, pairs: pairs.pairs, sequences: pairs.metadata.sequences }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameContext must be used within GameProvider');
  return ctx;
}
```

### `useGame.js` — Hook qui expose des actions de haut niveau

```js
// src/hooks/useGame.js
import { useGameContext } from '@/context/GameContext';

export function useGame() {
  const { state, dispatch, pairs, sequences } = useGameContext();

  const currentSequence = sequences.find(s => s.id === state.currentSequenceId);
  const currentPair = pairs.find(p => p.id === currentSequence.pairIds[state.currentPairIndex]);

  return {
    // état
    currentScreen: state.currentScreen,
    currentPair,
    currentSequence,
    matchedPairIds: state.matchedPairIds,
    lastAttemptStatus: state.lastAttemptStatus,
    progress: {
      sequencesTotal: sequences.length,
      sequenceCurrent: state.currentSequenceId,
      pairsInSequenceTotal: currentSequence.pairIds.length,
      pairCurrent: state.currentPairIndex + 1,
    },

    // actions
    startGame: () => dispatch({ type: 'START_GAME' }),
    selectInspiration: (id) => dispatch({ type: 'SELECT_INSPIRATION', payload: id }),
    selectInnovation: (id) => dispatch({ type: 'SELECT_INNOVATION', payload: id }),
    validatePair: () => dispatch({ type: 'VALIDATE_PAIR' }),
    nextPair: () => dispatch({ type: 'NEXT_PAIR' }),
    resetAttempt: () => dispatch({ type: 'RESET_ATTEMPT' }),
    finishGame: () => dispatch({ type: 'FINISH_GAME' }),
  };
}
```

### Utilisation dans un composant

```jsx
import { useGame } from '@/hooks/useGame';

function SomeComponent() {
  const { currentPair, validatePair, lastAttemptStatus } = useGame();
  // ... pas de prop drilling, pas de redux, juste le hook
}
```

---

## 6. Règles de découpage des composants

### Quand créer un composant ?
- ✅ Le bout de UI est **utilisé à 2+ endroits**
- ✅ Il a sa **propre logique d'affichage** (sélection, hover, animation)
- ✅ Le fichier parent dépasse **150 lignes** et devient illisible

### Quand NE PAS créer de composant ?
- ❌ Juste pour "éviter de répéter 3 lignes JSX" — ce n'est pas du DRY, c'est de la fragmentation
- ❌ Anticipation théorique ("au cas où on en aurait besoin plus tard")
- ❌ Pour wrapper un seul `<div>`

### Anti-pattern : God Component
Un composant ne doit faire **qu'une seule chose**.
- ❌ `<SequenceView />` qui fait à la fois layout + sélection + animation + validation + affichage explication
- ✅ `<SequenceView />` qui orchestre, et délègue à `<CardPair />`, `<ValidationButton />`, `<ProgressIndicator />`

### Taille recommandée
- **Composant idéal** : 30-100 lignes JSX
- **Au-delà de 150 lignes** : c'est un signal pour découper
- **Au-delà de 250 lignes** : c'est un bug, refactorise immédiatement

### Logique vs UI : où vit quoi ?
- **Logique métier** → dans des hooks custom ou des fonctions utilitaires pures
- **Logique d'affichage simple** (hover, ouvert/fermé) → useState local dans le composant
- **État partagé entre composants** → GameContext
- **Composant** = uniquement la **composition + le rendu**, pas de calculs métier

---

## 7. Conventions React modernes (à respecter strictement)

1. **Composants fonctionnels uniquement**, pas de classes
2. **Hooks à l'ouverture du composant**, jamais conditionnels
3. **Props destructurées dans la signature** : `function Card({ title, image, onClick })`
4. **Default props via destructuring** : `function Card({ variant = 'default' })`
5. **PropTypes ou JSDoc** au minimum (pas de TS, mais documente les types attendus en commentaire)
6. **Pas de `useEffect` pour dériver des données** — utilise des variables calculées
7. **Pas de mutation directe du state**, toujours `setState(prev => ...)` ou `dispatch`
8. **Cleanup dans useEffect** quand on a un listener ou un timer
9. **Une `key` stable et unique** sur tous les `.map()`

---

## 8. Gestion des animations

### Règle : 80% du visuel par CSS, 20% par Framer Motion

| Type d'animation | Outil |
|---|---|
| Hover, focus, transitions simples (couleur, échelle) | **CSS transition** |
| Apparition/disparition de composants | **Framer Motion** `<AnimatePresence>` |
| Mouvements complexes (drag, spring, séquencé) | **Framer Motion** `motion.div` |
| Loading, spinners | **CSS keyframes** |

### Performance
- ⚠️ **Pas plus de 5 animations simultanées** à l'écran
- ⚠️ Préférer `transform` et `opacity` (GPU-friendly) à `width`, `top`, `left`
- ⚠️ Désactiver les animations sur `prefers-reduced-motion`

### Anti-pattern
- ❌ Animer dans `useEffect` avec `setInterval` à la main — utilise Framer ou CSS
- ❌ Lourdes animations sur la home (le user n'a pas encore joué, il s'en fout)

---

## 9. Conventions CSS

- **CSS Modules obligatoire** : `Card.module.css` → `import styles from './Card.module.css'`
- **Variables CSS globales** dans `src/styles/variables.css` :
  ```css
  :root {
    --color-bg: #f1eee7;
    --color-text-primary: #1a1a1a;
    --color-accent: #6b8e6e;
    --color-correct: #7ba87d;
    --color-error: #c87f6a;
    --font-sans: 'Inter', system-ui, sans-serif;
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 32px;
    --space-xl: 64px;
    --radius-sm: 4px;
    --radius-md: 12px;
    --radius-lg: 24px;
    --transition-fast: 150ms ease-out;
    --transition-default: 300ms ease-out;
  }
  ```
- **Pas de !important** (sauf cas exceptionnel justifié en commentaire)
- **Pas d'IDs en CSS** (sélecteurs `#id`) — toujours par classes
- **Mobile-first si on fait le responsive** : on commence par les petits écrans

---

## 10. Sur l'intégration au site STK (à anticiper post-soutenance)

### 3 options techniques par ordre de complexité

#### Option A — Page autonome avec lien (recommandé V1)
- Le jeu est déployé sur Vercel à `https://stk-game.vercel.app`
- Le site STK ajoute un bouton "Jouer" qui ouvre cette URL dans un nouvel onglet ou la même fenêtre
- **Avantages** : ZÉRO contrainte sur le code, déploiement indépendant, on n'impacte pas le site existant
- **Inconvénients** : sortie du site STK pour l'utilisateur (rupture UX)

#### Option B — Iframe embarqué (recommandé V2)
- Le jeu reste déployé en autonome
- Le site STK l'embarque dans un `<iframe>` qui occupe une section/une page
- **Avantages** : pas de rupture UX, isolation totale du code
- **Inconvénients** : un peu plus de complexité (postMessage si besoin de communication), un peu de jank sur le scroll mobile

#### Option C — Composant React intégré (à éviter sauf si site STK est en React)
- Le jeu est packagé comme un composant React et intégré au site
- **Avantages** : intégration native, partage de tokens design
- **Inconvénients** : couple les deux projets, nécessite que le site STK soit en React, complexité élevée

### Recommandation CTO
**V1 = Option A** (lien externe). On valide le concept.
**V2 = Option B** (iframe) après discussion avec l'équipe du site STK.
**V3 = Option C** si besoin réel d'intégration profonde.

### Précautions à prendre dès maintenant
- **Pas de routing absolu** : utiliser un préfixe configurable via Vite env (`VITE_BASE_PATH`)
- **Tous les assets via chemins relatifs**
- **CSS scopé** (Modules) pour ne pas polluer une éventuelle page hôte
- **Pas de manipulation directe du `document.body`** ou du `window`
