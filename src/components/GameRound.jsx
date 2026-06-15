import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/soundManager';

const LINK_OFFSET = 18;

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
  const [shuffledInspiration] = useState(() => shuffleArray(pairs));
  const [shuffledInnovation] = useState(() => shuffleArray(pairs));
  const [dragOverSide, setDragOverSide] = useState(null);

  // Bloqué uniquement pendant les animations (pas pendant 'linked' où on peut re-sélectionner)
  const isAnimating = ['linking', 'linking-wrong', 'shaking', 'separating'].includes(linkStatus);
  const allFound = matchedPairIds.length === pairs.length;

  const selectedLeftPair = pairs.find(p => p.id === selectedLeft) ?? null;
  const selectedRightPair = pairs.find(p => p.id === selectedRight) ?? null;
  const linkedPair = pairs.find(p => p.id === selectedLeft) ?? null;

  const handleLier = () => {
    soundManager.play('button');
    if (isAnimating || linkStatus !== 'idle') return;
    if (selectedLeft === selectedRight) {
      setLinkStatus('linking');
    } else {
      setLinkStatus('linking-wrong');
    }
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
  };

  const commitMatchIfLinked = () => {
    if (linkStatus === 'linked') {
      setMatchedPairIds(prev => (prev.includes(selectedLeft) ? prev : [...prev, selectedLeft]));
      setLinkStatus('idle');
      setHintLeftOpen(false);
      setHintRightOpen(false);
    }
  };

  const handleSelectLeft = (id) => {
    if (isAnimating || matchedPairIds.includes(id)) return;
    commitMatchIfLinked();
    if (id !== selectedLeft) {
      soundManager.play('cardFlip');
      setHintLeftOpen(false);
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

  const renderLeftGrid = () => shuffledInspiration.map((pair) => {
    const isSelected = selectedLeft === pair.id;
    const isMatched = matchedPairIds.includes(pair.id);
    return (
      <div
        key={`left-${pair.id}`}
        className={`grid-square ${isSelected ? 'selected' : ''} ${isAnimating || isMatched ? 'locked' : ''} ${isMatched ? 'matched' : ''}`}
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
        <img src={pair.inspiration.image} alt={pair.inspiration.alt} className="grid-img" />
      </div>
    );
  });

  const renderRightGrid = () => shuffledInnovation.map((pair) => {
    const isSelected = selectedRight === pair.id;
    const isMatched = matchedPairIds.includes(pair.id);
    return (
      <div
        key={`right-${pair.id}`}
        className={`grid-square ${isSelected ? 'selected' : ''} ${isAnimating || isMatched ? 'locked' : ''} ${isMatched ? 'matched' : ''}`}
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
        <img src={pair.innovation.image} alt={pair.innovation.alt} className="grid-img" />
      </div>
    );
  });

  return (
    <motion.div
      className="game-round"
      key="game-round"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="header">
        <div className="logo-placeholder">
          <button
            onClick={onHome}
            className="logo-link"
            aria-label="Retourner à la page d'accueil"
          >
            <img src="/assets/images/STK-logo.svg" alt="STK Architecture" className="header-logo" />
          </button>
        </div>
        <div className="header-right">
          <div className="sequence">
            Séquence {sequenceNumber}/{totalSequences}
          </div>
          <div className="pairs-counter">
            {matchedPairIds.length}/{pairs.length} paires trouvées
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="cards-row">
          {/* Grille gauche */}
          <div className="grid-container">{renderLeftGrid()}</div>

          {/* Carte Inspiration */}
          <motion.div
            className="card-wrapper card-wrapper-left"
            variants={inspirationVariants}
            animate={linkStatus}
            transition={getTransition(linkStatus)}
            onAnimationComplete={handleAnimationComplete}
          >
            <div
              className={`card placeholder-card-left ${dragOverSide === 'left' ? 'drop-target-active' : ''}`}
              {...makeDropHandlers('left')}
            >
              <AnimatePresence mode="wait">
                {selectedLeftPair ? (
                  <motion.img
                    key={selectedLeftPair.id}
                    src={selectedLeftPair.inspiration.image}
                    alt={selectedLeftPair.inspiration.alt}
                    className="card-img"
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: -90 }}
                    transition={{ duration: 0.25, ease: 'linear' }}
                  />
                ) : (
                  <motion.div
                    key="placeholder-left"
                    className="card-placeholder-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="card-placeholder-arrow">←</span>
                    <span className="card-placeholder-text">Sélectionner une carte</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Glow inspiration lors d'un lien réussi */}
              {selectedLeftPair && (
                <motion.img
                  src={getGlowPath('inspiration', selectedLeftPair.id)}
                  alt=""
                  className="card-img"
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

            <AnimatePresence mode="wait">
              {canShowHintToggle && selectedLeftPair && (
                <motion.button
                  key="hint-toggle-left"
                  type="button"
                  className="hint-toggle"
                  onClick={() => setHintLeftOpen(v => !v)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="hint-toggle-icon" aria-hidden="true">?</span>
                  {hintLeftOpen ? "Masquer l'indice" : "Voir l'indice"}
                </motion.button>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {canShowHintToggle && selectedLeftPair && hintLeftOpen && (
                <motion.div
                  className="description"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={{ duration: 0.3 }}
                >
                  <h3>{selectedLeftPair.inspiration.title}</h3>
                  <p>{selectedLeftPair.inspiration.shortDescription}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Carte Innovation */}
          <motion.div
            className="card-wrapper card-wrapper-right"
            variants={innovationVariants}
            animate={linkStatus}
            transition={getTransition(linkStatus)}
          >
            <div
              className={`card placeholder-card-right ${dragOverSide === 'right' ? 'drop-target-active' : ''}`}
              {...makeDropHandlers('right')}
            >
              <AnimatePresence mode="wait">
                {selectedRightPair ? (
                  <motion.img
                    key={selectedRightPair.id}
                    src={selectedRightPair.innovation.image}
                    alt={selectedRightPair.innovation.alt}
                    className="card-img"
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: -90 }}
                    transition={{ duration: 0.25, ease: 'linear' }}
                  />
                ) : (
                  <motion.div
                    key="placeholder-right"
                    className="card-placeholder-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="card-placeholder-arrow">→</span>
                    <span className="card-placeholder-text">Sélectionner une carte</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Glow innovation lors d'un lien réussi */}
              {selectedRightPair && (
                <motion.img
                  src={getGlowPath('innovation', selectedRightPair.id)}
                  alt=""
                  className="card-img"
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

            <AnimatePresence mode="wait">
              {canShowHintToggle && selectedRightPair && (
                <motion.button
                  key="hint-toggle-right"
                  type="button"
                  className="hint-toggle"
                  onClick={() => setHintRightOpen(v => !v)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="hint-toggle-icon" aria-hidden="true">?</span>
                  {hintRightOpen ? "Masquer l'indice" : "Voir l'indice"}
                </motion.button>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {canShowHintToggle && selectedRightPair && hintRightOpen && (
                <motion.div
                  className="description"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={{ duration: 0.3 }}
                >
                  <h3>{selectedRightPair.innovation.title}</h3>
                  <p>{selectedRightPair.innovation.shortDescription}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Grille droite */}
          <div className="grid-container">{renderRightGrid()}</div>
        </div>

        {/* Section bas */}
        <div className="bottom-action-section">
          {/* Succès : Le lien biomimétique */}
          <AnimatePresence>
            {linkStatus === 'linked' && linkedPair && (
              <motion.div
                className="explanation-text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <h2>{linkedPair.explanation.title}</h2>
                <p>{linkedPair.explanation.body}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Erreur : Piste d'observation */}
          <AnimatePresence>
            {linkStatus === 'idle' && wrongAttempt && (
              <motion.div
                className="explanation-text"
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

          {/* Encouragement entre deux paires */}
          <AnimatePresence>
            {linkStatus === 'idle' && !wrongAttempt
              && matchedPairIds.length > 0
              && matchedPairIds.length < pairs.length && (
              <motion.div
                className="explanation-text continue-hint"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <p>Continue à découvrir les autres liens entre le vivant et l'innovation.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bouton contextuel */}
          <div className="center-action">
            <AnimatePresence mode="wait">
              {allFound && linkStatus === 'idle' && (
                <motion.button
                  key="sequence-suivante"
                  className="btn-lier"
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
              {!allFound && linkStatus === 'idle' && !wrongAttempt
                && selectedLeft !== null && selectedRight !== null
                && !matchedPairIds.includes(selectedLeft)
                && !matchedPairIds.includes(selectedRight) && (
                  <motion.button
                    key="lier"
                    className="btn-lier"
                    onClick={handleLier}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    Lier
                  </motion.button>
                )}
              {linkStatus === 'linked' && (
                <motion.button
                  key="suivant"
                  className="btn-lier"
                  onClick={handleSuivant}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  Suivant
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
