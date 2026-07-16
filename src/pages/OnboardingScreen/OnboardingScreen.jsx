import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../components/Button/Button.jsx";
import AmbientSelector from "../../components/AmbientSelector/AmbientSelector.jsx";
import Logo from "../../components/Logo/Logo.jsx";
import { useLang } from "../../i18n/useLang";
import { strings } from "../../i18n/strings";
import styles from "./OnboardingScreen.module.css";

// Vidéos + mise en page : partagées entre les langues, seul le texte change.
const SLIDE_MEDIA = [
    { showLogo: true, video: "/assets/videos/video-intro-1.mp4" },
    { showLogo: false, video: "/assets/videos/video_reussite.mp4" },
    { showLogo: false, video: "/assets/videos/video_echec.mp4" },
];

function OnboardingScreen({ onComplete, onHome }) {
    const { lang, t } = useLang();
    const SLIDES = useMemo(
        () => SLIDE_MEDIA.map((media, i) => ({ ...media, ...strings[lang].onboarding.slides[i] })),
        [lang]
    );
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = avant, -1 = arrière
    const [exiting, setExiting] = useState(false);
    const [videoReady, setVideoReady] = useState(false);
    const slide = SLIDES[index];
    const isLast = index === SLIDES.length - 1;
    const touchStartX = useRef(null);

    useEffect(() => {
        setVideoReady(false);
    }, [index]);

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
            {/* Desktop : logo épinglé en haut à gauche, indépendant de la vidéo. */}
            <Logo onClick={onHome} className={styles.logoSlot} />

            <div className={styles.inner}>
                {/* Mobile : logo + ambiance côte à côte, centrés ensemble (voir CSS) —
                    le logo du dessus se masque, celui-ci prend le relais. */}
                <div className={styles.ambientRow}>
                    <Logo onClick={onHome} className={styles.logoInline} />
                    <AmbientSelector />
                </div>

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
                            {!videoReady && (
                                <div className={styles.spinner} aria-hidden="true" />
                            )}
                            <video
                                className={styles.videoPlaceholder}
                                src={slide.video}
                                autoPlay
                                muted
                                loop
                                playsInline
                                onCanPlay={() => setVideoReady(true)}
                            />
                        </div>

                        <div className={styles.textBlock}>
                            {slide.eyebrow && (
                                <p className={styles.eyebrow}>
                                    {slide.eyebrow}
                                </p>
                            )}

                            <div className={styles.bodyWrap}>
                                {/* Copies invisibles de tous les textes : réservent en
                                    permanence la hauteur du plus long, pour que le CTA
                                    en dessous reste à la même position sur les 3 slides
                                    (sensible sur mobile où le texte wrap sur plus de
                                    lignes selon sa longueur). */}
                                <div className={styles.bodySizer} aria-hidden="true">
                                    {SLIDES.map((s, i) => (
                                        <p key={i} className={styles.body}>{s.body}</p>
                                    ))}
                                </div>
                                <p className={styles.body}>{slide.body}</p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className={styles.footer}>
                    <div className={styles.controls}>
                        <Button onClick={goNext} disabled={exiting}>
                            {isLast ? t('onboarding.play') : t('onboarding.next')}
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
                                aria-label={t('onboarding.slideAria')(i + 1)}
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
