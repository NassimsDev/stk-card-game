import styles from './Logo.module.css'

function Logo() {
  return (
    <div className={styles.logo} aria-label="STK Architecture">
      <span className={styles.brand}>STK</span>
      <span className={styles.tagline}>ARCHITECTURE</span>
    </div>
  )
}

export default Logo
