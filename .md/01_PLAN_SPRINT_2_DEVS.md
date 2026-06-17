# 🚀 PLAN A — Sprint 2 jours, 2 devs (Ramy + Nassim)

> **Hypothèse** : Karen et Guillaume n'arrivent pas / ne sont pas intégrés à l'équipe dev.
> **Équipe Plan A** : Ramy (dev), Nassim (dev), Designer 1 (DA + maquettes), Designer 2 (assets + intégration visuelle)

## 📋 Répartition des rôles

| Personne | Rôle principal | Responsabilités |
|---|---|---|
| **Ramy** | **Tech Lead Front + Game logic** | Architecture, state du jeu, logique de matching, animations principales, déploiement Vercel |
| **Nassim** | **Front Dev + Intégration data** | Composants UI, intégration JSON, écrans (accueil, séquence, explication), responsive |
| **Designer 1** | **DA + UI Figma** | Maquettes finales, choix typo/couleurs, screens de référence, présentation |
| **Designer 2** | **Assets + Content** | Sourcing/retouche images, textes pédagogiques finaux, structuration des données |

**Règle d'or répartition dev** : Ramy = logique métier + état global, Nassim = composants visuels + intégration. Pas de chevauchement sauf review mutuelle.

---

## 🗓️ Planning détaillé — Mercredi 20/05 → Vendredi 22/05

### MERCREDI 20/05 — Jour 1 : Foundations (objectif : MVP techniquement fonctionnel à minuit)

#### Matin (4h - 9h à 13h)
**Toute l'équipe — Kick-off interne (30min)**
- ✅ Lecture commune de `00_DIAGNOSTIC_CTO.md` et `04_GUIDELINES_EQUIPE.md`
- ✅ Validation du scope (4-6 paires en Phase 1)
- ✅ Validation des décisions techniques

**Ramy (3h30)**
1. Setup du projet React (s'il n'est pas déjà OK) selon `03_ARCHITECTURE_TECHNIQUE.md`
2. Création du `data/pairs.json` avec **structure complète** (cf. modèle dans archi)
3. Création du `GameContext` (état global)
4. Création du hook `useGame()` (logique de matching, validation, progression)

**Nassim (3h30)**
1. Création du composant `<Card />` avec 2 variants (Inspiration / Innovation) en mode "placeholder" (carrés colorés)
2. Création du composant `<Layout />` (header avec logo STK, footer indicateur de séquence)
3. Création de l'écran d'accueil "Associer le vivant à l'innovation"
4. Mise en place du routing simple (sans react-router : juste un state `currentScreen`)

**Designers (4h en parallèle)**
- Designer 1 : Finalisation DA, design des écrans clés dans Figma, export tokens (couleurs, typos)
- Designer 2 : Sourcing des 6 premiers visuels (priorité aux paires les plus visuelles : baleine/éoliennes, papillon/panneaux, lotus/hydrofuge, gecko/adhésif, requin/combinaison, termitière/Eastgate)

#### Pause déjeuner (1h)

#### Après-midi (5h - 14h à 19h)
**Ramy (5h)**
1. Composant `<SequenceView />` (le cœur : 2 cartes côte à côte + bouton "Lier")
2. Logique de sélection / vérification / feedback (correct → animation + écran explication / incorrect → secousse + bouton "Réessayer")
3. Composant `<ExplanationScreen />` (le "lien biomimétique" - écran de réussite)
4. Branchement du hook `useGame()` sur les composants

