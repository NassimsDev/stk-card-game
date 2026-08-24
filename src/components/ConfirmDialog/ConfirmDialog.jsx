import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ConfirmDialog.module.css';

// Boîte de confirmation générique pour les actions destructrices/irréversibles
// (perte de progression...) — le bouton "sûr" (annuler) reste le plus visible
// et reçoit le focus par défaut, pour qu'un Entrée accidentel n'entraîne
// jamais l'action, conformément aux règles UX habituelles pour ce type de choix.
export default function ConfirmDialog({ isOpen, title, message, confirmLabel, cancelLabel, onConfirm, onCancel }) {
  const cancelBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    cancelBtnRef.current?.focus();

    const onKeyDown = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
        >
          <motion.div
            className={styles.card}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-message"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="confirm-dialog-title" className={styles.title}>{title}</h2>
            <p id="confirm-dialog-message" className={styles.message}>{message}</p>

            <div className={styles.actions}>
              <button
                ref={cancelBtnRef}
                type="button"
                className={styles.cancelBtn}
                onClick={onCancel}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                className={styles.confirmBtn}
                onClick={onConfirm}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
