# 📚 STK Game — Documentation projet (Index)

> Pack de documents CTO pour l'équipe HETIC, projet client STK Architecture.
> **Soutenance : 22/05/2026** — Sprint d'urgence de 2 jours.

> ⚠️ Ce fichier est l'index des docs CTO. Le `README.md` du dossier est le README Vite du projet React lui-même (ne pas écraser).

---

## 🗂️ Documents

| # | Document | Pour qui ? | Quand le lire ? |
|---|---|---|---|
| **00** | [DIAGNOSTIC_CTO](./00_DIAGNOSTIC_CTO.md) | Toute l'équipe + Ramy | **Maintenant, en premier** |
| **01** | [PLAN_SPRINT_2_DEVS](./01_PLAN_SPRINT_2_DEVS.md) | Ramy, Nassim, Designers | Avant de démarrer la journée 1 |
| **02** | [PLAN_AVEC_RENFORTS](./02_PLAN_AVEC_RENFORTS.md) | Ramy (et Karen/Guillaume si rejoignent) | Post-soutenance, pour la V2 |
| **03** | [ARCHITECTURE_TECHNIQUE](./03_ARCHITECTURE_TECHNIQUE.md) | Ramy, Nassim (devs) | Avant d'écrire la 1re ligne de code |
| **04** | [GUIDELINES_EQUIPE](./04_GUIDELINES_EQUIPE.md) | Toute l'équipe dev | Avant le 1er commit |

---

## ⚡ TL;DR — Les 5 choses à retenir

1. **2 jours, 4 personnes (2 devs + 2 designers).** Karen et Guillaume = bénévoles non-dev pour cette soutenance.
2. **MVP Phase 1 (priorité absolue) : 4-6 paires entièrement intégrées et jouables.** Le reste = bonus.
3. **Stack gelée** : React + Vite + Context + JSON + CSS Modules + Framer Motion + Vercel. Pas de Redux, pas de LowDB, pas de TS.
4. **Parcours UX = séquencé** (Séquence 1/4, 2/4, etc. comme dans les wireframes). On justifie le choix en soutenance.
5. **Code Freeze J-1 à 20h.** Aucun code après. On polit, on teste, on déploie, on dort.

---

## 🚦 Premier pas pour chaque rôle

### Ramy (Tech Lead Front)
1. Lis 00 (diagnostic) puis 01 (plan sprint) puis 03 (archi)
2. Vérifie le setup du repo (Vite OK ? ESLint ? Prettier ? Vercel relié ?)
3. Crée le `src/data/pairs.json` avec la structure du doc 03
4. Code le `GameContext` et le hook `useGame`

### Nassim (Dev Front + Intégration)
1. Lis 00, 01, 03, 04
2. Lis le code de Ramy une fois committé sur main
3. Attaque le composant `<Card />` en mode placeholder
4. Puis l'écran d'accueil

### Designer 1 (DA/UI Figma)
1. Lis 00 et la section qui te concerne dans 01
2. Finalise la DA dans Figma (typo, palette, ambiance) — référence : maquette site STK fournie
3. Maquette finale des 4 écrans : Home / Sequence / Explanation / End
4. Démarre les slides de la soutenance dès J-1 matin

### Designer 2 (Assets/Content)
1. Lis 00 et la section qui te concerne dans 01
2. Source les 6 premiers visuels (paires les plus impactantes visuellement)
3. Optimise les images (webp, max 200KB, 1200px de large)
4. Valide les textes pédagogiques avec le client si possible

---

## 🆘 En cas de doute

- **Question technique** → Ramy
- **Question de scope** → Ramy (CTO en sprint)
- **Question de DA** → Designer 1
- **Question de contenu pédagogique** → Designer 2
- **Question de timing** → relis le doc 01

---

**Bonne soutenance. On est là pour livrer un truc qu'on est fiers de montrer.**
