// Traductions UI (hors contenu des 21 paires, qui vit dans pairs.json).
// Une entrée peut être une chaîne simple ou une fonction (n, total) => string
// pour les textes avec valeurs interpolées (compteurs, pluriels...).
export const strings = {
  fr: {
    common: {
      logoAlt: "Retourner à la page d'accueil",
      soundOn: 'Activer le son',
      soundOff: 'Couper le son',
      langToggleAria: 'Passer le jeu en anglais',
    },
    landing: {
      subtitle: "Explorez les liens invisibles entre le vivant et l'innovation. Chaque carte révèle comment la nature inspire nos inventions.",
      cta: "Commencer l'exploration",
    },
    onboarding: {
      slides: [
        {
          eyebrow: 'Le biomimétisme',
          body: 'Explorez, associez et découvrez comment ses stratégies inspirent nos façons de concevoir, construire et innover.',
        },
        {
          eyebrow: 'Comment faire le lien',
          body: "Le vivant est un immense laboratoire de recherche. Associez chaque carte de la nature à son innovation pour découvrir le lien qui les unit.",
        },
        {
          eyebrow: "Besoin d'aide ?",
          body: "Des indices sont disponibles à tout moment pour vous guider si vous le souhaitez",
        },
      ],
      next: 'Suivant',
      play: 'Jouer',
      slideAria: (n) => `Slide ${n}`,
    },
    transition: {
      sequenceWord: 'Séquence',
      start: 'Commencer',
    },
    end: {
      titleLine1: 'Parcours',
      titleItalic: 'terminé',
      descriptionBefore: 'Vous avez exploré',
      descriptionAfter: "liens entre le vivant et l'innovation",
      accroche: 'Le biomimétisme inspire chaque projet que nous concevons',
      discoverCta: 'Découvrir les projets STK',
      replay: 'Rejouer le parcours',
    },
    gameRound: {
      ambiance: 'Ambiance',
      collection: 'Ma collection',
      sequence: (n, total) => `Séquence ${n}/${total}`,
      pairsFound: (found, total) => `${found}/${total} paires trouvées`,
      wrongTitle: 'Dommage ! Observez à nouveau',
      wrongBody: "Admirez comment une forme peut réduire l'effort d'un mouvement",
      continueHint: "Continuez à découvrir les autres liens entre le vivant et l'innovation",
      nextSequence: 'Séquence suivante',
      finish: 'Terminer',
      link: 'Lier',
      next: 'Suivant',
    },
    ambientTracks: {
      oiseaux: 'Oiseaux',
      pluie: 'Pluie',
      fleuve: 'Fleuve',
    },
    cardSlot: {
      selectInspiration: 'Cliquez pour sélectionner une carte Inspiration',
      selectInnovation: 'Cliquez pour sélectionner une carte innovation',
      hintShow: "Voir l'indice",
      hintHide: "Masquer l'indice",
    },
    cardGrid: {
      selectInspirationAria: (title) => `Sélectionner l'inspiration ${title}`,
      selectInnovationAria: (title) => `Sélectionner l'innovation ${title}`,
    },
    collection: {
      title: 'Ma collection',
      count: (n) => `${n} paire${n > 1 ? 's' : ''} trouvée${n > 1 ? 's' : ''}`,
      emptyLine1: 'Aucune paire découverte pour le moment.',
      emptyLine2: 'Liez des cartes pour enrichir votre collection.',
      closeAria: 'Fermer la collection',
      openAria: 'Ouvrir ma collection',
    },
  },

  en: {
    common: {
      logoAlt: 'Back to the home screen',
      soundOn: 'Turn sound on',
      soundOff: 'Turn sound off',
      langToggleAria: 'Switch the game to French',
    },
    landing: {
      subtitle: 'Explore the hidden links between nature and innovation. Every card reveals how the living world inspires our inventions.',
      cta: 'Start exploring',
    },
    onboarding: {
      slides: [
        {
          eyebrow: 'Biomimicry',
          body: 'Explore, match, and discover how nature’s strategies inspire the way we design, build, and innovate.',
        },
        {
          eyebrow: 'How the matching works',
          body: 'The living world is a vast research lab. Match each nature card with its innovation to uncover the link between them.',
        },
        {
          eyebrow: 'Need a hand?',
          body: 'Hints are available at any time to guide you, whenever you need them',
        },
      ],
      next: 'Next',
      play: 'Play',
      slideAria: (n) => `Slide ${n}`,
    },
    transition: {
      sequenceWord: 'Sequence',
      start: 'Start',
    },
    end: {
      titleLine1: 'Journey',
      titleItalic: 'complete',
      descriptionBefore: 'You explored',
      descriptionAfter: 'links between nature and innovation',
      accroche: 'Biomimicry inspires every project we design',
      discoverCta: 'Discover STK projects',
      replay: 'Replay the journey',
    },
    gameRound: {
      ambiance: 'Ambience',
      collection: 'My collection',
      sequence: (n, total) => `Sequence ${n}/${total}`,
      pairsFound: (found, total) => `${found}/${total} pairs found`,
      wrongTitle: 'Too bad! Take another look',
      wrongBody: 'Notice how a shape can reduce the effort of a movement',
      continueHint: 'Keep discovering the other links between nature and innovation',
      nextSequence: 'Next sequence',
      finish: 'Finish',
      link: 'Link',
      next: 'Next',
    },
    ambientTracks: {
      oiseaux: 'Birds',
      pluie: 'Rain',
      fleuve: 'River',
    },
    cardSlot: {
      selectInspiration: 'Click to select an Inspiration card',
      selectInnovation: 'Click to select an innovation card',
      hintShow: 'Show hint',
      hintHide: 'Hide hint',
    },
    cardGrid: {
      selectInspirationAria: (title) => `Select the ${title} inspiration card`,
      selectInnovationAria: (title) => `Select the ${title} innovation card`,
    },
    collection: {
      title: 'My collection',
      count: (n) => `${n} pair${n > 1 ? 's' : ''} found`,
      emptyLine1: 'No pair discovered yet.',
      emptyLine2: 'Link cards to grow your collection.',
      closeAria: 'Close the collection',
      openAria: 'Open my collection',
    },
  },
};
