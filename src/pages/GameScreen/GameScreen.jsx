import Logo from '../../components/Logo/Logo.jsx'
import SequenceIndicator from '../../components/SequenceIndicator/SequenceIndicator.jsx'
import CardGrid from '../../components/CardGrid/CardGrid.jsx'
import CardPreview from '../../components/CardPreview/CardPreview.jsx'
import Button from '../../components/Button/Button.jsx'
import { useGame } from '../../hooks/useGame'
import styles from './GameScreen.module.css'

function GameScreen() {
  const {
    sequenceIndex,
    sequencesTotal,
    sequencePairs,
    matchedPairIds,
    selectedInspirationId,
    selectedInnovationId,
    selectedInspirationPair,
    selectedInnovationPair,
    canValidate,
    selectInspiration,
    selectInnovation,
    validatePair,
  } = useGame()

  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <Logo />
        <SequenceIndicator current={sequenceIndex} total={sequencesTotal} />
      </header>

      <section className={styles.board}>
        <div className={styles.sideGrid}>
          <CardGrid
            pairs={sequencePairs}
            side="inspiration"
            selectedId={selectedInspirationId}
            matchedIds={matchedPairIds}
            onSelect={selectInspiration}
          />
        </div>

        <div className={styles.center}>
          <div className={styles.previews}>
            <CardPreview
              card={selectedInspirationPair?.inspiration}
              side="inspiration"
              placeholder="Choisissez une inspiration"
            />
            <CardPreview
              card={selectedInnovationPair?.innovation}
              side="innovation"
              placeholder="Choisissez une innovation"
            />
          </div>

          <div className={styles.descriptions}>
            <div className={styles.descriptionBlock}>
              {selectedInspirationPair && (
                <>
                  <h3 className={styles.descriptionTitle}>
                    {selectedInspirationPair.inspiration.title}
                  </h3>
                  <p className={styles.descriptionText}>
                    {selectedInspirationPair.inspiration.shortDescription}
                  </p>
                </>
              )}
            </div>

            <div className={styles.actionSlot}>
              <Button
                variant="outline"
                onClick={validatePair}
                disabled={!canValidate}
              >
                Lier
              </Button>
            </div>

            <div className={styles.descriptionBlock}>
              {selectedInnovationPair && (
                <>
                  <h3 className={styles.descriptionTitle}>
                    {selectedInnovationPair.innovation.title}
                  </h3>
                  <p className={styles.descriptionText}>
                    {selectedInnovationPair.innovation.shortDescription}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={styles.sideGrid}>
          <CardGrid
            pairs={sequencePairs}
            side="innovation"
            selectedId={selectedInnovationId}
            matchedIds={matchedPairIds}
            onSelect={selectInnovation}
          />
        </div>
      </section>
    </main>
  )
}

export default GameScreen
