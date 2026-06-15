import '@fontsource/playfair-display';
import '@fontsource/dm-serif-display';
import './index.css';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import pairsData from './data/pairs.json';
import { soundManager } from './utils/soundManager';
import GameRound from './components/GameRound';
import LandingScreen from './pages/LandingScreen/LandingScreen';
import UnboardingScreen from './pages/UnboardingScreen/UnboardingScreen';

const SEQUENCES = pairsData.metadata.sequences.map(seq =>
  seq.pairIds.map(id => pairsData.pairs.find(p => p.id === id))
);
const TOTAL_SEQUENCES = SEQUENCES.length;

function App() {
  const [started, setStarted] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [seqIndex, setSeqIndex] = useState(0);
  const [appView, setAppView] = useState('game');
  const [isMuted, setIsMuted] = useState(() => soundManager.getMuteState());

  useEffect(() => {
    soundManager.init();
  }, []);

  // Gérer la musique de fond de manière réactive
  useEffect(() => {
    if (started && appView !== 'transition') {
      soundManager.play('bgMusic');
    } else {
      soundManager.pause('bgMusic');
    }
  }, [started, appView]);

  // 🚧 DEV ONLY — Shift+F pour sauter à l'écran de fin. Supprimer avant livraison.
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'F' && e.shiftKey) setAppView('end');
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
    <div className="container">
      {!started ? (
        <LandingScreen onStart={() => setStarted(true)} />
      ) : !onboarded ? (
        <UnboardingScreen onComplete={() => setOnboarded(true)} />
      ) : (
        <AnimatePresence mode="wait">
          {appView === 'game' && (
            <GameRound
              key={seqIndex}
              pairs={SEQUENCES[seqIndex]}
              sequenceNumber={seqIndex + 1}
              totalSequences={TOTAL_SEQUENCES}
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
                S<span style={{ fontStyle: 'italic' }}>é</span>quence{' '}
                <span style={{ fontFamily: '"DM Serif Display", serif', fontWeight: 400 }}>
                  {seqIndex + 2}/{TOTAL_SEQUENCES}
                </span>
              </h2>
              <button
                className="btn-commencer"
                onClick={() => {
                  soundManager.play('button');
                  handleStart();
                }}
              >
                Commencer
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
                Parcours<br />
                <span style={{ fontStyle: 'italic' }}>terminé</span>
              </h2>
              <p className="end-description">
                Vous avez exploré{' '}
                <span style={{ fontFamily: '"DM Serif Display", serif', fontWeight: 400, color: '#1a1a1a' }}>
                  {pairsData.metadata.totalPairs}
                </span>
                {' '}liens entre le vivant et l'innovation.
              </p>
              <p className="end-accroche">
                Le biomimétisme inspire chaque projet que nous concevons.
              </p>
              <a
                href="https://stk-architecture.com/projets"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-commencer"
                style={{ textDecoration: 'none', marginTop: '12px' }}
                onClick={() => soundManager.play('button')}
              >
                Découvrir les projets STK
              </a>
              <button
                className="end-replay"
                onClick={() => {
                  soundManager.play('button');
                  setSeqIndex(0);
                  setAppView('game');
                }}
              >
                Rejouer le parcours
              </button>
            </motion.main>
          )}
        </AnimatePresence>
      )}

      {started && (
        <button
          className="sound-toggle-btn"
          onClick={handleToggleMute}
          aria-label={isMuted ? "Activer le son" : "Couper le son"}
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
    </div>
  );
}

export default App;
