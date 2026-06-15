import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../components/Button/Button.jsx";
import styles from "./UnboardingScreen.module.css";

const SLIDES = [
    {
        eyebrow: "Le biomimétisme",
        showLogo: true,
        body: "Decouvrez le biomimétisme avec une expérience ludique et interactive.",
        video: "/assets/videos/video-intro-1.mp4",
    },
    {
        eyebrow: "Comment faire le lien",
        showLogo: false,
        body: "Associez chaque carte de la nature à son innovation pour découvrir le lien qui les unit.",
        video: "/assets/videos/video_reussite.mp4",
    },
    {
        eyebrow: "Besoin d'aide ?",
        showLogo: false,
        body: "Des indices sont disponibles à tout moment pour vous guider si vous êtes bloqué.",
        video: "/assets/videos/video_echec.mp4",
    },
];

function UnboardingScreen({ onComplete }) {
    const [index, setIndex] = useState(0);
    const [exiting, setExiting] = useState(false);
    const isLast = index === SLIDES.length - 1;
    const slide = SLIDES[index];

    const goNext = useCallback(() => {
        if (!isLast) {
            setIndex((i) => i + 1);
        } else {
            setExiting(true);
        }
    }, [isLast]);

    return (
        <div className={styles.page}>
            <div className={styles.inner}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        className={styles.slide}
                        initial={{ opacity: 0, x: 32 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -32 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <video
                            className={styles.videoPlaceholder}
                            src={slide.video}
                            autoPlay
                            muted
                            loop
                            playsInline
                        />

                        <div className={styles.textBlock}>
                            {slide.eyebrow && (
                                <p className={styles.eyebrow}>
                                    {slide.eyebrow}
                                </p>
                            )}

                            <p className={styles.body}>{slide.body}</p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className={styles.footer}>
                    <div className={styles.controls}>
                        <Button onClick={goNext} disabled={exiting}>
                            {isLast ? "Commencer" : "Suivant"}
                        </Button>
                    </div>
                    <div className={styles.dots}>
                        {SLIDES.map((_, i) => (
                            <button
                                key={i}
                                className={`${styles.dot} ${i === index ? styles.dotActive : i < index ? styles.dotDone : ""}`}
                                onClick={() => !exiting && setIndex(i)}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {exiting && (
                    <motion.div
                        className={styles.fadeOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        onAnimationComplete={onComplete}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default UnboardingScreen;
