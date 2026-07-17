import { useState, useEffect, useRef, useReducer } from 'react';
import { soundManager } from '../../utils/soundManager';
import { shuffleArray, buildCarouselDeck } from './gameRound.constants';

// ── Reducer ───────────────────────────────────────────────────────────────────

const INITIAL_HINT = { leftOpen: false, rightOpen: false, leftUsed: false, rightUsed: false };

const INITIAL_STATE = {
  selectedLeft:     null,
  selectedRight:    null,
  carouselLeftIdx:  null,
  carouselRightIdx: null,
  linkStatus:       'idle',
  wrongAttempt:     false,
  matchedPairIds:   [],
  lierFading:       false,
  hint:             INITIAL_HINT,
};

function clearHintLeft(hint)  { return { ...hint, leftOpen: false, leftUsed: false }; }
function clearHintRight(hint) { return { ...hint, rightOpen: false, rightUsed: false }; }

// If a pair is currently 'linked', commit it atomically before the next selection.
function maybeCommit(state) {
  if (state.linkStatus !== 'linked') return state;
  const already = state.matchedPairIds.includes(state.selectedLeft);
  return {
    ...state,
    matchedPairIds: already ? state.matchedPairIds : [...state.matchedPairIds, state.selectedLeft],
    linkStatus:     'idle',
    hint:           INITIAL_HINT,
  };
}

