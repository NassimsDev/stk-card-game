import styles from './CardPreview.module.css'

function CardPreview({ card, side, placeholder }) {
  if (!card) {
    return (
      <div
        className={`${styles.preview} ${styles[`side-${side}`]} ${styles.empty}`}
        aria-hidden="true"
      >
        <span className={styles.placeholderLabel}>{placeholder}</span>
      </div>
    )
  }

  return (
    <article
      className={`${styles.preview} ${styles[`side-${side}`]}`}
      aria-label={`${card.subtitle} : ${card.title}`}
    >
      <img
        src={card.image}
        alt={card.alt ?? ''}
        className={styles.image}
        draggable="false"
      />
      <div className={styles.overlay}>
        <h2 className={styles.title}>{card.title}</h2>
        <p className={styles.subtitle}>{card.subtitle}</p>
      </div>
    </article>
  )
}

export default CardPreview
