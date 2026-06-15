import styles from './Button.module.css'

function Button({
  children,
  variant = 'outline',
  type = 'button',
  disabled = false,
  onClick,
}) {
  const className = `${styles.button} ${styles[variant]}`
  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
