import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CollectionOverlay.module.css';

const EDGE_ZONE = 32;      // px from the right edge where the open-swipe can start
const SWIPE_THRESHOLD = 50; // px of horizontal travel needed to trigger open/close
const SWIPE_BAND = 48;      // px above/below the indicator where the swipe is accepted

export default function CollectionOverlay({ pairs, unlocked, isOpen, onOpen, onClose }) {
  const indicatorRef = useRef(null);

  // Swipe from the right edge to open — only within the indicator's vertical
  // band, so the gesture zone matches what the languette shows on screen.
  // Disabled until the first pair is found, to match the languette's own visibility.
  useEffect(() => {
    if (isOpen || !unlocked) return;
    let start = null;

    const onTouchStart = (e) => {
      const t = e.touches[0];
      if (window.innerWidth - t.clientX > EDGE_ZONE) {
        start = null;
        return;
      }
      const rect = indicatorRef.current?.getBoundingClientRect();
      // rect.height === 0 → indicateur masqué (desktop) : bord entier accepté
      const inBand = !rect || rect.height === 0
        || (t.clientY >= rect.top - SWIPE_BAND && t.clientY <= rect.bottom + SWIPE_BAND);
      start = inBand ? { x: t.clientX, y: t.clientY } : null;
    };
    const onTouchMove = (e) => {
      if (!start) return;
      const t = e.touches[0];
      const dx = start.x - t.clientX;
      const dy = Math.abs(t.clientY - start.y);
      if (dx > SWIPE_THRESHOLD && dx > dy) {
        start = null;
        onOpen();
      }
    };
    const onTouchEnd = () => { start = null; };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [isOpen, onOpen, unlocked]);

  // Escape closes, and the page behind stops scrolling while open.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  // Swipe right on the panel to close (mirrors the open gesture).
  const closeSwipe = useRef(null);
  const panelTouchHandlers = {
    onTouchStart: (e) => {
      const t = e.touches[0];
      closeSwipe.current = { x: t.clientX, y: t.clientY };
    },
    onTouchMove: (e) => {
      if (!closeSwipe.current) return;
      const t = e.touches[0];
      const dx = t.clientX - closeSwipe.current.x;
      const dy = Math.abs(t.clientY - closeSwipe.current.y);
      if (dx > SWIPE_THRESHOLD && dx > dy) {
        closeSwipe.current = null;
        onClose();
      }
    },
    onTouchEnd: () => { closeSwipe.current = null; },
  };

  return (
    <>
      {/* Languette mobile : indique le swipe depuis le bord droit (tappable aussi) */}
      <AnimatePresence>
        {!isOpen && unlocked && (
          <motion.button
            ref={indicatorRef}
            className={styles['swipe-indicator']}
            onClick={onOpen}
            aria-label="Ouvrir ma collection"
            initial={{ opacity: 0, scale: 0.85, x: 12, y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: 0, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.85, x: 12, y: '-50%' }}
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <span className={styles['swipe-indicator-chevron']} aria-hidden="true">‹</span>
            <span className={styles['swipe-indicator-icon']} aria-hidden="true">⧉</span>
            <span className={styles['swipe-indicator-count']}>{pairs.length}</span>
          </motion.button>
        )}
      </AnimatePresence>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.aside
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-label="Ma collection"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            {...panelTouchHandlers}
          >
            <header className={styles['panel-header']}>
              <div>
                <h2 className={styles['panel-title']}>Ma collection</h2>
                <p className={styles['panel-count']}>
                  {pairs.length} paire{pairs.length > 1 ? 's' : ''} trouvée{pairs.length > 1 ? 's' : ''}
                </p>
              </div>
              <button
                className={styles['close-btn']}
                onClick={onClose}
                aria-label="Fermer la collection"
              >
                ✕
              </button>
            </header>

            <div className={styles['panel-content']}>
              {pairs.length === 0 ? (
                <p className={styles['empty-state']}>
                  Aucune paire découverte pour le moment.<br />
                  Liez des cartes pour enrichir votre collection.
                </p>
              ) : (
                pairs.map(pair => (
                  <article key={pair.id} className={styles['pair-block']}>
                    <span className={styles['pair-theme']}>{pair.theme}</span>
                    <div className={styles['pair-cards']}>
                      <figure className={styles['pair-card']}>
                        <img src={pair.inspiration.image} alt={pair.inspiration.alt} loading="lazy" />
                      </figure>
                      <figure className={styles['pair-card']}>
                        <img src={pair.innovation.image} alt={pair.innovation.alt} loading="lazy" />
                      </figure>
                    </div>
                    <div className={styles['pair-explanation']}>
                      <h3>{pair.explanation.title}</h3>
                      <p>{pair.explanation.body}</p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
