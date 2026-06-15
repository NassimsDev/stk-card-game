# 🎯 DIAGNOSTIC CTO — Projet STK Architecture

> **Date** : 20/05/2026 — **Auteur** : CTO virtuel
> **Statut projet** : Sprint d'urgence — Soutenance 22/05 (J-2)
> **Équipe actuelle** : 2 devs (Ramy + Nassim) + 2 designers complets = **4 personnes**

---

## 1. Lecture honnête de la situation

| Facteur | Réalité | Niveau de risque |
|---|---|---|
| Temps restant | **~48h calendaires** avant soutenance | 🔴 CRITIQUE |
| Niveau React équipe dev | Débutants (HTML/CSS/JS solides) | 🟠 ÉLEVÉ |
| Visuels prêts | 0 finalisés (designers en cours) | 🟠 ÉLEVÉ |
| Scope visé | 22 paires complètes + parcours guidé | 🔴 AMBITIEUX |
| Stack | React + Vite, pas de backend, JSON | 🟢 SAIN |
| Outils | Repo GitHub ✅, Vite ✅, Figma ✅ | 🟢 OK |

## 2. Décisions CTO non-négociables

Je tranche, parce qu'on n'a plus le temps de débattre. Ces décisions sont à transmettre à toute l'équipe **maintenant**.

### Décision 1 — Scope contraint mais "live"
On vise les **22 paires** parce que c'est ce que demande le client, **MAIS** :
- **Phase 1 (priorité absolue)** : 4 à 6 paires entièrement intégrées, animées, jouables, déployées. C'est le **MVP "défendable"**.
- **Phase 2 (si Phase 1 terminée à J-1)** : on ajoute le reste des paires (les données seront déjà templatées, c'est juste de la duplication de données).

> **Logique** : mieux vaut une démo à 6 paires *fluide et finie* qu'une démo à 22 paires *cassée*. Une démo qui plante en soutenance, c'est zéro.

### Décision 2 — Parcours UX = guidé séquencé
Confirmé. On suit le wireframe (Séquence 1/4, 2/4, etc.). C'est :
- **Plus simple à coder** que le plateau global (pas de gestion de layout complexe pour 44 cartes)
- **Plus pédagogique** (le but du jeu est de COMPRENDRE le lien, pas de mémoriser)
- **Plus animable** avec un budget temps restreint

⚠️ À documenter dans la soutenance : on justifie le choix UX par rapport au cahier des charges initial ("toutes les cartes visibles") en disant qu'on a fait évoluer le concept vers une expérience plus narrative et progressive, mieux adaptée au public 8 ans+.

### Décision 3 — Stack technique gelée
- **React 18 + Vite** ✅
- **Pas de TypeScript** (on n'a pas le temps d'apprendre)
- **Pas de Redux/Zustand** (overkill pour ce projet)
- **Données = fichier JSON statique** importé directement (pas de LowDB)
- **State management = useState + useReducer + 1 seul Context** pour l'état du jeu
- **Styles = CSS Modules** (pas de Tailwind si l'équipe ne maîtrise pas déjà — sinon Tailwind OK)
- **Animations = Framer Motion** (la lib la plus simple, parfaite pour des devs débutants)
- **Déploiement = Vercel** (gratuit, instantané, lien public)

### Décision 4 — Karen et Guillaume = post-soutenance
Je le dis cash : intégrer 2 nouveaux devs débutants React sur un projet en cours à J-2, c'est **du temps perdu**, pas du temps gagné. L'onboarding coûte plus que ce qu'ils peuvent produire en 48h.

→ Ils sont **bénévoles passifs** pour cette soutenance (tests utilisateurs, prise de notes, support présentation) si présents. Le Plan B (4 devs) est **valable uniquement pour une V2 post-soutenance**.

## 3. Top 5 risques techniques identifiés

| # | Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|---|
| 1 | Les visuels arrivent en retard (J-1 soir) → blocage intégration | Élevée | Critique | **Placeholders dès J0** (carrés colorés + texte) pour développer en parallèle. Swap visuels finaux en dernier. |
| 2 | Animations qui plantent/laggent au moment de la démo | Moyenne | Élevé | Désactiver toutes les animations non-essentielles si jamais le navigateur du présentateur rame. Tester sur le device réel de soutenance. |
| 3 | Bug dans la logique de matching des paires | Moyenne | Critique | **Tests manuels exhaustifs** sur chaque paire avant la démo. Pas de Jest, juste un checklist papier. |
| 4 | Repo Git → conflits de merge entre Ramy et Nassim | Élevée | Moyen | **Branches strictes par feature**, pas de commit sur main, PR obligatoires (voir GUIDELINES.md). |
| 5 | Le déploiement Vercel échoue le soir J-1 | Faible | Critique | Plan B : `npm run build` + fichier zip + démo locale en backup. **Ne JAMAIS dépendre du wifi en soutenance**. |

## 4. Ce qui DOIT être livré à la soutenance

**Le minimum vital (ce qui doit absolument marcher) :**
1. ✅ Page d'accueil "Associer le vivant à l'innovation" (cf. wireframe 4)
2. ✅ Au moins 4 paires intégrales avec textes pédagogiques
3. ✅ Parcours séquentiel "Séquence X/Y" fonctionnel
4. ✅ Système de validation correct/incorrect avec feedback visuel
5. ✅ Écran "lien biomimétique" qui explique la paire
6. ✅ Déploiement Vercel + fallback local
7. ✅ Présentation Slides avec justification des choix

**Le souhaitable (si on a le temps) :**
8. 🎯 Les 22 paires intégrées
9. 🎯 Animations soignées (transitions, micro-interactions)
10. 🎯 Responsive mobile
11. 🎯 Sons discrets

**Le bonus (oubliez ça maintenant) :**
- Filtres par thématique
- Mode libre (plateau global)
- Analytics
- Accessibilité poussée
- Tests automatisés
- Intégration iframe dans le site STK (à discuter avec le client en post-soutenance)

## 5. Ma règle d'or pour les 48h qui viennent

**> "Si ça ne contribue pas au minimum vital, ça ne se code pas avant que le minimum vital ne soit terminé."**

Aucune fioriture, aucune refacto, aucune ambition "tant qu'à faire" tant que les 7 items du minimum vital ne sont pas verts.

---

**Documents associés :**
- `01_PLAN_SPRINT_2_DEVS.md` — Plan d'attaque heure par heure (Plan A)
- `02_PLAN_AVEC_RENFORTS.md` — Scénario alternatif (Plan B, post-soutenance)
- `03_ARCHITECTURE_TECHNIQUE.md` — Structure du projet, conventions
- `04_GUIDELINES_EQUIPE.md` — Conventions Git, code, collaboration
