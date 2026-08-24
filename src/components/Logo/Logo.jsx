import { useLang } from '../../i18n/useLang';
import styles from './Logo.module.css';

// URL du site STK vers lequel le jeu doit toujours pouvoir renvoyer —
// target="_top" : navigue la fenêtre normalement si le jeu est ouvert en
// page autonome, et fait sortir d'une éventuelle <iframe> si le jeu finit
// par être embarqué dans une page du site STK.
const STK_SITE_URL = 'https://stk-architecture.fr/';

// Logo STK cliquable (retour au site STK) — autonome, comme AmbientSelector,
// pour être posé sur n'importe quelle page sans dupliquer son style.
export default function Logo({ className }) {
  const { t } = useLang();

  return (
    <a
      href={STK_SITE_URL}
      target="_top"
      rel="noopener noreferrer"
      className={`${styles['logo-link']}${className ? ` ${className}` : ''}`}
      aria-label={t('common.logoAlt')}
    >
      <img src="/assets/images/STK-logo.svg" alt="STK Architecture" className={styles['header-logo']} />
    </a>
  );
}
