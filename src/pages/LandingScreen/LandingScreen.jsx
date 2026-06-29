import { motion } from "framer-motion";
import Button from "../../components/Button/Button.jsx";
import { soundManager } from "../../utils/soundManager";
import styles from "./LandingScreen.module.css";
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const _inspirations = shuffle(Array.from({ length: 21 }, (_, i) => `/assets/cards/inspiration/card-inspiration-${String(i + 1).padStart(2, "0")}.webp`));
const _innovations = shuffle(Array.from({ length: 21 }, (_, i) => `/assets/cards/innovation/card-innovation-${String(i + 1).padStart(2, "0")}.webp`));
const CARD_IMAGES = _inspirations.flatMap((insp, i) => [insp, _innovations[i]]);

// Dimensions du canvas de référence sur lequel les positions ont été dessinées
const CANVAS_W = 1280;
const CANVAS_H = 800;

// Format : [left, top, width, height, tone, opacity] — ratio 7:10 (images 350×500)
const W = 63;
const H = 90;
const CARDS = [
    // === LIGNE DU HAUT (De gauche à droite) ===
    [-30, -60, W, H, "base", 1],
    [50, -5, W, H, "dark", 1],
    [140, 15, W, H, "alt", 1],
    [220, 35, W, H, "base", 1],
    [310, 10, W, H, "dark", 1],
    [390, 40, W, H, "base", 1],
    [470, -10, W, H, "alt", 1],
    [550, 15, W, H, "dark", 1],
    [640, 45, W, H, "base", 1],
    [720, -5, W, H, "dark", 1],
    [800, 10, W, H, "base", 1],
    [880, 30, W, H, "alt", 1],
    [960, -5, W, H, "dark", 1],
    [1040, 25, W, H, "base", 1],
    [1120, -15, W, H, "dark", 1],
    [1200, 15, W, H, "alt", 1],

    // === VIRAGE À DROITE (Descente) ===
    [1260, 100, W, H, "base", 1],
    [1270, 200, W, H, "dark", 1],
    [1240, 290, W, H, "base", 1],

    // === LIGNE DU MILIEU (De droite à gauche) ===
    [1160, 320, W, H, "alt", 1],
    [1080, 290, W, H, "base", 1],
    [990, 330, W, H, "dark", 1],
    [910, 300, W, H, "alt", 1],
    [830, 340, W, H, "base", 1],
    [740, 320, W, H, "dark", 1],
    [660, 350, W, H, "base", 1],
    [580, 310, W, H, "alt", 1],
    [500, 280, W, H, "base", 1],
    [420, 330, W, H, "dark", 1],
    [340, 310, W, H, "base", 1],
    [260, 290, W, H, "alt", 1],
    [180, 340, W, H, "dark", 1],
    [100, 320, W, H, "base", 1],
    [20, 300, W, H, "alt", 1],

    // === VIRAGE À GAUCHE & LIGNE DU BAS (De gauche à droite sous le texte) ===
    [-10, 420, W, H, "dark", 1],
    [10, 520, W, H, "base", 1],
    [30, 620, W, H, "alt", 1],
    [110, 650, W, H, "base", 1],
    [190, 620, W, H, "dark", 1],
    [280, 670, W, H, "alt", 1],
    [360, 640, W, H, "base", 1],
    [440, 680, W, H, "dark", 1],
    [520, 620, W, H, "base", 1],
    [600, 650, W, H, "alt", 1],
    [680, 690, W, H, "dark", 1],
    [760, 660, W, H, "base", 1],
    [840, 630, W, H, "alt", 1],
    [920, 670, W, H, "dark", 1],
];

function LandingScreen({ onStart }) {
    // Scale calculé une fois au montage pour adapter la courbe à la taille du viewport.
    // Les coordonnées de chaque carte sont exprimées en "pixels canvas" (1280×800),
    // on les convertit en pixels viewport en centrant + réduisant proportionnellement.
    const vpW = typeof window !== 'undefined' ? window.innerWidth : CANVAS_W;
    const vpH = typeof window !== 'undefined' ? window.innerHeight : CANVAS_H;
    const scale = Math.min(1, vpW / CANVAS_W, vpH / CANVAS_H);
    const cx = vpW / 2;
    const cy = vpH / 2;

    return (
        <div className={styles.page}>
            <div className={styles.maskWrapper}>
                <div className={styles.cardsLayer}>
                    {CARDS.map(([left, top, width, height, , opacity], i) => (
                        <motion.img
                            key={i}
                            src={CARD_IMAGES[i % CARD_IMAGES.length]}
                            alt=""
                            aria-hidden="true"
                            className={styles.card}
                            style={{
                                left: `${(left - CANVAS_W / 2) * scale + cx}px`,
                                top:  `${(top  - CANVAS_H / 2) * scale + cy}px`,
                                width:  `${width  * scale}px`,
                                height: `${height * scale}px`,
                                borderRadius: `${Math.round(8 * scale)}px`,
                            }}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: opacity ?? 1, scale: 1 }}
                            transition={{
                                delay: i * 0.1,
                                duration: 0.95,
                                ease: "easeOut",
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className={styles.content}>
                {/* <Logo /> */}
                <img src="/assets/images/STK-logo.svg" alt="STK" className={styles.logo} />
                <h1>La passerelle</h1>
                <p className={styles.subtitle}>
                    Associez chaque carte de la nature à son innovation pour découvrir le lien qui les unit.
                </p>
                <div className={styles.cta}>
                    <Button onClick={() => {
                        soundManager.play('gameStart');
                        onStart();
                    }}>
                        Commencer l'exploration
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default LandingScreen;
