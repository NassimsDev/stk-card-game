import styles from './SequenceIndicator.module.css'

function SequenceIndicator({ current, total }) {
  return (
    <span className={styles.indicator}>
      Séquence {current}/{total}
    </span>
  )
}

export default SequenceIndicator
