import { createContext, useContext, useReducer } from 'react'
import pairsData from '../data/pairs.json'

const GameContext = createContext(null)

const initialState = {
  currentSequenceId: 1,
  selectedInspirationId: null,
  selectedInnovationId: null,
  matchedPairIds: [],
  lastAttemptStatus: null,
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'SELECT_INSPIRATION':
      return {
        ...state,
        selectedInspirationId: action.payload,
        lastAttemptStatus: null,
      }
    case 'SELECT_INNOVATION':
      return {
        ...state,
        selectedInnovationId: action.payload,
        lastAttemptStatus: null,
      }
    case 'VALIDATE_PAIR': {
      const { selectedInspirationId, selectedInnovationId } = state
      if (selectedInspirationId == null || selectedInnovationId == null) {
        return state
      }
      const isMatch = selectedInspirationId === selectedInnovationId
      return {
        ...state,
        lastAttemptStatus: isMatch ? 'correct' : 'incorrect',
        matchedPairIds: isMatch
          ? [...state.matchedPairIds, selectedInspirationId]
          : state.matchedPairIds,
        selectedInspirationId: null,
        selectedInnovationId: null,
      }
    }
    case 'RESET_SELECTION':
      return {
        ...state,
        selectedInspirationId: null,
        selectedInnovationId: null,
        lastAttemptStatus: null,
      }
    default:
      return state
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const value = {
    state,
    dispatch,
    pairs: pairsData.pairs,
    sequences: pairsData.metadata.sequences,
  }
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGameContext() {
  const ctx = useContext(GameContext)
  if (!ctx) {
    throw new Error('useGameContext must be used within GameProvider')
  }
  return ctx
}
