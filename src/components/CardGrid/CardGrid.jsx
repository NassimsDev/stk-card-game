import MiniCard from '../MiniCard'
import styles from './CardGrid.module.css'

function getTone(index) {
  if (index < 2) return 'dark'
  if (index % 3 === 0) return 'alt'
  return 'base'
}

function CardGrid({
  pairs,
  side,
  selectedId,
  matchedIds,
  onSelect,
}) {
  return (
    <div className={styles.grid} role="group" aria-label={`Cartes ${side}`}>
      {pairs.map((pair, index) => {
        const card = pair[side]
        const isMatched = matchedIds.includes(pair.id)
        const isSelected = selectedId === pair.id

        let variant = 'idle'
        if (isMatched) variant = 'matched'
        else if (isSelected) variant = 'selected'

        return (
          <MiniCard
            key={pair.id}
            variant={variant}
            tone={getTone(index)}
            ariaLabel={`${card.subtitle} : ${card.title}`}
            onClick={() => onSelect(pair.id)}
          />
        )
      })}
    </div>
  )
}

export default CardGrid
