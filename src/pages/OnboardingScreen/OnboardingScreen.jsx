import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../components/Button/Button.jsx";
import styles from "./OnboardingScreen.module.css";

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

function OnboardingScreen({ onComplete }) {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = avant, -1 = arrière
    const [exiting, setExiting] = useState(false);
    const isLast = index === SLIDES.length - 1;
    const slide = SLIDES[index];
    const touchStartX = useRef(null);

    const goNext = useCallback(() => {
        if (exiting) return;
        setDirection(1);
        if (!isLast) {
            setIndex((i) => i + 1);
        } else {
            setExiting(true);
        }
    }, [isLast, exiting]);

    const goBack = useCallback(() => {
        if (exiting || index === 0) return;
        setDirection(-1);
        setIndex((i) => i - 1);
    }, [index, exiting]);

    const handleTouchStart = useCallback((e) => {
        touchStartX.current = e.touches[0].clientX;
    }, []);

    const handleTouchEnd = useCallback((e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) {
            if (delta < 0) goNext();
            else goBack();
        }
        touchStartX.current = null;
    }, [goNext, goBack]);

    return (
        <div
            className={styles.pageOnboarding}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className={styles.inner}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        className={styles.slide}
                        initial={{ opacity: 0, x: direction * 32 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -32 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <div className={styles.videoWrap}>
                            <video
                                className={styles.videoPlaceholder}
                                src={slide.video}
                                autoPlay
                                muted
                                loop
                                playsInline
                            />
                        </div>

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
                                onClick={() => {
                                    if (exiting || i === index) return;
                                    setDirection(i > index ? 1 : -1);
                                    setIndex(i);
                                }}
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

export default OnboardingScreen;