function gameReducer(state, action) {
  switch (action.type) {

    case 'SELECT_LEFT': {
      const next    = maybeCommit(state);
      const changed = action.id !== next.selectedLeft;
      return {
        ...next,
        selectedLeft:    action.id,
        carouselLeftIdx: action.carouselIdx ?? null,
        wrongAttempt:    false,
        lierFading:      false,
        hint:            changed ? clearHintLeft(next.hint) : next.hint,
      };
    }

    case 'SELECT_RIGHT': {
      const next    = maybeCommit(state);
      const changed = action.id !== next.selectedRight;
      return {
        ...next,
        selectedRight:    action.id,
        carouselRightIdx: action.carouselIdx ?? null,
        wrongAttempt:     false,
        lierFading:       false,
        hint:             changed ? clearHintRight(next.hint) : next.hint,
      };
    }

    case 'START_LIER':
      return { ...state, lierFading: true };

    case 'SET_LINK_STATUS':
      return { ...state, linkStatus: action.status };

    case 'ANIMATION_COMPLETE': {
      switch (action.definition) {
        case 'linking':       return { ...state, linkStatus: 'linked' };
        case 'linking-wrong': return { ...state, linkStatus: 'shaking' };
        case 'shaking':       return { ...state, linkStatus: 'separating' };
        case 'separating':    return { ...state, linkStatus: 'idle', wrongAttempt: true };
        default:              return state;
      }
    }

    // Advance to next pair: atomically resets all transient state.
    // nextLeft / nextRight are pre-computed outside the reducer (random — impure).
    case 'SUIVANT':
      return {
        ...INITIAL_STATE,
        matchedPairIds: action.newMatched,
        selectedLeft:   action.nextLeft,
        selectedRight:  action.nextRight,
      };

    case 'TOGGLE_HINT_LEFT':
      return { ...state, hint: { ...state.hint, leftOpen: !state.hint.leftOpen, leftUsed: true } };

    case 'TOGGLE_HINT_RIGHT':
      return { ...state, hint: { ...state.hint, rightOpen: !state.hint.rightOpen, rightUsed: true } };

    default:
      return state;
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useGameRound({ pairs }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  // Computed once on mount — never mutated, so useState is appropriate here.
  const [shuffledInspiration] = useState(() => shuffleArray(pairs));
  const [shuffledInnovation]  = useState(() => shuffleArray(pairs));
  // Mobile carousel deck: independent shuffle from the desktop grids above,
  // built to guarantee a pair's two cards are never adjacent (see buildCarouselDeck).
  const [carouselCards]       = useState(() => buildCarouselDeck(pairs));

  // Drag-over highlight (purely local UI, no game-state coupling).
  const [dragOverSide, setDragOverSide] = useState(null);

  const swiperInstanceRef = useRef(null);

  // ── Derived state ──────────────────────────────────────────────────────────
  const { selectedLeft, selectedRight, linkStatus, wrongAttempt, matchedPairIds, lierFading, hint } = state;

  const isAnimating = ['linking', 'linking-wrong', 'shaking', 'separating'].includes(linkStatus);
  const allFound    = matchedPairIds.length === pairs.length;

  const selectedLeftPair  = pairs.find(p => p.id === selectedLeft)  ?? null;
  const selectedRightPair = pairs.find(p => p.id === selectedRight) ?? null;
  const linkedPair        = selectedLeftPair;
  const canShowHintToggle = linkStatus === 'idle';

  const showLierButton =
    !allFound && linkStatus === 'idle' && !wrongAttempt
    && selectedLeft  !== null && selectedRight !== null
    && !matchedPairIds.includes(selectedLeft)
    && !matchedPairIds.includes(selectedRight);

  const visibleCarouselCards = carouselCards.filter(c => !matchedPairIds.includes(c.pairId));

  // ── Effects ────────────────────────────────────────────────────────────────

  // Refresh Swiper layout after matched cards are filtered out.
  useEffect(() => {
    const t = setTimeout(() => { swiperInstanceRef.current?.update(); }, 80);
    return () => clearTimeout(t);
  }, [matchedPairIds.length]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  // carouselIdx is the absolute index in the repeated deck (optional — desktop has none).
  const handleSelectLeft = (id, carouselIdx = null) => {
    if (isAnimating || matchedPairIds.includes(id)) return;
    if (id !== selectedLeft) soundManager.play('cardFlip');
    dispatch({ type: 'SELECT_LEFT', id, carouselIdx });
  };

  const handleSelectRight = (id, carouselIdx = null) => {
    if (isAnimating || matchedPairIds.includes(id)) return;
    if (id !== selectedRight) soundManager.play('cardFlip');
    dispatch({ type: 'SELECT_RIGHT', id, carouselIdx });
  };

  const handleLierClick = () => {
    if (isAnimating || linkStatus !== 'idle' || lierFading) return;
    soundManager.play('button');
    dispatch({ type: 'START_LIER' });
    const isMatch = selectedLeft === selectedRight;
    setTimeout(() => {
      dispatch({ type: 'SET_LINK_STATUS', status: isMatch ? 'linking' : 'linking-wrong' });
    }, 220);
  };

  const handleAnimationComplete = (definition) => {
    if (definition === 'linking')       soundManager.play('correct');
    if (definition === 'linking-wrong') {
      soundManager.play('wrong');
      // Vibration API : pas de support iOS Safari, d'où la vérification —
      // sur les navigateurs compatibles (Chrome/Android...), un double buzz
      // court renforce le signal d'erreur en complément du son.
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([60, 40, 60]);
      }
    }
    dispatch({ type: 'ANIMATION_COMPLETE', definition });
  };

  const handleSuivant = () => {
    soundManager.play('button');
    const newMatched = matchedPairIds.includes(selectedLeft)
      ? matchedPairIds
      : [...matchedPairIds, selectedLeft];
    const remaining = pairs.filter(p => !newMatched.includes(p.id));
    const pick = () => remaining.length > 0
      ? remaining[Math.floor(Math.random() * remaining.length)].id
      : null;
    dispatch({ type: 'SUIVANT', newMatched, nextLeft: pick(), nextRight: pick() });
  };

  const toggleHintLeft  = () => dispatch({ type: 'TOGGLE_HINT_LEFT' });
  const toggleHintRight = () => dispatch({ type: 'TOGGLE_HINT_RIGHT' });

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
      else                 handleSelectRight(id);
    },
  });

  return {
    // Refs
    swiperInstanceRef,
    // Game state (flattened from reducer)
    selectedLeft,
    selectedRight,
    selectedCarouselLeftIdx:  state.carouselLeftIdx,
    selectedCarouselRightIdx: state.carouselRightIdx,
    linkStatus,
    wrongAttempt,
    matchedPairIds,
    lierFading,
    hintLeftOpen:  hint.leftOpen,
    hintRightOpen: hint.rightOpen,
    hintLeftUsed:  hint.leftUsed,
    hintRightUsed: hint.rightUsed,
    // Computed-once
    shuffledInspiration,
    shuffledInnovation,
    dragOverSide,
    // Derived
    isAnimating,
    allFound,
    selectedLeftPair,
    selectedRightPair,
    linkedPair,
    showLierButton,
    canShowHintToggle,
    visibleCarouselCards,
    // Handlers
    handleLierClick,
    handleAnimationComplete,
    handleSuivant,
    handleSelectLeft,
    handleSelectRight,
    toggleHintLeft,
    toggleHintRight,
    makeDropHandlers,
  };
}
