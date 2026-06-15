import styles from './MiniCard.module.css'

function MiniCard({
  variant = 'idle',
  tone = 'base',
  onClick,
  ariaLabel,
  disabled = false,
}) {
  const className = [
    styles.miniCard,
    styles[`tone-${tone}`],
    styles[`variant-${variant}`],
  ].join(' ')

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={variant === 'selected'}
      disabled={disabled || variant === 'matched'}
    />
  )
}

export default MiniCard
