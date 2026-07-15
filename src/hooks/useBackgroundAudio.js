import { useEffect, useRef } from 'react';
import { soundManager } from '../utils/soundManager';

/**
 * Coupe tout le son (musique de fond + effets en cours) quand l'onglet/l'app
 * passe en arrière-plan (écran verrouillé, changement d'appli, changement
 * d'onglet), et relance la musique de fond quand l'utilisateur revient — mais
 * uniquement si elle était censée jouer à ce moment-là.
 *
 * S'appuie sur l'API Page Visibility (`document.hidden` / l'événement
 * `visibilitychange`), supportée par tous les navigateurs mobiles modernes.
 *
 * @param {boolean} isActive - true si la musique de fond DOIT jouer dans
 *   l'état actuel de l'app (ex : partie en cours, pas sur un écran de
 *   transition, pas encore démarré...). C'est ce composant appelant qui sait
 *   quand l'audio doit tourner ; le hook ne fait que réagir au visibility.
 */
export function useBackgroundAudio(isActive) {
  // Ref pour toujours lire la valeur la PLUS RÉCENTE de isActive depuis le
  // listener, sans avoir à le recréer (donc sans le retirer/rajouter) à
  // chaque changement de isActive. Ça évite tout risque de listeners
  // dupliqués et garde l'effet de setup/cleanup ci-dessous à deps vides.
  const isActiveRef = useRef(isActive);
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  // Mémorise si c'est NOUS qui avons mis en pause à cause du passage en
  // arrière-plan — pour ne reprendre la lecture que dans ce cas précis, et
  // ne pas relancer un son qui était déjà coupé pour une autre raison
  // (écran de transition, mute manuel, partie pas commencée...).
  const pausedByVisibilityRef = useRef(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Onglet caché / app en arrière-plan / écran verrouillé.
        if (isActiveRef.current) {
          soundManager.pauseAll();
          pausedByVisibilityRef.current = true;
        }
        return;
      }

      // De retour au premier plan : on ne relance QUE si c'est nous qui
      // avions coupé le son, et seulement si l'app veut toujours de la
      // musique à cet instant (isActiveRef peut avoir changé pendant que
      // l'onglet était caché, ex: séquence terminée entre-temps).
      if (pausedByVisibilityRef.current) {
        pausedByVisibilityRef.current = false;
        if (isActiveRef.current) {
          // playCurrentBg() gère déjà en interne le .catch() de la Promise
          // retournée par audio.play() — nécessaire ici car les navigateurs
          // (surtout iOS Safari) peuvent suspendre le contexte audio pendant
          // la mise en arrière-plan et rejeter la relecture automatique.
          soundManager.playCurrentBg();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup : indispensable pour éviter les fuites mémoire / listeners
    // fantômes si le composant qui utilise ce hook est démonté.
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}
