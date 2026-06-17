# 👥 GUIDELINES ÉQUIPE — STK Game

> Document à lire et à signer mentalement avant de commit la moindre ligne de code.

---

## 1. Principes de collaboration

### Les 5 règles d'or non-négociables

1. **On commit petit, on commit souvent.** Aucun commit "WIP" de 500 lignes après 8h sans push.
2. **On parle avant de coder une feature.** Slack/Discord/WhatsApp/IRL : on annonce ce qu'on attaque pour ne pas se marcher dessus.
3. **On respecte le scope du sprint.** Si t'as une idée de ouf, tu la notes dans `IDEAS.md`, tu ne la codes pas maintenant.
4. **On documente UNIQUEMENT ce qui n'est pas évident.** Pas de commentaire `// incrémente i de 1`. Mais OUI un commentaire sur une décision métier non-triviale.
5. **On demande de l'aide après 30 minutes de blocage.** Pas après 3h. Pas le lendemain.

---

## 2. Conventions Git

### Branches

**Format** : `<type>/<short-description-en-kebab-case>`

**Types autorisés** :
- `feat/` — nouvelle feature (ex: `feat/sequence-view-component`)
- `fix/` — bugfix (ex: `fix/incorrect-pair-feedback`)
- `chore/` — config, deps, CI (ex: `chore/setup-eslint`)
- `docs/` — documentation (ex: `docs/update-readme`)
- `refactor/` — refacto sans changement de comportement
- `style/` — uniquement du CSS/format (rare)

**Règles** :
- ✅ `feat/add-validation-button`
- ❌ `ramy-branch`, `test`, `nouvelle-feature`, `MaBranche`
- **JAMAIS** de commit direct sur `main`
- Une feature = une branche, **point**
- On supprime la branche après merge

### Commits

**Format Conventional Commits (obligatoire)** :
```
<type>(<scope>): <description courte impérative en minuscule>

[corps optionnel]

[footer optionnel]
```

**Exemples corrects** :
```
feat(card): add hover state with subtle scale
fix(game): correct pair validation logic for incorrect matches
chore(deps): bump framer-motion to 11.0.3
docs(readme): add deployment instructions
refactor(context): split game reducer into smaller actions
```

**Exemples incorrects** :
```
update              ❌ pas de type, pas de description
WIP                 ❌ pas de WIP en main ou en PR
mes modifs          ❌ vague et en français mélangé
Fix Bug             ❌ majuscule + verbe au passé
"corrigé le bug du bouton qui ne marchait pas"  ❌ trop long, mal formaté
```

**Règles** :
- Au présent, à l'impératif, en anglais (court)
- Pas de point final
- 50 caractères max sur la ligne de sujet
- Si tu dois expliquer plus, **mets un corps de commit** sur 2-3 lignes

### Workflow standard

```bash
# Toujours partir d'un main à jour
git checkout main
git pull origin main

# Créer ta branche
git checkout -b feat/your-feature

# Code, code, code... commits réguliers
git add .
git commit -m "feat(card): add inspiration variant"

# Avant de push, rebase si main a bougé
git fetch origin
git rebase origin/main

# Push
git push -u origin feat/your-feature

# Ouvre une PR sur GitHub
```

### Pull Requests

**Template PR** :
```markdown
## Quoi
[1-3 phrases qui décrivent ce que fait cette PR]

## Pourquoi
[Le besoin / le bug / la décision derrière]

## Comment tester
1. Aller sur l'écran X
2. Cliquer sur Y
3. Vérifier Z

## Screenshots (si UI)
[GIF ou screenshot]

## Checklist
- [ ] Le code respecte les conventions
- [ ] Ça compile sans warning
- [ ] J'ai testé manuellement le happy path
- [ ] J'ai testé au moins 1 edge case
```

**Règles PR** :
- Une PR = une feature (pas de "fourre-tout")
- Moins de 400 lignes diff idéalement, **jamais plus de 800**
- Toujours **1 review minimum** avant merge (à 2 devs : Ramy review Nassim et vice-versa)
- **Pas de "merge commit"** : on utilise `Squash and merge` ou `Rebase and merge`
- Si la CI est rouge, on ne merge pas

### Stratégie de merge en sprint d'urgence (J-1 et J-J)
- **À partir de J-1 18h** : on peut merger sans review formelle MAIS avec un **screenshot/GIF dans la PR**, et on signal sur le canal
- **À partir de J-J 8h (matin de la soutenance)** : **CODE FREEZE TOTAL**, aucun merge sauf bugfix critique validé à 2 personnes

---

## 3. Conventions de nommage

