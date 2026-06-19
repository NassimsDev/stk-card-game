class SoundManager {
  constructor() {
    this.sounds = {};
    this.activeClones = {};
    this.isInitialized = false;
    // ↓ PERSISTANCE MUTE — commenter ce bloc pour désactiver en prod
    const saved = typeof window !== 'undefined' && localStorage.getItem('stk-muted');
    this.isMuted = saved === 'true';
    // ↑ PERSISTANCE MUTE
    // this.isMuted = false; // ← décommenter si le bloc ci-dessus est commenté
  }

  // Initialisation paresseuse pour éviter les erreurs d'instanciation Audio côté serveur si on passait en SSR
  init() {
    if (this.isInitialized || typeof window === 'undefined') return;

    this.sounds = {
      wrong: new Audio('/assets/sounds/son_reponse_fausse.mp3'),
      levelTransition: new Audio('/assets/sounds/son_sequence_v2.mp3'),
      gameStart: new Audio('/assets/sounds/son_debut_jeu.wav'),
      button: new Audio('/assets/sounds/son_bouton_1.wav'),
      cardFlip: new Audio('/assets/sounds/son_carte.wav'),
      correct: new Audio('/assets/sounds/son_reponse_valide.wav'),
      bgMusic: new Audio('/assets/sounds/son_total.mp3')
    };

    // Configuration de la musique de fond
    this.sounds.bgMusic.loop = true;
    this.sounds.bgMusic.volume = 0.12; // Volume modéré (non agressif)

    // Appliquer l'état initial du mute
    Object.values(this.sounds).forEach(sound => {
      sound.muted = this.isMuted;
    });

    this.isInitialized = true;
  }

  play(soundName) {
    if (!this.isInitialized) {
      this.init();
    }

    const sound = this.sounds[soundName];
    if (sound) {
      if (soundName === 'bgMusic') {
        sound.play().catch(error => {
          console.warn(`Impossible de jouer la musique de fond:`, error);
        });
      } else {
        // Cloner l'audio permet de jouer le même son plusieurs fois très rapidement (ex: clics multiples)
        // sans attendre que le premier se termine.
        const clone = sound.cloneNode();
        clone.muted = this.isMuted;
        clone.volume = sound.volume;
        clone.play().catch(error => {
          console.warn(`Impossible de jouer le son ${soundName}:`, error);
        });
        // On garde une référence au clone actif pour pouvoir le couper via stop()
        this.activeClones[soundName] = clone;
      }
    } else {
      console.warn(`Son introuvable : ${soundName}`);
    }
  }

  pause(soundName) {
    if (!this.isInitialized) return;
    const sound = this.sounds[soundName];
    if (sound) {
      sound.pause();
    }
  }

  stop(soundName) {
    if (!this.isInitialized) return;
    const sound = this.sounds[soundName];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
    // play() joue en réalité un clone de l'audio de base : il faut aussi
    // l'arrêter, sinon le son continue malgré l'appel à stop().
    const clone = this.activeClones[soundName];
    if (clone) {
      clone.pause();
      clone.currentTime = 0;
      delete this.activeClones[soundName];
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    // ↓ PERSISTANCE MUTE — commenter cette ligne pour désactiver en prod
    if (typeof window !== 'undefined') localStorage.setItem('stk-muted', this.isMuted);
    // ↑ PERSISTANCE MUTE
    if (this.isInitialized) {
      Object.values(this.sounds).forEach(sound => {
        sound.muted = this.isMuted;
      });
    }
    return this.isMuted;
  }

  getMuteState() {
    return this.isMuted;
  }
}

// On exporte une instance unique (Singleton)
export const soundManager = new SoundManager();
