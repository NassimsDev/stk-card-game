import '@fontsource/playfair-display';
import './index.css';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import pairsData from './data/pairs.json';
import { soundManager } from './utils/soundManager';
import { useBackgroundAudio } from './hooks/useBackgroundAudio';
import { LangProvider } from './i18n/LangContext';
import { useLang } from './i18n/useLang';
import { localizePair } from './pages/GameRound/gameRound.constants';
import GameRound from './pages/GameRound/GameRound';
import LandingScreen from './pages/LandingScreen/LandingScreen';
import OnboardingScreen from './pages/OnboardingScreen/OnboardingScreen';

const TOTAL_SEQUENCES = pairsData.metadata.sequences.length;

function App() {
  return (
    <LangProvider>
      <AppContent />
    </LangProvider>
  );
}

function AppContent() {
  const { lang, toggleLang, t } = useLang();
  const [started, setStarted] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [seqIndex, setSeqIndex] = useState(0);
  const [appView, setAppView] = useState('game');
  const [isMuted, setIsMuted] = useState(() => soundManager.getMuteState());

  // Recalculée uniquement quand la langue change — le contenu (pairs.json)
  // reste la seule source de vérité, on ne fait que fusionner ses traductions.
  const SEQUENCES = useMemo(
    () => pairsData.metadata.sequences.map(seq =>
      seq.pairIds.map(id => localizePair(pairsData.pairs.find(p => p.id === id), lang))
    ),
    [lang]
  );

  useEffect(() => {
    soundManager.init();
  }, []);

  // La musique de fond doit jouer : partie démarrée, et pas sur l'écran de
  // transition entre deux séquences (silence volontaire à cet endroit).
  const isMusicActive = started && appView !== 'transition';

  // Gérer la musique de fond de manière réactive
  useEffect(() => {
    if (isMusicActive) {
      soundManager.playCurrentBg();
    } else {
      soundManager.pauseCurrentBg();
    }
  }, [isMusicActive]);

  // Coupe tout son quand l'onglet/l'app passe en arrière-plan (écran
  // verrouillé, changement d'appli/onglet) et relance la musique de fond au
  // retour, si elle était censée jouer à ce moment-là.
  useBackgroundAudio(isMusicActive);

  // 🚧 DEV ONLY — Shift+F : écran de fin. Shift+D : round 2. Shift+T : round 3. Supprimer avant livraison.
  useEffect(() => {
    const jumpToRound = (index) => {
      setStarted(true);
      setOnboarded(true);
      setSeqIndex(Math.min(index, TOTAL_SEQUENCES - 1));
      setAppView('game');
    };

    const handler = (e) => {
      if (!e.shiftKey) return;
      if (e.key === 'F') setAppView('end');
      if (e.key === 'D') jumpToRound(1);
      if (e.key === 'T') jumpToRound(2);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (appView === 'transition') {
      soundManager.play('levelTransition');
    }
  }, [appView]);

  const handleSequenceComplete = () => {
    if (seqIndex < TOTAL_SEQUENCES - 1) {
      setAppView('transition');
    } else {
      setAppView('end');
    }
  };

  const handleStart = () => {
    setSeqIndex(i => Math.min(i + 1, TOTAL_SEQUENCES - 1));
    setAppView('game');
  };

  const handleGoHome = () => {
    soundManager.play('button');
    setStarted(false);
    setOnboarded(false);
    setSeqIndex(0);
    setAppView('game');
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <>
      {!started ? (
        <LandingScreen onStart={() => setStarted(true)} />
      ) : !onboarded ? (
        <OnboardingScreen onComplete={() => setOnboarded(true)} onHome={handleGoHome} />
      ) : (
        <div className="container">
          <AnimatePresence mode="wait">
            {appView === 'game' && (
              <GameRound
                key={seqIndex}
                pairs={SEQUENCES[seqIndex]}
                sequenceNumber={seqIndex + 1}
                totalSequences={TOTAL_SEQUENCES}
                previousPairs={SEQUENCES.slice(0, seqIndex).flat()}
                onComplete={handleSequenceComplete}
                onHome={handleGoHome}
              />
            )}

            {appView === 'transition' && (
              <motion.main
                key="transition"
                className="transition-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="transition-title">
                  S<span style={{ fontStyle: 'italic' }}>{lang === 'fr' ? 'é' : 'e'}</span>quence{' '}
                  <span style={{ fontFamily: '"DM Serif Display", serif', fontWeight: 400 }}>
                    {seqIndex + 2}/{TOTAL_SEQUENCES}
                  </span>
                </h2>
                <button
                  className="btn-commencer"
                  onClick={() => {
                    soundManager.stop('levelTransition');
                    soundManager.play('button');
                    handleStart();
                  }}
                >
                  {t('transition.start')}
                </button>
              </motion.main>
            )}

            {appView === 'end' && (
              <motion.main
                key="end"
                className="transition-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <img src="/assets/images/STK-logo.svg" alt="STK Architecture" className="header-logo end-screen-logo" />
                <h2 className="transition-title">
                  {t('end.titleLine1')}<br />
                  <span style={{ fontStyle: 'italic' }}>{t('end.titleItalic')}</span>
                </h2>
                <p className="end-description">
                  {t('end.descriptionBefore')}{' '}
                  <span style={{ fontFamily: '"DM Serif Display", serif', fontWeight: 400, color: '#1a1a1a' }}>
                    {pairsData.metadata.totalPairs}
                  </span>
                  {' '}{t('end.descriptionAfter')}
                </p>
                <p className="end-accroche">
                  {t('end.accroche')}
                </p>
                <a
                  href="https://stk-architecture.com/projets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-commencer"
                  style={{ textDecoration: 'none', marginTop: '12px' }}
                  onClick={() => soundManager.play('button')}
                >
                  {t('end.discoverCta')}
                </a>
                <button
                  className="end-replay"
                  onClick={() => {
                    soundManager.play('button');
                    setSeqIndex(0);
                    setAppView('game');
                  }}
                >
                  {t('end.replay')}
                </button>
              </motion.main>
            )}
          </AnimatePresence>
        </div>
      )}

      {started && (
        <button
          className="sound-toggle-btn"
          onClick={handleToggleMute}
          aria-label={isMuted ? t('common.soundOn') : t('common.soundOff')}
        >
          {isMuted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          )}
        </button>
      )}

      {/* Toujours visible (même avant "started") : la langue doit pouvoir être
          choisie dès l'écran d'accueil, avant que le son n'entre en jeu. */}
      <button
        className="lang-toggle-btn"
        onClick={() => {
          soundManager.play('button');
          toggleLang();
        }}
        aria-label={t('common.langToggleAria')}
      >
        {lang === 'fr' ? 'EN' : 'FR'}
      </button>
    </>
  );
}

export default App;