### Fichiers
- **Composants React** : `PascalCase` → `SequenceView.jsx`, `Card.jsx`
- **Hooks** : `camelCase` commençant par `use` → `useGame.js`
- **Utils** : `camelCase` → `matchPair.js`, `shuffleArray.js`
- **CSS Modules** : `<Component>.module.css` → `Card.module.css`
- **Données** : `kebab-case` ou `camelCase` → `pairs.json`
- **Assets** : `kebab-case` toujours → `nageoire-baleine.webp`

### Variables et fonctions
- **Variables** : `camelCase` → `currentPair`, `isMatched`
- **Constantes** : `SCREAMING_SNAKE_CASE` → `MAX_ATTEMPTS`, `ANIMATIONS_ENABLED`
- **Booléens** : préfixe `is`, `has`, `should` → `isCorrect`, `hasMatched`, `shouldShowFeedback`
- **Handlers** : préfixe `handle` → `handleCardClick`, `handleValidate`
- **Props callback** : préfixe `on` → `onClick`, `onValidate`

### Composants
- **Nom du dossier = nom du composant** → `/Card/Card.jsx`
- **Export par défaut** depuis `index.js` du dossier : `export { default } from './Card'`
- **Un seul composant par fichier**

### CSS classes (modules)
- **camelCase** → `styles.cardContainer`, `styles.isSelected`
- États avec préfixe `is` ou `has` → `.isSelected`, `.hasError`

---

## 4. Règles d'écriture du code React

### Anatomie d'un composant propre

```jsx
// Card.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Card.module.css';

/**
 * Carte de jeu représentant soit une Inspiration soit une Innovation.
 *
 * @param {Object} props
 * @param {'inspiration'|'innovation'} props.variant
 * @param {string} props.title
 * @param {string} props.image
 * @param {boolean} props.isSelected
 * @param {() => void} props.onClick
 */
function Card({ variant = 'inspiration', title, image, isSelected = false, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className={`${styles.card} ${styles[variant]} ${isSelected ? styles.isSelected : ''}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <img src={image} alt={title} className={styles.image} />
      <span className={styles.title}>{title}</span>
    </motion.button>
  );
}

export default Card;
```

### Anti-patterns à bannir

#### ❌ God Component
```jsx
function App() {
  // 400 lignes de logique, de state, d'effets, de rendu...
}
```

#### ❌ Prop Drilling sur 4 niveaux
```jsx
<Layout user={user}>
  <Page user={user}>
    <Section user={user}>
      <SubSection user={user}>  {/* arghhh */}
```
→ Solution : Context (déjà en place avec GameContext).

#### ❌ State dérivable stocké en state
```jsx
// MAUVAIS
const [pairs, setPairs] = useState([]);
const [pairsCount, setPairsCount] = useState(0);  // dérivable !

// BON
const [pairs, setPairs] = useState([]);
const pairsCount = pairs.length;
```

#### ❌ useEffect pour tout
```jsx
// MAUVAIS
useEffect(() => {
  if (selected) {
    setStatus('selected');
  }
}, [selected]);

// BON
const status = selected ? 'selected' : 'idle';
```

#### ❌ Inline functions partout dans le JSX
```jsx
// PEU OPTIMAL en cas de re-render fréquent
<Button onClick={() => doSomething(item.id, otherStuff)} />

// MIEUX
const handleClick = () => doSomething(item.id, otherStuff);
<Button onClick={handleClick} />
```

#### ❌ Mutation directe du state
```jsx
// MAUVAIS
state.list.push(newItem);
setState(state);  // React ne va pas re-render !

