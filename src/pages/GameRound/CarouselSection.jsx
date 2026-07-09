import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { applyArcTransforms, setArcTransition, CAROUSEL_REPEAT } from './gameRound.constants';
import styles from './GameRound.module.css';
import 'swiper/css';

export default function CarouselSection({
  visibleCarouselCards,
  swiperInstanceRef,
  isAnimating,
  selectedCarouselLeftIdx,
  selectedCarouselRightIdx,
  onCardTap,
}) {
  const repeatedCards = useMemo(() => {
    if (visibleCarouselCards.length === 0) return [];
    const out = [];
    for (let i = 0; i < CAROUSEL_REPEAT; i++) out.push(...visibleCarouselCards);
    return out;
  }, [visibleCarouselCards]);

  const initialSlide = Math.floor(CAROUSEL_REPEAT / 2) * visibleCarouselCards.length;

  return (
    <div className={styles['mobile-carousel']}>
      <Swiper
        virtualTranslate
        watchSlidesProgress
        centeredSlides
        slidesPerView="auto"
        speed={550}
        shortSwipes
        longSwipesRatio={0.2}
        resistance
        resistanceRatio={0.55}
        initialSlide={initialSlide}
        onSwiper={(s) => {
          swiperInstanceRef.current = s;
          requestAnimationFrame(() => applyArcTransforms(s));
        }}
        onSlideChange={(s) => {
          const len = visibleCarouselCards.length;
          if (len === 0) return;
          const idx = s.activeIndex;
          if (idx < len)           s.slideTo(idx + len, 0, false);
          else if (idx >= len * 2) s.slideTo(idx - len, 0, false);
        }}
        onSetTranslate={applyArcTransforms}
        onResize={applyArcTransforms}
        onSetTransition={(s, duration) => setArcTransition(s, duration)}
        onTouchStart={(s) => setArcTransition(s, 0)}
        modules={[]}
        key={`carousel-${visibleCarouselCards.length}`}
        className={styles['carousel-swiper']}
      >
        {repeatedCards.map((card, idx) => {
          const isSelected =
            (card.type === 'inspiration' && idx === selectedCarouselLeftIdx) ||
            (card.type === 'innovation'  && idx === selectedCarouselRightIdx);

          return (
            <SwiperSlide
              key={`${card.type}-${card.pairId}-${idx}`}
              className={styles['carousel-slide']}
            >
              <motion.div
                className={[
                  styles['carousel-card'],
                  isSelected ? styles['carousel-card-selected'] : '',
                  isAnimating ? styles['carousel-card-locked'] : '',
                ].filter(Boolean).join(' ')}
                onClick={() => {
                  if (isAnimating) return;
                  onCardTap(card, idx);
                }}
                animate={isSelected ? { y: -6 } : { y: 0 }}
                transition={{ duration: 0.18 }}
              >
                <img
                  src={card.image}
                  alt={card.alt}
                  className={styles['carousel-card-img']}
                  draggable={false}
                />
              </motion.div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
