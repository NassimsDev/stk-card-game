import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../../utils/soundManager';
import { useLang } from '../../i18n/useLang';
import { AMBIENT_TRACKS } from '../../pages/GameRound/gameRound.constants';
import styles from './AmbientSelector.module.css';

// Sélecteur d'ambiance sonore (Oiseaux/Pluie/Fleuve) — autonome, entièrement
// self-contained (state + fermeture au clic extérieur), pour être posé
// n'importe où (GameRound, OnboardingScreen...) sans dupliquer sa logique.
export default function AmbientSelector({ className }) {
  const { t } = useLang();
  const [ambientTrack, setAmbientTrack] = useState(AMBIENT_TRACKS[0].id);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const handleSelect = (trackId) => {
    setAmbientTrack(trackId);
    soundManager.switchBgMusic(trackId);
    setIsOpen(false);
  };

  return (
    <div className={`${styles['ambient-wrapper']}${className ? ` ${className}` : ''}`} ref={wrapperRef}>
      <button
        className={styles['ambient-btn']}
        onClick={() => setIsOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={styles['ambient-icon']} aria-hidden="true">♪</span>
        {t('gameRound.ambiance')}
      </button>
      <AnimatePresence>
        {isOpen && (
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
                onClick={() => handleSelect(track.id)}
              >
                {ambientTrack === track.id && <span className={styles['ambient-check']} aria-hidden="true">✓</span>}
                {t(`ambientTracks.${track.id}`)}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
