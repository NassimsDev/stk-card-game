// ── Radial arc carousel ───────────────────────────────────────────────────────
export const ARC_RADIUS      = 700;  // px — pivot above each card (bigger = flatter arc)
export const ARC_ANGLE       = 6;    // degrees between adjacent cards
export const SLIDE_W         = 108;  // must match .carousel-slide width in CSS
export const CAROUSEL_REPEAT = 3;    // deck copies for fake-infinite scroll

export const LINK_OFFSET = 18;       // px — card separation during link animation

export const AMBIENT_TRACKS = [
  { id: 'oiseaux', label: 'Oiseaux' },
  { id: 'pluie',   label: 'Pluie'   },
  { id: 'fleuve',  label: 'Fleuve'  },
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

// ── Utilities ─────────────────────────────────────────────────────────────────
export function getGlowPath(type, id) {
  const num = String(id).padStart(2, '0');
  return `/assets/cards/glow/card-${type}-glow-${num}.webp`;
}

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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

const linkTransition     = { duration: 0.9,  ease: [0.22, 1, 0.36, 1] };
const shakeTransition    = { duration: 0.55, ease: 'easeInOut' };
const separateTransition = { duration: 0.7,  ease: [0.4, 0, 0.6, 1] };

export function getTransition(linkStatus) {
  if (linkStatus === 'shaking')    return shakeTransition;
  if (linkStatus === 'separating') return separateTransition;
  return linkTransition;
}
