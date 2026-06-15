import { useGameContext } from '../context/GameContext'

export function useGame() {
  const { state, dispatch, pairs, sequences } = useGameContext()

  const currentSequence =
    sequences.find((s) => s.id === state.currentSequenceId) ?? sequences[0]

  const sequencePairs = currentSequence.pairIds
    .map((id) => pairs.find((p) => p.id === id))
    .filter(Boolean)

  const selectedInspirationPair =
    state.selectedInspirationId != null
      ? pairs.find((p) => p.id === state.selectedInspirationId)
      : null

  const selectedInnovationPair =
    state.selectedInnovationId != null
      ? pairs.find((p) => p.id === state.selectedInnovationId)
      : null

  const canValidate =
    state.selectedInspirationId != null && state.selectedInnovationId != null

  return {
    sequenceIndex: sequences.findIndex((s) => s.id === currentSequence.id) + 1,
    sequencesTotal: sequences.length,
    sequencePairs,
    matchedPairIds: state.matchedPairIds,
    selectedInspirationId: state.selectedInspirationId,
    selectedInnovationId: state.selectedInnovationId,
    selectedInspirationPair,
    selectedInnovationPair,
    canValidate,
    lastAttemptStatus: state.lastAttemptStatus,
    selectInspiration: (pairId) =>
      dispatch({ type: 'SELECT_INSPIRATION', payload: pairId }),
    selectInnovation: (pairId) =>
      dispatch({ type: 'SELECT_INNOVATION', payload: pairId }),
    validatePair: () => dispatch({ type: 'VALIDATE_PAIR' }),
    resetSelection: () => dispatch({ type: 'RESET_SELECTION' }),
  }
}
