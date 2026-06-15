# 🚀 PLAN B — Avec Karen et Guillaume (scénario optionnel)

> **À LIRE EN PREMIER** : Ce plan ne s'applique **PAS** pour la soutenance du 22/05. Il est conçu pour une **V2 post-soutenance** si Karen et Guillaume nous rejoignent pour faire évoluer le projet.

## Pourquoi pas pour la soutenance du 22/05 ?

**Verdict CTO sans concession** :
- Onboarding d'un dev React débutant sur un projet existant = 4-8h minimum
- Sur 2 jours, ça coûte plus que ça ne rapporte
- Risque élevé : conflits Git, code non aligné aux conventions, blocages
- Risque social : on perd du temps à expliquer plutôt qu'à coder

→ Si Karen et Guillaume sont présents physiquement avant le 22/05, leur **vrai apport** est :
- Tests utilisateurs (jouer au jeu, signaler les frictions)
- Aide à la rédaction des livrables (doc, synthèse tests, slides)
- Sourcing de visuels supplémentaires (si non finalisés)
- Préparation logistique de la soutenance

**Ce n'est PAS un rôle dev. Et c'est OK.**

---

## 🗓️ Scénario V2 : à partir du 25/05 (post-soutenance)

### Répartition des rôles en équipe étendue (4 devs + 2 designers)

| Personne | Rôle | Domaine technique |
|---|---|---|
| **Ramy** | **Tech Lead** | Architecture, state global, coordination, déploiement, code reviews |
| **Nassim** | **Senior Dev** | Composants principaux, intégration data, animations complexes |
| **Karen** | **Junior Dev — UI** | Composants UI simples, styling, responsive, micro-interactions |
| **Guillaume** | **Junior Dev — Content/QA** | Intégration contenus, accessibilité, tests, documentation technique |
| **Designer 1** | **DA/UI** | Évolution DA, nouvelles maquettes (V2 features) |
| **Designer 2** | **Content/Visuels** | Évolution textes pédagogiques, sourcing nouveaux visuels |

### Découpage par feature ownership

Chaque dev devient **owner d'un domaine** et code en autonomie sur ses fichiers. Pas de chevauchement = pas de conflits Git.

**Ramy possède :**
- `src/context/` (état global)
- `src/hooks/` (hooks custom)
- `src/data/` (modèle de données)
- `src/utils/` (helpers)
- `src/App.jsx` (routing principal)

**Nassim possède :**
- `src/screens/SequenceView/`
- `src/screens/ExplanationScreen/`
- `src/components/Card/`
- `src/animations/` (Framer Motion)

**Karen possède :**
- `src/components/Button/`
- `src/components/Layout/`
- `src/components/ProgressIndicator/`
- `src/screens/HomeScreen/`
- `src/styles/` (CSS globaux, variables)

**Guillaume possède :**
- `src/screens/EndScreen/`
- `src/components/Modal/` (modales d'aide, à propos)
- `src/utils/accessibility.js`
- Tous les `*.test.js` (si on introduit des tests)
- `docs/` (documentation)

### Workflow Git en équipe 4 devs

- **Une branche par feature**, pas par personne. Format : `feat/sequence-view-animations`
- **Pas plus de 4 branches actives en parallèle**, sinon le projet devient ingérable
- **Pull Request obligatoire**, review par au moins 1 autre dev (idéalement Ramy ou Nassim sur les PR de Karen/Guillaume)
- **Standup quotidien de 15min max** (vidéo ou texto) :
  - "Hier : ce que j'ai fait"
  - "Aujourd'hui : ce que je vais faire"
  - "Bloqueurs : ce qui me ralentit"
- Décision technique majeure = **Ramy tranche** (lead) après discussion avec Nassim

### Onboarding rapide Karen + Guillaume (Session de 2h à organiser)

**Heure 1 : Compréhension du projet**
1. Présentation du jeu, du brief, des wireframes (20min)
2. Lecture commune des documents `00`, `03`, `04` (40min)

**Heure 2 : Setup technique**
1. Clone du repo, installation, run en local (20min)
2. Tour du code en pair-programming (20min) : flux des données, état global, comment ajouter une nouvelle paire
3. Première micro-tâche guidée pour valider le setup (20min) : par exemple, "ajoute un footer dans Layout"

### Roadmap V2 réaliste (sur 2-3 semaines)

#### Semaine 1 — Solidification
- Bugfix complet du retour soutenance
- Responsive mobile complet
- Accessibilité WCAG AA (focus, alt, contrastes, navigation clavier)
- Tests utilisateurs avec 5-10 personnes

#### Semaine 2 — Évolutions UX
- Mode "exploration libre" (plateau global, conforme cahier des charges initial)
- Filtres par thématique (matériaux, énergie, structure)
- Sauvegarde de progression
- Sons discrets (option activable)

#### Semaine 3 — Intégration client
- Coordination avec le client STK pour l'intégration au site
- Build optimisé pour iframe ou module
- Tests d'intégration
- Documentation de livraison

### Estimation budget temps V2

| Feature | Effort | Owner |
|---|---|---|
| Bugfix soutenance | 4-8h | Tous |
| Responsive mobile | 8h | Karen + Nassim |
| Accessibilité WCAG AA | 6h | Guillaume |
| Mode plateau global | 16h | Ramy + Nassim |
| Filtres thématiques | 6h | Karen |
| LocalStorage progression | 3h | Ramy |
| Sons | 4h | Guillaume |
| Coordination client + intégration | 8h | Ramy |
| Tests utilisateurs + synthèse | 6h | Guillaume + Designers |
| Documentation finale | 4h | Tous |
| **TOTAL** | **~65h** | **4 devs sur 2-3 semaines** |

---

## 🚧 Plan d'évolution organisationnel

Quand l'équipe passe de 2 à 4 devs, certaines choses changent :

### Ce qui DOIT évoluer

1. **Tickets/Issues GitHub** : il faut commencer à utiliser GitHub Issues + Projects (sinon on perd le fil)
2. **Code reviews systématiques** : tout PR merge nécessite 1 review minimum
3. **Standup quotidien** : indispensable à 4
4. **Linter + Prettier en CI** : on bloque les merges si le code n'est pas formaté
5. **Templates de PR et d'Issue** : standardiser pour ne pas oublier d'infos

### Ce qui NE doit PAS changer (anti-patterns)

- ❌ **Ne pas créer de microservices, monorepo, etc.** : le projet est et reste petit
- ❌ **Ne pas introduire TypeScript en milieu de projet** : trop coûteux maintenant
- ❌ **Ne pas multiplier les libraries** : chaque nouvelle dépendance = dette
- ❌ **Ne pas créer d'abstractions prématurées** : on attend qu'un pattern apparaisse 3 fois avant de l'extraire

---

## 🎯 Décision finale CTO

**Pour le 22/05** → Plan A (`01_PLAN_SPRINT_2_DEVS.md`). Karen et Guillaume sont les bienvenus en support non-dev.

**Pour la suite** → Si le client veut une V2, on bascule sur ce Plan B avec onboarding rapide.

**Si Karen et Guillaume insistent pour coder avant le 22/05** : on leur donne UNIQUEMENT des micro-tâches isolées et bien définies :
- "Ajoute un fichier `LICENSE.md`"
- "Crée le README.md du projet"
- "Source 3 visuels libres de droit pour les paires X, Y, Z"
- "Joue au jeu et liste 10 frictions sur un Google Doc"

**Aucune contribution sur le code core sans review obligatoire de Ramy ou Nassim.**