**Nassim (5h)**
1. Composant `<ProgressIndicator />` (les grilles de carrés à gauche/droite + "Séquence X/Y")
2. Composant `<Button />` réutilisable (Lier, Réessayer, Suivant, Commencer l'exploration)
3. Styling complet de la page d'accueil
4. CSS global (variables, reset, typographie)

**Designers (5h)**
- Designer 1 : Maquette finale "ExplanationScreen" + revue de cohérence visuelle
- Designer 2 : Finalisation des 6 visuels (retouche, crop, optimisation poids), upload dans le repo `/public/images/cards/`

#### Soirée (jusqu'à minuit)
**Ramy + Nassim ensemble (4h)**
- Première intégration end-to-end avec les 4 premières paires
- Branchement des vrais visuels (remplacement des placeholders)
- **Tests manuels exhaustifs** : chaque paire fonctionne ? Chaque feedback est correct ?
- Premier déploiement Vercel (URL de preview qu'on partage à l'équipe)
- **Commit "Phase 1 - MVP fonctionnel"**

🎯 **Objectif fin J1** : un MVP fonctionnel avec 4 paires, déployé, jouable.

---

### JEUDI 21/05 — Jour 2 : Polish + extension (objectif : démo soutenance prête à 23h)

#### Matin (4h - 9h à 13h)
**Ramy (4h)**
1. Animations Framer Motion (3 essentielles) :
   - Apparition fluide des cartes (fade-in + légère translation)
   - Validation correcte : pulse + glow vert subtil
   - Validation incorrecte : shake horizontal + bordure rouge éphémère
2. Transition entre séquences (fade + slide)
3. Animation de l'écran d'accueil (mouvement organique des carrés en arrière-plan, type "respiration")

**Nassim (4h)**
1. Extension à toutes les paires restantes (16 paires supplémentaires) — il suffit de **dupliquer les entrées du JSON** une fois la structure validée
2. Responsive de base (au moins 1280px, 1024px, 768px ; le mobile = stretch goal)
3. Optimisation des images (lazy loading, format webp si possible)

**Designers (4h)**
- Designer 1 : Slides de présentation finale (Sujet, Concept, Mécanique, DA, Démo, Choix techniques, Pistes d'évolution)
- Designer 2 : Finalisation des visuels restants (16 paires) + textes pédagogiques validés

#### Après-midi (5h - 14h à 19h)
**Ramy (5h)**
1. État final du jeu : écran de fin "Bravo, vous avez exploré X liens biomimétiques !"
2. Sauvegarde simple en `localStorage` de la progression (bonus mais utile pour la démo)
3. Tests sur navigateurs (Chrome obligatoire, Safari et Firefox en bonus)
4. Tests utilisateur internes (designers jouent, on note les frictions)

**Nassim (5h)**
1. Polish UI : alignements pixel-perfect avec les maquettes Figma
2. États hover / focus / actif sur tous les éléments cliquables
3. Accessibilité minimale : focus visible, alt sur les images, contrastes OK
4. Bugfix de tous les retours des tests internes

**Designers (5h)**
- Designer 1 : Répétition de la présentation, ajustements
- Designer 2 : Documentation courte du processus + synthèse des tests utilisateurs (livrable demandé)

#### Soirée (jusqu'à 23h)
**Toute l'équipe**
- 🔒 **CODE FREEZE à 20h** (aucun nouveau code après cette heure, seulement bugfix critique)
- Tests finaux exhaustifs (cf. checklist ci-dessous)
- Build de production + déploiement Vercel final
- Build local exporté en zip (fallback)
- Slides finales relues
- **Répétition complète de la soutenance** avec timing

🎯 **Objectif fin J2** : tout est livrable.

---

### VENDREDI 22/05 — Jour J : Soutenance

#### Matin (3h - 8h à 11h)
**Buffer de sécurité réservé aux dernières corrections critiques uniquement.**
- Test final sur le device de présentation (laptop + écran externe si soutenance en présentiel)
- Test du wifi de la salle
- Connexion au déploiement Vercel
- Backup local prêt sur clé USB
- Slides chargées + ouvertes

#### Après-midi : Soutenance
- 🎤 **Présentation** : Designer 1 mène, Ramy et Nassim démo, Designer 2 répond aux questions sur le contenu pédagogique
- 📦 **Dépôt** : Lien Vercel + slides + doc dans le Google Drive du prof
- 🍻 **Célébration obligatoire**

---

## ✅ Checklist de soutenance (à valider avant code freeze)

### Fonctionnel
- [ ] L'écran d'accueil charge en moins de 2 secondes
- [ ] Le bouton "Commencer l'exploration" amène à la première séquence
- [ ] Chaque carte est cliquable et visuellement sélectionnable
- [ ] Le bouton "Lier" valide une paire et donne le bon feedback
- [ ] Une paire correcte → écran d'explication s'affiche avec le bon texte
- [ ] Le bouton "Suivant" passe à la séquence suivante
- [ ] Une paire incorrecte → feedback visuel + bouton "Réessayer"
- [ ] À la fin du jeu, écran de félicitations s'affiche
- [ ] Le jeu peut être recommencé depuis l'écran final

### Visuel
- [ ] Tous les visuels sont chargés et nets
- [ ] Aucun placeholder n'est visible
- [ ] Les couleurs et typos correspondent aux maquettes Figma
- [ ] Les animations sont fluides (pas de saccades)
- [ ] Le layout est OK sur écran 1280x800 minimum

### Déploiement
- [ ] URL Vercel publique et accessible
- [ ] HTTPS OK
- [ ] Build local en backup sur clé USB
- [ ] Slides exportées en PDF en backup
- [ ] Mode démo testé sur le device réel de présentation

### Soutenance
- [ ] Pitch de 5min répété
- [ ] Démo de 3min répétée (avec un parcours prédéfini)
- [ ] Réponses aux questions probables préparées (cf. ci-dessous)
- [ ] Répartition des rôles claire pendant la soutenance

### Questions probables à anticiper
- Pourquoi avoir choisi un parcours guidé plutôt que le plateau global du brief ?
- Comment le jeu pourrait-il être intégré au site STK ?
- Quelle est la maintenabilité du projet ?
- Pourquoi React et pas du HTML/JS vanilla ?
- Quels tests utilisateurs avez-vous fait ?
- Quels seraient les next steps ?

---

## ⚠️ Plan de gestion de crise

### Si à J-1 le soir on n'a que 4 paires intégrées
✅ **C'est OK.** On présente 4 paires impeccables. On dit "Le système est conçu pour scaler aux 22 paires, voici le JSON template, voici la preuve avec ces 4 paires fluides."

### Si Vercel échoue le matin de la soutenance
✅ Backup local. On lance `npm run dev` sur le laptop. On a téléchargé toutes les images en local.

### Si une animation plante
✅ Désactivation rapide via un flag global `ANIMATIONS_ENABLED = false` dans le code. À préparer.

### Si Nassim ou Ramy est malade J2
✅ Tout le code est dans des PR reviewables. L'autre peut prendre la relève sur les composants déjà commencés.

### Si on a fini J1 à 100% (cas idéal)
✅ J2 est entièrement dédié au polish, au responsive mobile, et à des bonus (effets sonores, écran de bienvenue plus riche, transitions cinématiques). Le scope peut être étendu si le minimum vital est sécurisé.
