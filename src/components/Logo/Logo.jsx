import { useLang } from '../../i18n/useLang';
import styles from './Logo.module.css';

// Logo STK cliquable (retour à l'accueil) — autonome, comme AmbientSelector,
// pour être posé sur n'importe quelle page sans dupliquer son style.
export default function Logo({ onClick, className }) {
  const { t } = useLang();

  return (
    <button
      onClick={onClick}
      className={`${styles['logo-link']}${className ? ` ${className}` : ''}`}
      aria-label={t('common.logoAlt')}
    >
      <img src="/assets/images/STK-logo.svg" alt="STK Architecture" className={styles['header-logo']} />
    </button>
  );
}
