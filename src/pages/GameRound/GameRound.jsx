import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { soundManager } from '../../utils/soundManager';
import styles from './GameRound.module.css';
import 'swiper/css';

// ── Radial arc carousel ───────────────────────────────────────────────────────
const ARC_RADIUS  = 700;   // px — pivot above each card (bigger = flatter arc)
const ARC_ANGLE   = 6;     // degrees between adjacent cards (small = readable)
const SLIDE_W     = 108;   // must match .carousel-slide width in CSS

function applyArcTransforms(swiper) {
    if (!swiper?.slides?.length || !swiper.width) return;
    swiper.slides.forEach((slide) => {
        // Negate progress so swiping left brings the left-side card to center
        const progress = -(parseFloat(slide.progress) || 0);
        const rad = (progress * ARC_ANGLE * Math.PI) / 180;
        const arcX = ARC_RADIUS * Math.sin(rad);
        const arcY = ARC_RADIUS * (1 - Math.cos(rad));
        const naturalCenter = slide.offsetLeft + SLIDE_W / 2;
        const tx = swiper.width / 2 + arcX - naturalCenter;
        const rotate = progress * ARC_ANGLE;
        slide.style.transform = `translateX(${tx}px) translateY(${arcY}px) rotate(${rotate}deg)`;
        slide.style.opacity   = '1';
        slide.style.zIndex    = String(100 - Math.abs(Math.round(progress)));
    });
}

// Helpers pour gérer la durée de transition CSS sur chaque slide
function setArcTransition(swiper, ms) {
    swiper?.slides?.forEach((slide) => {
        slide.style.transitionDuration = `${ms}ms`;
    });
}

const LINK_OFFSET = 18;

const AMBIENT_TRACKS = [
  { id: 'oiseaux', label: 'Oiseaux' },
  { id: 'pluie',   label: 'Pluie'   },
  { id: 'fleuve',  label: 'Fleuve'  },
];

