import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../../utils/soundManager';
import styles from './GameRound.module.css';
import { useGameRound } from './useGameRound';
import { AMBIENT_TRACKS, inspirationVariants, innovationVariants, getTransition, COLLECTION_REVEAL_DELAY_MS } from './gameRound.constants';
import CardGrid from '../../components/CardGrid/CardGrid';
import CardSlot from '../../components/CardSlot/CardSlot';
import CarouselSection from '../../components/CarouselSection/CarouselSection';
import CollectionOverlay from '../../components/CollectionOverlay/CollectionOverlay';

export default function GameRound({ pairs, sequenceNumber, totalSequences, previousPairs = [], onComplete, onHome }) {
  const {
    ambientRef,
    swiperInstanceRef,
    selectedLeft,
    selectedRight,
    linkStatus,
    wrongAttempt,
    matchedPairIds,
    hintLeftOpen,
    hintRightOpen,
    hintLeftUsed,
    hintRightUsed,
    shuffledInspiration,
    shuffledInnovation,
    dragOverSide,
    lierFading,
    ambientTrack,
    isAmbientOpen, setIsAmbientOpen,
    selectedCarouselLeftIdx,
    selectedCarouselRightIdx,
    isAnimating,
    allFound,
    selectedLeftPair,
    selectedRightPair,
    linkedPair,
    showLierButton,
    canShowHintToggle,
    visibleCarouselCards,
    handleAmbientSelect,
    handleLierClick,
    handleAnimationComplete,
    handleSuivant,
    handleSelectLeft,
    handleSelectRight,
    toggleHintLeft,
    toggleHintRight,
    makeDropHandlers,
  } = useGameRound({ pairs });

  const [isCollectionOpen, setIsCollectionOpen] = useState(false);

  // Collection cumulée : paires des séquences terminées + celles trouvées ici.
  const collectedPairs = [
    ...previousPairs,
    ...pairs.filter(p => matchedPairIds.includes(p.id)),
  ];

  // Le CTA "Ma collection" est débloqué dès la première paire — mais visible
  // immédiatement si la collection vient déjà des séquences précédentes.
  // Sinon, on attend la fin de l'animation de settle des cartes (clic sur
  // Suivant) avant de le faire apparaître, pour ne pas le superposer.
  const [showCollectionCta, setShowCollectionCta] = useState(() => previousPairs.length > 0);

  useEffect(() => {
    if (showCollectionCta || collectedPairs.length === 0) return;
    const t = setTimeout(() => setShowCollectionCta(true), COLLECTION_REVEAL_DELAY_MS);
    return () => clearTimeout(t);
  }, [collectedPairs.length, showCollectionCta]);

  const transition = getTransition(linkStatus);

  return (
    <motion.div
      className={styles['game-round']}
      key="game-round"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Séparé de CollectionOverlay : le scale (très petites hauteurs desktop)
          ne doit pas s'appliquer à l'overlay, dont le fond doit rester plein écran. */}
      <div className={styles['scale-wrapper']}>
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

        <div className={styles['header-actions']}>
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

          <AnimatePresence>
            {showCollectionCta && (
              <motion.button
                className={styles['collection-btn']}
                onClick={() => {
                  soundManager.play('button');
                  setIsCollectionOpen(true);
                }}
                aria-haspopup="dialog"
                aria-expanded={isCollectionOpen}
                initial={{ opacity: 0, scale: 0.85, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -6 }}
                transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <span className={styles['collection-icon']} aria-hidden="true">⧉</span>
                Ma collection
              </motion.button>
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
          {/* Desktop grids — hidden on mobile, replaced by the carousel */}
          <CardGrid
            pairs={shuffledInspiration}
            side="left"
            selectedId={selectedLeft}
            matchedPairIds={matchedPairIds}
            isAnimating={isAnimating}
            onSelect={handleSelectLeft}
          />

          {/* Center column: cards + actions */}
          <div className={styles['center-column']}>
            <div className={styles['cards-pair']}>
              <CardSlot
                side="left"
                pair={selectedLeftPair}
                linkStatus={linkStatus}
                dragOverSide={dragOverSide}
                hintOpen={hintLeftOpen}
                canShowHintToggle={canShowHintToggle}
                dropHandlers={makeDropHandlers('left')}
                onHintToggle={toggleHintLeft}
                onAnimationComplete={handleAnimationComplete}
                variants={inspirationVariants}
                transition={transition}
              />
              <CardSlot
                side="right"
                pair={selectedRightPair}
                linkStatus={linkStatus}
                dragOverSide={dragOverSide}
                hintOpen={hintRightOpen}
                canShowHintToggle={canShowHintToggle}
                dropHandlers={makeDropHandlers('right')}
                onHintToggle={toggleHintRight}
                variants={innovationVariants}
                transition={transition}
              />
            </div>

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
                    <h2 className={styles['observation-title']}>Presque ! Observez à nouveau</h2>
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

          <CardGrid
            pairs={shuffledInnovation}
            side="right"
            selectedId={selectedRight}
            matchedPairIds={matchedPairIds}
            isAnimating={isAnimating}
            onSelect={handleSelectRight}
          />
        </div>

        <CarouselSection
          visibleCarouselCards={visibleCarouselCards}
          swiperInstanceRef={swiperInstanceRef}
          isAnimating={isAnimating}
          selectedCarouselLeftIdx={selectedCarouselLeftIdx}
          selectedCarouselRightIdx={selectedCarouselRightIdx}
          onCardTap={(card, idx) => {
            if (card.type === 'inspiration') handleSelectLeft(card.pairId, idx);
            else                             handleSelectRight(card.pairId, idx);
          }}
        />
      </main>
      </div>

      <CollectionOverlay
        pairs={collectedPairs}
        unlocked={showCollectionCta}
        isOpen={isCollectionOpen}
        onOpen={() => setIsCollectionOpen(true)}
        onClose={() => setIsCollectionOpen(false)}
      />
    </motion.div>
  );
}
