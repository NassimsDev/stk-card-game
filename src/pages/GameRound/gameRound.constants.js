// ── Radial arc carousel ───────────────────────────────────────────────────────
export const ARC_RADIUS      = 700;  // px — pivot above each card (bigger = flatter arc)
export const ARC_ANGLE       = 6;    // degrees between adjacent cards
export const SLIDE_W         = 108;  // must match .carousel-slide width in CSS
export const CAROUSEL_REPEAT = 3;    // deck copies for fake-infinite scroll

export const LINK_OFFSET = 18;       // px — card separation during link animation

// Labels traduits via strings.ambientTracks[id] — voir GameRound.jsx.
export const AMBIENT_TRACKS = [
  { id: 'oiseaux' },
  { id: 'pluie'   },
  { id: 'fleuve'  },
];

// ── Arc transform helpers (imperative DOM — required by Swiper + virtualTranslate) ──
export function applyArcTransforms(swiper) {
  if (!swiper?.slides?.length || !swiper.width) return;
  swiper.slides.forEach((slide) => {
    // Negate progress so swiping left brings the left-side card to center
    const progress = -(parseFloat(slide.progress) || 0);
    const rad      = (progress * ARC_ANGLE * Math.PI) / 180;
    const arcX     = ARC_RADIUS * Math.sin(rad);
    const arcY     = ARC_RADIUS * (1 - Math.cos(rad));
    const naturalCenter = slide.offsetLeft + SLIDE_W / 2;
    const tx       = swiper.width / 2 + arcX - naturalCenter;
    const rotate   = progress * ARC_ANGLE;
    slide.style.transform = `translateX(${tx}px) translateY(${arcY}px) rotate(${rotate}deg)`;
    slide.style.opacity   = '1';
    slide.style.zIndex    = String(100 - Math.abs(Math.round(progress)));
  });
}

export function setArcTransition(swiper, ms) {
  swiper?.slides?.forEach((slide) => {
    slide.style.transitionDuration = `${ms}ms`;
  });
}

// ── i18n ──────────────────────────────────────────────────────────────────────
// pairs.json reste la seule source de vérité : chaque paire porte un champ
// additif `translations.en` (mêmes clés que title/subtitle/shortDescription/alt,
// sans `image` qui est partagée). En anglais, on fusionne ces overrides
// par-dessus le français plutôt que de dupliquer tout le fichier.
export function localizePair(pair, lang) {
  const t = pair.translations?.[lang];
  if (!t) return pair;
  return {
    ...pair,
    theme: t.theme ?? pair.theme,
    inspiration: { ...pair.inspiration, ...t.inspiration },
    innovation: { ...pair.innovation, ...t.innovation },
    explanation: { ...pair.explanation, ...t.explanation },
  };
}

// ── Utilities ─────────────────────────────────────────────────────────────────
export function getGlowPath(type, id, lang = 'fr') {
  const num = String(id).padStart(2, '0');
  const folder = lang === 'en' ? 'english' : 'french';
  return `/assets/cards/${folder}/glow/card-${type}-glow-${num}.webp`;
}

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Builds the mobile carousel's card deck: strictly alternating inspiration/
// innovation cards (two independent shuffles interleaved), re-rolled until
// no pair's two cards land adjacent — checked circularly, since
// CarouselSection repeats this deck back-to-back (CAROUSEL_REPEAT) for the
// fake-infinite scroll, creating a seam between the last and first card of
// each copy.
const MAX_DECK_SHUFFLE_ATTEMPTS = 200;

function hasAdjacentPair(cards) {
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].pairId === cards[(i + 1) % cards.length].pairId) return true;
  }
  return false;
}

function toCarouselCard(pair, type) {
  return { pairId: pair.id, type, image: pair[type].image, alt: pair[type].alt };
}

function interleavedDeck(pairs) {
  const inspiration = shuffleArray(pairs);
  const innovation   = shuffleArray(pairs);
  const deck = [];
  for (let i = 0; i < pairs.length; i++) {
    deck.push(toCarouselCard(inspiration[i], 'inspiration'));
    deck.push(toCarouselCard(innovation[i],   'innovation'));
  }
  return deck;
}

export function buildCarouselDeck(pairs) {
  let deck = interleavedDeck(pairs);
  for (let attempt = 0; attempt < MAX_DECK_SHUFFLE_ATTEMPTS && hasAdjacentPair(deck); attempt++) {
    deck = interleavedDeck(pairs);
  }
  return deck;
}

// ── Framer Motion variants ────────────────────────────────────────────────────
export const inspirationVariants = {
  idle:            { x: 0 },
  linking:         { x: LINK_OFFSET },
  linked:          { x: LINK_OFFSET },
  'linking-wrong': { x: LINK_OFFSET },
  shaking: {
    x: [
      LINK_OFFSET,
      LINK_OFFSET + 10, LINK_OFFSET - 10,
      LINK_OFFSET + 6,  LINK_OFFSET - 6,
      LINK_OFFSET + 3,  LINK_OFFSET - 3,
      LINK_OFFSET,
    ],
  },
  separating: { x: 0 },
};

export const innovationVariants = {
  idle:            { x: 0 },
  linking:         { x: -LINK_OFFSET },
  linked:          { x: -LINK_OFFSET },
  'linking-wrong': { x: -LINK_OFFSET },
  shaking: {
    x: [
      -LINK_OFFSET,
      -LINK_OFFSET - 10, -LINK_OFFSET + 10,
      -LINK_OFFSET - 6,  -LINK_OFFSET + 6,
      -LINK_OFFSET - 3,  -LINK_OFFSET + 3,
      -LINK_OFFSET,
    ],
  },
  separating: { x: 0 },
};

// Durée (ms) de l'animation de "settle" des cartes après un clic sur Suivant.
const LINK_SETTLE_MS = 900;

// Délai (ms) avant de révéler le CTA "Ma collection" — le settle des cartes,
// plus une marge pour laisser la transition se stabiliser visuellement.
export const COLLECTION_REVEAL_DELAY_MS = LINK_SETTLE_MS + 800;

const linkTransition     = { duration: LINK_SETTLE_MS / 1000, ease: [0.22, 1, 0.36, 1] };
const shakeTransition    = { duration: 0.55, ease: 'easeInOut' };
const separateTransition = { duration: 0.7,  ease: [0.4, 0, 0.6, 1] };

export function getTransition(linkStatus) {
  if (linkStatus === 'shaking')    return shakeTransition;
  if (linkStatus === 'separating') return separateTransition;
  return linkTransition;
}
