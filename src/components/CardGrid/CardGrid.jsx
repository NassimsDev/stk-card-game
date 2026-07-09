import styles from './CardGrid.module.css';

export default function CardGrid({ pairs, side, selectedId, matchedPairIds, isAnimating, onSelect }) {
  const isLeft = side === 'left';

  return (
    <div className={styles['grid-container']}>
      {pairs.map((pair) => {
        const isSelected = selectedId === pair.id;
        const isMatched  = matchedPairIds.includes(pair.id);
        const card       = isLeft ? pair.inspiration : pair.innovation;
        return (
          <div
            key={`${side}-${pair.id}`}
            className={[
              styles['grid-square'],
              isSelected               ? styles.selected : '',
              (isAnimating || isMatched) ? styles.locked  : '',
              isMatched                ? styles.matched  : '',
            ].filter(Boolean).join(' ')}
            onClick={() => onSelect(pair.id)}
            draggable={!isAnimating && !isMatched}
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('application/x-stk-card', `${side}:${pair.id}`);
            }}
            aria-label={`Sélectionner l'${isLeft ? 'inspiration' : 'innovation'} ${card.title}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(pair.id);
              }
            }}
          >
            <img src={card.image} alt={card.alt} className={styles['grid-img']} />
          </div>
        );
      })}
    </div>
  );
}