// BON
setState({ ...state, list: [...state.list, newItem] });
```

---

## 5. Code review : ce qu'on regarde

Quand tu reviews une PR, vérifie **dans cet ordre** :

1. **Ça compile sans warning ?** → si non, ❌ refuse
2. **Le scope de la PR est focused ?** → si non, demande à splitter
3. **Le code respecte les conventions de nommage et structure ?** → sinon, demande des renames
4. **Pas de console.log oublié, pas de code commenté mort ?** → demande nettoyage
5. **Pas de duplication évidente ?** → suggère refacto
6. **Les états sont-ils correctement gérés (pas de mutation directe) ?** → bloque si bug
7. **Performance OK (pas de map dans un map, pas d'effet runaway) ?** → flag si suspect
8. **Accessibilité de base (alt, focus, label) ?** → suggère ajustement

### Comment écrire un commentaire de review constructif

✅ **Bon** : "Pour éviter les re-renders inutiles, on pourrait extraire `handleClick` en dehors du render. C'est pas critique mais c'est une bonne pratique."

❌ **Mauvais** : "Ce code est nul." / "Pourquoi t'as fait ça ?"

Sois précis, propose une alternative, sois cordial. On bosse ensemble.

---

## 6. Comportements à éviter en équipe

| Anti-pattern | Pourquoi c'est mauvais | Que faire à la place |
|---|---|---|
| Coder pendant 8h sans push | Ton travail est invisible, risque de perte, conflits massifs | Push toutes les 1-2h, même si pas fini (sur ta branche) |
| Refactoriser le code d'un autre sans prévenir | Tu casses son boulot, conflits Git, frustrant | Discute d'abord, fais une PR séparée pour la refacto |
| Installer une nouvelle dépendance sans discuter | Bloat du projet, risques sécurité, courbe d'apprentissage | Annonce dans le canal d'équipe, valide avec le tech lead |
| Faire des "petites améliorations" hors scope dans tes PR | Review devient pénible, scope confus | Une PR = un sujet. Crée une autre PR pour le reste. |
| Ne pas tester ton code avant de pousser | Bug en main, blocage de l'équipe | Lance toujours en local avant de push |
| Dire "ça marche chez moi" et fermer la conversation | Ne résout pas le problème | Cherche pourquoi ça ne marche pas chez l'autre, c'est probablement env-specific |
| Travailler dans son coin sans rien dire | L'équipe ne peut pas t'aider, double effort possible | Ping rapide quand tu commences une tâche / quand tu bloques |
| Faire du copy-paste de Stack Overflow sans comprendre | Bugs subtils, dette technique, debug impossible | Comprends ce que tu colles. Sinon, demande. |

---

## 7. Communication d'équipe (sprint 2 jours)

### Canaux
- **Discord/Slack** (à choisir) : canal `#stk-game-dev` pour tout
- **Discord vocal** : disponible H24 pendant les 2 jours
- **GitHub** : Issues + PR pour tout ce qui est code
- **Figma** : commentaires sur les maquettes

### Rythme de sync
- **Daily de 15min** matin (9h) : Yesterday / Today / Blockers
- **Sync de 5min** après le déjeuner (14h) : statut Phase 1 ?
- **Sync de 15min** le soir (19h) : qu'est-ce qui rentre dans la nuit ?
- **Code freeze sync** J-1 20h : tout le monde valide le minimum vital

### En cas de blocage
1. **15min de recherche perso** (Google, docs, ChatGPT)
2. **30min max** sans demander de l'aide
3. Ping `@channel` avec :
   - Ce que je veux faire
   - Ce que j'ai essayé
   - L'erreur exacte (copie/colle)
4. Si pas de réponse en 15min, **vocal direct**

---

## 8. Qualité du code livré

### Définition de "Done" pour une tâche
Une tâche est "Done" quand :
- ✅ Le code compile sans warning
- ✅ J'ai testé manuellement le happy path
- ✅ J'ai testé au moins 1 edge case
- ✅ Le code respecte les conventions de ce document
- ✅ Pas de console.log oublié
- ✅ Pas de TODO sans ticket associé
- ✅ La PR est mergée dans `main`
- ✅ La feature est visible dans le déploiement de preview

### Définition de "Done" pour le projet
Voir checklist de soutenance dans `01_PLAN_SPRINT_2_DEVS.md`.

---

## 9. Setup minimum à avoir

Avant de coder, chaque dev doit avoir :

- **Node 20+ et npm/pnpm installés**
- **VSCode** (recommandé) avec extensions :
  - ESLint
  - Prettier
  - ES7+ React/Redux/React-Native snippets
  - Auto Rename Tag
  - GitLens (optionnel mais utile)
- **Format on save activé** dans VSCode (`"editor.formatOnSave": true`)
- **Le repo cloné en local**
- **Accès au repo en write** (Ramy s'en occupe)
- **Vercel relié au repo** (Ramy s'en occupe)
- **Discord/Slack rejoint**
- **Figma accessible en read**

### Scripts npm dispo
- `npm run dev` — lance Vite en dev (port 5173)
- `npm run build` — build de prod
- `npm run preview` — preview du build local
- `npm run lint` — lance ESLint
- `npm run format` — formate avec Prettier

---

## 10. Liens utiles

- **React docs (officielles, version 2024+)** : https://react.dev
- **Vite docs** : https://vitejs.dev
- **Framer Motion docs** : https://www.framer.com/motion/
- **Conventional Commits** : https://www.conventionalcommits.org/en/v1.0.0/

---

## 11. Mot de la fin du CTO

> On est dans un sprint court avec un scope ambitieux et une équipe junior.
> La **clarté > la perfection**.
> Le **livrable > le code parfait**.
> La **communication > le code en silence**.
>
> Si tu hésites entre faire bien et faire propre, fais **bien**. On nettoiera en V2.
> Si tu hésites entre avancer et bloquer l'équipe pour un détail, **avance**.
> Si tu hésites à demander de l'aide, **demande**.
>
> On bosse comme une vraie équipe pro. Bonne soutenance.
