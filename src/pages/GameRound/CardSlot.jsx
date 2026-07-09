import { motion, AnimatePresence } from 'framer-motion';
import { getGlowPath } from './gameRound.constants';
import styles from './GameRound.module.css';

export default function CardSlot({
  side,
  pair,
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
  const isLeft = side === 'left';
  const isDropActive = dragOverSide === side;
  const card = pair ? (isLeft ? pair.inspiration : pair.innovation) : null;
  const glowType = isLeft ? 'inspiration' : 'innovation';

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
                {isLeft
                  ? <>Sélectionner une carte <br/> Inspiration </>
                  : <>Sélectionner une carte<br/> innovation </>}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {pair && (
          <motion.img
            src={getGlowPath(glowType, pair.id)}
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
                {hintOpen ? "Masquer l'indice" : "Voir l'indice"}
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
    </motion.div>
  );
}