function getGlowPath(type, id) {
  const num = String(id).padStart(2, '0');
  return `/assets/cards/glow/card-${type}-glow-${num}.webp`;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const inspirationVariants = {
  idle: { x: 0 },
  linking: { x: LINK_OFFSET },
  linked: { x: LINK_OFFSET },
  'linking-wrong': { x: LINK_OFFSET },
  shaking: {
    x: [
      LINK_OFFSET,
      LINK_OFFSET + 10, LINK_OFFSET - 10,
      LINK_OFFSET + 6, LINK_OFFSET - 6,
      LINK_OFFSET + 3, LINK_OFFSET - 3,
      LINK_OFFSET,
    ],
  },
  separating: { x: 0 },
};

const innovationVariants = {
  idle: { x: 0 },
  linking: { x: -LINK_OFFSET },
  linked: { x: -LINK_OFFSET },
  'linking-wrong': { x: -LINK_OFFSET },
  shaking: {
    x: [
      -LINK_OFFSET,
      -LINK_OFFSET - 10, -LINK_OFFSET + 10,
      -LINK_OFFSET - 6, -LINK_OFFSET + 6,
      -LINK_OFFSET - 3, -LINK_OFFSET + 3,
      -LINK_OFFSET,
    ],
  },
  separating: { x: 0 },
};

const linkTransition = { duration: 0.9, ease: [0.22, 1, 0.36, 1] };
const shakeTransition = { duration: 0.55, ease: 'easeInOut' };
const separateTransition = { duration: 0.7, ease: [0.4, 0, 0.6, 1] };

function getTransition(linkStatus) {
  if (linkStatus === 'shaking') return shakeTransition;
  if (linkStatus === 'separating') return separateTransition;
  return linkTransition;
}

export default function GameRound({ pairs, sequenceNumber, totalSequences, onComplete, onHome }) {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [linkStatus, setLinkStatus] = useState('idle');
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [matchedPairIds, setMatchedPairIds] = useState([]);
  const [hintLeftOpen, setHintLeftOpen] = useState(false);
  const [hintRightOpen, setHintRightOpen] = useState(false);
  const [hintLeftUsed, setHintLeftUsed] = useState(false);
  const [hintRightUsed, setHintRightUsed] = useState(false);
  const [shuffledInspiration] = useState(() => shuffleArray(pairs));
  const [shuffledInnovation] = useState(() => shuffleArray(pairs));
  const [dragOverSide, setDragOverSide] = useState(null);
  const [lierFading, setLierFading] = useState(false);
  const [ambientTrack, setAmbientTrack] = useState('oiseaux');
  const [isAmbientOpen, setIsAmbientOpen] = useState(false);
  const ambientRef = useRef(null);

  // ── Mobile Swiper carousel ──────────────────────────────────────────────────
  const swiperInstanceRef = useRef(null);
  // Track which absolute slide index was tapped, so only that copy shows the
  // green border — not all 5 duplicates in the repeated deck.
  const [selectedCarouselLeftIdx, setSelectedCarouselLeftIdx] = useState(null);
  const [selectedCarouselRightIdx, setSelectedCarouselRightIdx] = useState(null);

  // Interleave inspiration + innovation cards for the carousel (computed once)
  const [carouselCards] = useState(() => {
    const cards = [];
    const maxLen = Math.max(shuffledInspiration.length, shuffledInnovation.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < shuffledInspiration.length) {
        cards.push({
          pairId: shuffledInspiration[i].id,
          type: 'inspiration',
          image: shuffledInspiration[i].inspiration.image,
          alt: shuffledInspiration[i].inspiration.alt,
        });
      }
      if (i < shuffledInnovation.length) {
        cards.push({
          pairId: shuffledInnovation[i].id,
          type: 'innovation',
          image: shuffledInnovation[i].innovation.image,
          alt: shuffledInnovation[i].innovation.alt,
        });
      }
    }
    return cards;
  });

  // Refresh Swiper layout after matched cards are filtered out
  useEffect(() => {
    const t = setTimeout(() => {
      swiperInstanceRef.current?.update();
    }, 80);
    return () => clearTimeout(t);
  }, [matchedPairIds.length]);

  // ── Ambient ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAmbientOpen) return;
    const handleClickOutside = (e) => {
      if (ambientRef.current && !ambientRef.current.contains(e.target)) {
        setIsAmbientOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAmbientOpen]);

  const handleAmbientSelect = (trackId) => {
    setAmbientTrack(trackId);
    soundManager.switchBgMusic(trackId);
    setIsAmbientOpen(false);
  };

  // ── Game logic ─────────────────────────────────────────────────────────────
  const isAnimating = ['linking', 'linking-wrong', 'shaking', 'separating'].includes(linkStatus);
  const allFound = matchedPairIds.length === pairs.length;

  const selectedLeftPair = pairs.find(p => p.id === selectedLeft) ?? null;
  const selectedRightPair = pairs.find(p => p.id === selectedRight) ?? null;
  const linkedPair = pairs.find(p => p.id === selectedLeft) ?? null;

  const showLierButton = !allFound && linkStatus === 'idle' && !wrongAttempt
    && selectedLeft !== null && selectedRight !== null
    && !matchedPairIds.includes(selectedLeft)
    && !matchedPairIds.includes(selectedRight);

  useEffect(() => {
    if (showLierButton) setLierFading(false);
  }, [showLierButton]);

  const handleLierClick = () => {
    if (isAnimating || linkStatus !== 'idle' || lierFading) return;
    soundManager.play('button');
    const isMatch = selectedLeft === selectedRight;
    setLierFading(true);
    setTimeout(() => {
      setLinkStatus(isMatch ? 'linking' : 'linking-wrong');
    }, 220);
  };

  const handleAnimationComplete = (definition) => {
    if (definition === 'linking') {
      soundManager.play('correct');
      setLinkStatus('linked');
    }
    if (definition === 'linking-wrong') {
      soundManager.play('wrong');
      setLinkStatus('shaking');
    }
    if (definition === 'shaking') setLinkStatus('separating');
    if (definition === 'separating') {
      setLinkStatus('idle');
      setWrongAttempt(true);
    }
  };

  const handleSuivant = () => {
    soundManager.play('button');
    const newMatched = matchedPairIds.includes(selectedLeft)
      ? matchedPairIds
      : [...matchedPairIds, selectedLeft];
    setMatchedPairIds(newMatched);

    const remaining = pairs.filter(p => !newMatched.includes(p.id));
    if (remaining.length > 0) {
      const pick = () => remaining[Math.floor(Math.random() * remaining.length)].id;
      setSelectedLeft(pick());
      setSelectedRight(pick());
    }

    setLinkStatus('idle');
    setWrongAttempt(false);
    setHintLeftOpen(false);
    setHintRightOpen(false);
    setHintLeftUsed(false);
    setHintRightUsed(false);
    setSelectedCarouselLeftIdx(null);
    setSelectedCarouselRightIdx(null);
  };

  const commitMatchIfLinked = () => {
    if (linkStatus === 'linked') {
      setMatchedPairIds(prev => (prev.includes(selectedLeft) ? prev : [...prev, selectedLeft]));
      setLinkStatus('idle');
      setHintLeftOpen(false);
      setHintRightOpen(false);
      setHintLeftUsed(false);
      setHintRightUsed(false);
    }
  };

  const handleSelectLeft = (id) => {
    if (isAnimating || matchedPairIds.includes(id)) return;
    commitMatchIfLinked();
    if (id !== selectedLeft) {
      soundManager.play('cardFlip');
      setHintLeftOpen(false);
      setHintLeftUsed(false);
    }
    setSelectedLeft(id);
    if (wrongAttempt) setWrongAttempt(false);
  };

  const handleSelectRight = (id) => {
    if (isAnimating || matchedPairIds.includes(id)) return;
    commitMatchIfLinked();
    if (id !== selectedRight) {
      soundManager.play('cardFlip');
      setHintRightOpen(false);
      setHintRightUsed(false);
    }
    setSelectedRight(id);
    if (wrongAttempt) setWrongAttempt(false);
  };

  const canShowHintToggle = linkStatus === 'idle';

  const makeDropHandlers = (side) => ({
    onDragOver: (e) => {
      e.preventDefault();
      if (dragOverSide !== side) setDragOverSide(side);
    },
    onDragLeave: () => setDragOverSide(null),
    onDrop: (e) => {
      e.preventDefault();
      const data = e.dataTransfer.getData('application/x-stk-card');
      setDragOverSide(null);
      const prefix = `${side}:`;
      if (!data.startsWith(prefix)) return;
      const id = Number(data.slice(prefix.length));
      if (Number.isNaN(id)) return;
      if (side === 'left') handleSelectLeft(id);
      else handleSelectRight(id);
    },
  });

  // ── Renderers ──────────────────────────────────────────────────────────────
  const renderLeftGrid = () => shuffledInspiration.map((pair) => {
    const isSelected = selectedLeft === pair.id;
    const isMatched = matchedPairIds.includes(pair.id);
    return (
      <div
        key={`left-${pair.id}`}
        className={`${styles['grid-square']}${isSelected ? ` ${styles.selected}` : ''}${(isAnimating || isMatched) ? ` ${styles.locked}` : ''}${isMatched ? ` ${styles.matched}` : ''}`}
        onClick={() => handleSelectLeft(pair.id)}
        draggable={!isAnimating && !isMatched}
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('application/x-stk-card', `left:${pair.id}`);
        }}
        aria-label={`Sélectionner l'inspiration ${pair.inspiration.title}`}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleSelectLeft(pair.id);
          }
        }}
      >
        <img src={pair.inspiration.image} alt={pair.inspiration.alt} className={styles['grid-img']} />
      </div>
    );
  });

  const renderRightGrid = () => shuffledInnovation.map((pair) => {
    const isSelected = selectedRight === pair.id;
    const isMatched = matchedPairIds.includes(pair.id);
    return (
      <div
        key={`right-${pair.id}`}
        className={`${styles['grid-square']}${isSelected ? ` ${styles.selected}` : ''}${(isAnimating || isMatched) ? ` ${styles.locked}` : ''}${isMatched ? ` ${styles.matched}` : ''}`}
        onClick={() => handleSelectRight(pair.id)}
        draggable={!isAnimating && !isMatched}
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('application/x-stk-card', `right:${pair.id}`);
        }}
        aria-label={`Sélectionner l'innovation ${pair.innovation.title}`}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleSelectRight(pair.id);
          }
        }}
      >
        <img src={pair.innovation.image} alt={pair.innovation.alt} className={styles['grid-img']} />
      </div>
    );
  });

  // ── Mobile carousel visible cards (exclude matched pairs) ─────────────────
  const visibleCarouselCards = carouselCards.filter(c => !matchedPairIds.includes(c.pairId));

  // Repeat the deck 3× so the carousel feels infinite without Swiper's loop
  // (loop + virtualTranslate don't work together — the wrapper never moves in DOM).
  // When the user reaches the outer copy, onSlideChange silently re-centers to
  // the middle copy — same illusion of infinite scroll with 40% fewer DOM nodes.
  const CAROUSEL_REPEAT = 3;
  const repeatedCarouselCards = useMemo(() => {
    if (visibleCarouselCards.length === 0) return [];
    const out = [];
    for (let i = 0; i < CAROUSEL_REPEAT; i++) out.push(...visibleCarouselCards);
    return out;
  }, [visibleCarouselCards]);
  const carouselInitialSlide = Math.floor(CAROUSEL_REPEAT / 2) * visibleCarouselCards.length;

  return (
    <motion.div
      className={styles['game-round']}
      key="game-round"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className={styles.header}>
        <div className="logo-placeholder">
          <button
            onClick={onHome}
            className={styles['logo-link']}
            aria-label="Retourner à la page d'accueil"
          >
            <img src="/assets/images/STK-logo.svg" alt="STK Architecture" className={styles['header-logo']} />
          </button>
        </div>
        <div className={styles['ambient-wrapper']} ref={ambientRef}>
          <button
            className={styles['ambient-btn']}
            onClick={() => setIsAmbientOpen(v => !v)}
            aria-haspopup="listbox"
            aria-expanded={isAmbientOpen}
          >
            <span className={styles['ambient-icon']} aria-hidden="true">♪</span>
            Ambiance
          </button>
          <AnimatePresence>
            {isAmbientOpen && (
              <motion.div
                className={styles['ambient-dropdown']}
                role="listbox"
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              >
                {AMBIENT_TRACKS.map(track => (
                  <button
                    key={track.id}
                    role="option"
                    aria-selected={ambientTrack === track.id}
                    className={`${styles['ambient-option']}${ambientTrack === track.id ? ` ${styles['ambient-option-active']}` : ''}`}
                    onClick={() => handleAmbientSelect(track.id)}
                  >
                    {ambientTrack === track.id && <span className={styles['ambient-check']} aria-hidden="true">✓</span>}
                    {track.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles['header-right']}>
          <div className={styles.sequence}>
            Séquence {sequenceNumber}/{totalSequences}
          </div>
          <div className={styles['pairs-counter']}>
            {matchedPairIds.length}/{pairs.length} paires trouvées
          </div>
        </div>
      </header>

      <main className={styles['main-content']}>
        <div className={styles['cards-row']}>
          {/* Grille gauche — masquée sur mobile, remplacée par le carousel */}
          <div className={styles['grid-container']}>{renderLeftGrid()}</div>

          {/* Colonne centrale : cartes + actions */}
          <div className={styles['center-column']}>
            <div className={styles['cards-pair']}>

          {/* Carte Inspiration */}
          <motion.div
            className={`${styles['card-wrapper']} ${styles['card-wrapper-left']}`}
            variants={inspirationVariants}
            animate={linkStatus}
            transition={getTransition(linkStatus)}
            onAnimationComplete={handleAnimationComplete}
          >
            <div
              className={`${styles.card} ${styles['placeholder-card-left']}${dragOverSide === 'left' ? ` ${styles['drop-target-active']}` : ''}`}
              {...makeDropHandlers('left')}
            >
              <AnimatePresence mode="wait">
                {selectedLeftPair ? (
                  <motion.img
                    key={selectedLeftPair.id}
                    src={selectedLeftPair.inspiration.image}
                    alt={selectedLeftPair.inspiration.alt}
                    className={styles['card-img']}
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: -90 }}
                    transition={{ duration: 0.25, ease: 'linear' }}
                  />
                ) : (
                  <motion.div
                    key="placeholder-left"
                    className={styles['card-placeholder-state']}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className={styles['card-placeholder-arrow']}>←</span>
                    <span className={styles['card-placeholder-text']}>Sélectionner une carte <br/> Inspiration </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {selectedLeftPair && (
                <motion.img
                  src={getGlowPath('inspiration', selectedLeftPair.id)}
                  alt=""
                  className={styles['card-img']}
                  style={{ zIndex: 1 }}
                  initial={{ opacity: 0, scale: 1 }}
                  animate={
                    linkStatus === 'linked'
                      ? { opacity: 1, scale: [1, 1.05, 1] }
                      : { opacity: 0, scale: 1 }
                  }
                  transition={{
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.6, ease: 'easeInOut' },
                  }}
                />
              )}
            </div>

            <div className={`${styles['hint-container-fixed']}${!canShowHintToggle ? ` ${styles['hint-container-collapsed']}` : ''}${linkStatus === 'linked' ? ` ${styles['hint-container-linked']}` : ''}`}>
              <AnimatePresence mode="wait">
                {canShowHintToggle && selectedLeftPair && (
                  <motion.button
                    key="hint-toggle-left"
                    type="button"
                    className={styles['hint-toggle']}
                    onClick={() => { setHintLeftOpen(v => !v); setHintLeftUsed(true); }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0 } }}
                    transition={{ duration: 0.25 }}
                  >
                    <span className={styles['hint-toggle-icon']} aria-hidden="true">?</span>
                    {hintLeftOpen ? "Masquer l'indice" : "Voir l'indice"}
                  </motion.button>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {canShowHintToggle && selectedLeftPair && hintLeftOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className={styles.description}>
                      <h3>{selectedLeftPair.inspiration.title}</h3>
                      <p>{selectedLeftPair.inspiration.shortDescription}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Carte Innovation */}
          <motion.div
            className={`${styles['card-wrapper']} ${styles['card-wrapper-right']}`}
            variants={innovationVariants}
            animate={linkStatus}
            transition={getTransition(linkStatus)}
          >
            <div
              className={`${styles.card} ${styles['placeholder-card-right']}${dragOverSide === 'right' ? ` ${styles['drop-target-active']}` : ''}`}
              {...makeDropHandlers('right')}
            >
              <AnimatePresence mode="wait">
                {selectedRightPair ? (
                  <motion.img
                    key={selectedRightPair.id}
                    src={selectedRightPair.innovation.image}
                    alt={selectedRightPair.innovation.alt}
                    className={styles['card-img']}
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: -90 }}
                    transition={{ duration: 0.25, ease: 'linear' }}
                  />
                ) : (
                  <motion.div
                    key="placeholder-right"
                    className={styles['card-placeholder-state']}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className={styles['card-placeholder-arrow']}>→</span>
                    <span className={styles['card-placeholder-text']}>Sélectionner une carte<br/> innovation </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {selectedRightPair && (
                <motion.img
                  src={getGlowPath('innovation', selectedRightPair.id)}
                  alt=""
                  className={styles['card-img']}
                  style={{ zIndex: 1 }}
                  initial={{ opacity: 0, scale: 1 }}
                  animate={
                    linkStatus === 'linked'
                      ? { opacity: 1, scale: [1, 1.05, 1] }
                      : { opacity: 0, scale: 1 }
                  }
                  transition={{
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.6, ease: 'easeInOut' },
                  }}
                />
              )}
            </div>

            <div className={`${styles['hint-container-fixed']}${!canShowHintToggle ? ` ${styles['hint-container-collapsed']}` : ''}${linkStatus === 'linked' ? ` ${styles['hint-container-linked']}` : ''}`}>
              <AnimatePresence mode="wait">
                {canShowHintToggle && selectedRightPair && (
                  <motion.button
                    key="hint-toggle-right"
                    type="button"
                    className={styles['hint-toggle']}
                    onClick={() => { setHintRightOpen(v => !v); setHintRightUsed(true); }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0 } }}
                    transition={{ duration: 0.25 }}
                  >
                    <span className={styles['hint-toggle-icon']} aria-hidden="true">?</span>
                    {hintRightOpen ? "Masquer l'indice" : "Voir l'indice"}
                  </motion.button>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {canShowHintToggle && selectedRightPair && hintRightOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className={styles.description}>
                      <h3>{selectedRightPair.innovation.title}</h3>
                      <p>{selectedRightPair.innovation.shortDescription}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

            </div>

            {/* Section bas */}
            <motion.div
              layout
              transition={{ layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
              className={styles['bottom-action-section']}
            >
              <AnimatePresence>
                {linkStatus === 'linked' && linkedPair && (
                  <motion.div
                    className={`${styles['explanation-text']} ${styles['link-success']}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <h2>{linkedPair.explanation.title}</h2>
                    <p>{linkedPair.explanation.body}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {linkStatus === 'idle' && wrongAttempt && (
                  <motion.div
                    className={styles['explanation-text']}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2>Piste d'observation</h2>
                    <p>Observez comment une forme peut réduire l'effort d'un mouvement.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {linkStatus === 'idle' && !wrongAttempt
                  && !hintLeftUsed && !hintRightUsed
                  && matchedPairIds.length > 0
                  && matchedPairIds.length < pairs.length && (
                  <motion.div
                    className={`${styles['explanation-text']} ${styles['continue-hint']}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p>Continuez à découvrir les autres liens entre le vivant et l'innovation.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                layout
                transition={{ layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
                className={styles['center-action']}
              >
                <AnimatePresence mode="wait">
                  {allFound && linkStatus === 'idle' && (
                    <motion.button
                      key="sequence-suivante"
                      className={styles['btn-lier']}
                      onClick={() => {
                        soundManager.play('button');
                        onComplete();
                      }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                      {sequenceNumber < totalSequences ? 'Séquence suivante' : 'Terminer'}
                    </motion.button>
                  )}
                  {showLierButton && (
                    <motion.button
                      key="lier"
                      className={styles['btn-lier']}
                      onClick={handleLierClick}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={lierFading ? { opacity: 0, scale: 0.85 } : { opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      Lier
                    </motion.button>
                  )}
                  {linkStatus === 'linked' && (
                    <motion.button
                      key="suivant"
                      className={styles['btn-lier']}
                      onClick={handleSuivant}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: 'easeIn' }}
                    >
                      Suivant
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>

          {/* Grille droite — masquée sur mobile, remplacée par le carousel */}
          <div className={styles['grid-container']}>{renderRightGrid()}</div>
        </div>

        {/* ── Mobile Swiper carousel ── hidden on desktop via CSS ─────────────── */}
        <div className={styles['mobile-carousel']}>
          <Swiper
            virtualTranslate
            watchSlidesProgress
            centeredSlides
            slidesPerView="auto"
            speed={550}
            shortSwipes
            longSwipesRatio={0.2}
            resistance
            resistanceRatio={0.55}
            initialSlide={carouselInitialSlide}
            onSwiper={(s) => {
              swiperInstanceRef.current = s;
              requestAnimationFrame(() => applyArcTransforms(s));
            }}
            onSlideChange={(s) => {
              // Re-center silently when the user reaches the first or last copy,
              // so the middle copy is always reachable in both directions.
              const len = visibleCarouselCards.length;
              if (len === 0) return;
              const idx = s.activeIndex;
              if (idx < len)         s.slideTo(idx + len, 0, false);
              else if (idx >= len * 2) s.slideTo(idx - len, 0, false);
            }}
            onSetTranslate={applyArcTransforms}
            onResize={applyArcTransforms}
            onSetTransition={(s, duration) => {
              setArcTransition(s, duration);
            }}
            onTouchStart={(s) => {
              setArcTransition(s, 0);
            }}
            modules={[]}
            key={`carousel-${visibleCarouselCards.length}`}
            className={styles['carousel-swiper']}
          >
            {repeatedCarouselCards.map((card, idx) => {
              // Compare by absolute idx (not pairId) so only the tapped copy
              // gets the green border — not all 3 duplicates in the repeated deck.
              const isSelected =
                (card.type === 'inspiration' && idx === selectedCarouselLeftIdx) ||
                (card.type === 'innovation'  && idx === selectedCarouselRightIdx);

              return (
                <SwiperSlide
                  key={`${card.type}-${card.pairId}-${idx}`}
                  className={styles['carousel-slide']}
                >
                  <motion.div
                    className={[
                      styles['carousel-card'],
                      isSelected ? styles['carousel-card-selected'] : '',
                      isAnimating ? styles['carousel-card-locked'] : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => {
                      if (isAnimating) return;
                      if (card.type === 'inspiration') {
                        handleSelectLeft(card.pairId);
                        setSelectedCarouselLeftIdx(idx);
                      } else {
                        handleSelectRight(card.pairId);
                        setSelectedCarouselRightIdx(idx);
                      }
                    }}
                    animate={isSelected ? { y: -6 } : { y: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <img
                      src={card.image}
                      alt={card.alt}
                      className={styles['carousel-card-img']}
                      draggable={false}
                    />
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </main>
    </motion.div>
  );
}
