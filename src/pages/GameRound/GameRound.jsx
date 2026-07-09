import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../../utils/soundManager';
import styles from './GameRound.module.css';
import { useGameRound } from './useGameRound';
import { AMBIENT_TRACKS, inspirationVariants, innovationVariants, getTransition } from './gameRound.constants';
import CarouselSection from './CarouselSection';
import CardSlot from './CardSlot';

export default function GameRound({ pairs, sequenceNumber, totalSequences, onComplete, onHome }) {
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

  const transition = getTransition(linkStatus);

  // ── Desktop grids ───────────────────────────────────────────────────────────
  const renderLeftGrid = () => shuffledInspiration.map((pair) => {
    const isSelected = selectedLeft === pair.id;
    const isMatched  = matchedPairIds.includes(pair.id);
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
    const isMatched  = matchedPairIds.includes(pair.id);
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
    </motion.div>
  );
}
