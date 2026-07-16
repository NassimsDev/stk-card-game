import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGlowPath } from '../../pages/GameRound/gameRound.constants';
import { useLang } from '../../i18n/useLang';
import styles from './CardSlot.module.css';

export default function CardSlot({
  side,
  pair,
  allPairs,
  linkStatus,
  dragOverSide,
  hintOpen,
  canShowHintToggle,
  dropHandlers,
  onHintToggle,
  onAnimationComplete,
  variants,
  transition,
}) {
  const { t, lang } = useLang();
  const isLeft = side === 'left';
  const isDropActive = dragOverSide === side;
  const card = pair ? (isLeft ? pair.inspiration : pair.innovation) : null;
  const glowType = isLeft ? 'inspiration' : 'innovation';

  // Carte (de ce côté) dont l'indice est le plus long parmi toute la séquence —
  // sert de gabarit invisible pour réserver une hauteur constante au bloc
  // indice, que celui-ci soit ouvert/fermé ou selon la carte sélectionnée.
  const longestHintCard = useMemo(() => {
    const cards = allPairs.map(p => (isLeft ? p.inspiration : p.innovation));
    return cards.reduce((longest, c) =>
      c.shortDescription.length > longest.shortDescription.length ? c : longest
    );
  }, [allPairs, isLeft]);

  return (
    <motion.div
      className={`${styles['card-wrapper']} ${isLeft ? styles['card-wrapper-left'] : styles['card-wrapper-right']}`}
      variants={variants}
      animate={linkStatus}
      transition={transition}
      onAnimationComplete={isLeft ? onAnimationComplete : undefined}
    >
      <div
        className={`${styles.card} ${isLeft ? styles['placeholder-card-left'] : styles['placeholder-card-right']}${isDropActive ? ` ${styles['drop-target-active']}` : ''}`}
        {...dropHandlers}
      >
        <AnimatePresence mode="wait">
          {card ? (
            <motion.img
              key={pair.id}
              src={card.image}
              alt={card.alt}
              className={styles['card-img']}
              initial={{ rotateY: 90 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: -90 }}
              transition={{ duration: 0.25, ease: 'linear' }}
            />
          ) : (
            <motion.div
              key={`placeholder-${side}`}
              className={styles['card-placeholder-state']}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className={styles['card-placeholder-arrow']}>{isLeft ? '←' : '→'}</span>
              <span className={styles['card-placeholder-text']}>
                {t(isLeft ? 'cardSlot.selectInspiration' : 'cardSlot.selectInnovation')}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {pair && (
          <motion.img
            src={getGlowPath(glowType, pair.id, lang)}
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
        <div className={styles['hint-stack']}>
          {canShowHintToggle && (
            <div className={styles['hint-sizer']} aria-hidden="true">
              <span className={styles['hint-toggle']}>
                <span className={styles['hint-toggle-icon']}>?</span>
                <span>{t('cardSlot.hintHide')}</span>
              </span>
              <div className={styles.description}>
                <h3>{longestHintCard.title}</h3>
                <p>{longestHintCard.shortDescription}</p>
              </div>
            </div>
          )}

          <div className={styles['hint-real']}>
            <AnimatePresence mode="wait">
              {canShowHintToggle && pair && (
                <motion.button
                  key={`hint-toggle-${side}`}
                  type="button"
                  className={styles['hint-toggle']}
                  onClick={onHintToggle}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={{ duration: 0.25 }}
                >
                  <motion.span
                    layout
                    transition={{ layout: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                    className={styles['hint-toggle-icon']}
                    aria-hidden="true"
                  >?</motion.span>
                  <motion.span
                    key={hintOpen ? 'masquer' : 'voir'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    {t(hintOpen ? 'cardSlot.hintHide' : 'cardSlot.hintShow')}
                  </motion.span>
                </motion.button>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {canShowHintToggle && pair && hintOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className={styles.description}>
                    <h3>{card?.title}</h3>
                    <p>{card?.shortDescription}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
