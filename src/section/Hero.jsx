import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  FiChevronLeft,
  FiChevronRight,
  FiPlay,
  FiPause,
  FiArrowDown,
  FiCalendar,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

import churchDesktop from '../assets/church.jpg';
import churchMobile from '../assets/churchP.png';
import bishopsDesktop from '../assets/churchL.png';
import bishopsMobile from '../assets/churchE.jpeg';
import cmaDesktop from '../assets/cma.jpg';
import cmaMobile from '../assets/cmaP.png';
import grotoDesktop from '../assets/Groto.jpg';

/** Auto-advance interval in milliseconds. */
const ROTATE_MS = 8000;

const SLIDES = [
  {
    id: 1,
    title: 'Welcome to Christ the King',
    subtitle: 'A Eucharistic Community',
    description:
      'A community striving for holiness through a rich sacramental life and serving God in our daily lives.',
    primary: { label: 'Join Us This Sunday', to: '/mass-times', icon: FiCalendar },
    secondary: { label: 'Our History', to: '/history', icon: FiPlay },
    img: { desktop: churchDesktop, mobile: churchMobile },
  },
  {
    id: 2,
    title: "Experience God's Presence",
    subtitle: 'Daily Mass & Adoration',
    description:
      'Deepen your faith through daily Eucharist, confession, and perpetual adoration.',
    primary: { label: 'Mass Schedule', to: '/mass-times', icon: FiCalendar },
    secondary: { label: 'Adoration Times', to: '/adoration', icon: FiPlay },
    img: { desktop: bishopsDesktop, mobile: bishopsMobile },
  },
  {
    id: 3,
    title: 'Growing Together in Faith',
    subtitle: 'Community & Fellowship',
    description:
      'Join our vibrant community with programs for children, youth, and adults.',
    primary: { label: 'Our Ministries', to: '/get-involved', icon: FiCalendar },
    secondary: { label: 'Get Involved', to: '/get-involved', icon: FiPlay },
    img: { desktop: cmaDesktop, mobile: cmaMobile },
  },
  {
    id: 4,
    title: 'Prepare Your Heart',
    subtitle: 'Season of Lent',
    description:
      'Join us for special Lenten services, confessions, and Easter celebrations.',
    primary: { label: 'Announcements', to: '/announcements', icon: FiCalendar },
    secondary: { label: 'Confession Times', to: '/confession', icon: FiPlay },
    img: { desktop: grotoDesktop, mobile: grotoDesktop },
  },
];

/**
 * Foreground content card. Renders one slide's badge, title,
 * description, and two CTA buttons inside the glassmorph panel.
 *
 * Proportional sizing:
 *   - min-h ensures the card occupies a substantial, consistent slice
 *     of the hero at every breakpoint.
 *   - flex flex-col justify-center vertically centers the content
 *     inside that taller card so extra height becomes even padding.
 *   - Wider max-w on large screens keeps the card from looking tall
 *     and skinny once the height increases.
 *
 * Description styling:
 *   - White at 95% opacity with a strong shadow for legibility.
 *   - text-base → text-xl across breakpoints.
 *   - leading-loose and tracking-wide for generous vertical rhythm.
 *   - max-w-none so it fills the card, matching the title width.
 *
 * Buttons:
 *   - rounded-xl (matches site button system).
 *   - font-bold and text-base → text-lg.
 *   - Taller (py-3.5 → py-4) and wider (px-6 → px-8) for presence.
 *   - Icons sized explicitly to match the larger text.
 */
function SlideContent({ slide, shouldReduceMotion }) {
  return (
    <motion.div
      key={slide.id}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full mx-auto text-center text-white
                 max-w-[min(1000px,92%)]
                 min-h-[420px] sm:min-h-[480px] lg:min-h-[540px]
                 flex flex-col justify-center
                 bg-black/20 backdrop-blur-[3px]
                 rounded-[20px] border border-white/10
                 px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16"
    >
      {/* Subtitle badge — pill is fine here, it's a label not an action */}
      <span
        className="self-center inline-block text-white uppercase tracking-[3px]
                   bg-[rgba(128,0,0,0.2)] rounded-full
                   border border-white/20 backdrop-blur-[5px]
                   mb-4 px-3 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm"
      >
        {slide.subtitle}
      </span>

      <h1
        className="font-bold text-white leading-[1.1] mb-5
                   text-3xl sm:text-5xl lg:text-6xl
                   [text-shadow:2px_2px_8px_rgba(0,0,0,0.5)]"
      >
        {slide.title}
      </h1>

      {/* Description — white, larger, well-spaced, fills the card */}
      <p
        className="mx-auto text-white/95 tracking-wide mb-8
                   text-base sm:text-lg lg:text-xl
                   leading-loose max-w-none
                   [text-shadow:1px_1px_6px_rgba(0,0,0,0.7)]"
      >
        {slide.description}
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          to={slide.primary.to}
          className="inline-flex items-center gap-2.5 rounded-xl font-bold
                     transition-all duration-300
                     bg-primary text-white shadow-[0_4px_15px_rgba(139,26,26,0.3)]
                     hover:bg-primary-hover hover:-translate-y-0.5
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
                     focus-visible:ring-offset-2 focus-visible:ring-offset-black/20
                     px-6 py-3.5 text-base sm:px-8 sm:py-4 sm:text-lg"
        >
          <slide.primary.icon aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6" />
          {slide.primary.label}
        </Link>

        <Link
          to={slide.secondary.to}
          className="inline-flex items-center gap-2.5 rounded-xl font-bold
                     transition-all duration-300
                     bg-white/10 text-white border-2 border-white/50 backdrop-blur-[5px]
                     hover:bg-white/20 hover:border-white hover:-translate-y-0.5
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
                     focus-visible:ring-offset-2 focus-visible:ring-offset-black/20
                     px-6 py-3.5 text-base sm:px-8 sm:py-4 sm:text-lg"
        >
          <slide.secondary.icon aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6" />
          {slide.secondary.label}
        </Link>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const goTo = (i) => setIndex(i);

  useEffect(() => {
    if (!autoPlay || shouldReduceMotion) return;
    const timer = setInterval(next, ROTATE_MS);
    return () => clearInterval(timer);
  }, [autoPlay, shouldReduceMotion, next]);

  const slide = SLIDES[index];

  return (
    <section
      aria-label="Parish highlights"
      className="relative w-full min-h-screen flex flex-col overflow-hidden bg-neutral-900"
    >
      {/* Background images — crossfade between slides */}
      <div className="absolute inset-0">
        <AnimatePresence>
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <picture>
              <source media="(max-width: 768px)" srcSet={slide.img.mobile} />
              <img
                src={slide.img.desktop}
                alt=""
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </picture>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main content area */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
        <AnimatePresence mode="wait">
          <SlideContent
            key={slide.id}
            slide={slide}
            shouldReduceMotion={shouldReduceMotion}
          />
        </AnimatePresence>
      </div>

      {/* Controls footer */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-6 flex items-center justify-between">
        {/* Scroll indicator — desktop only */}
        <a
          href="#mission"
          aria-label="Scroll to next section"
          className="hidden md:flex flex-col items-center gap-2 text-white/80
                     hover:text-white transition-colors"
        >
          <span
            className="text-xs uppercase tracking-widest"
            style={{ writingMode: 'vertical-lr' }}
          >
            Scroll
          </span>
          <FiArrowDown size={20} />
        </a>

        {/* Dot indicators — centered */}
        <div className="flex-1 flex justify-center gap-2 md:gap-3">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? 'true' : 'false'}
              className="p-1 group"
            >
              <span
                className={`block h-1 rounded-full transition-all duration-300 ${
                  i === index
                    ? 'bg-primary w-6 md:w-10'
                    : 'bg-white/50 group-hover:bg-white w-4 md:w-6'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Play/pause — desktop only, circular icon button */}
        <button
          onClick={() => setAutoPlay((p) => !p)}
          aria-label={autoPlay ? 'Pause slideshow' : 'Resume slideshow'}
          className="hidden md:flex w-10 h-10 items-center justify-center rounded-full
                     bg-white/10 backdrop-blur-[5px] border-2 border-white/30 text-white
                     hover:bg-primary/80 hover:border-white transition-all duration-300"
        >
          {autoPlay ? <FiPause /> : <FiPlay />}
        </button>
      </div>

      {/* Previous / Next arrows — desktop only, circular icon buttons */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20
                   w-12 h-12 items-center justify-center rounded-full
                   bg-white/10 backdrop-blur-[5px] border-2 border-white/30 text-white
                   hover:bg-primary/80 hover:border-white hover:scale-110
                   transition-all duration-300"
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20
                   w-12 h-12 items-center justify-center rounded-full
                   bg-white/10 backdrop-blur-[5px] border-2 border-white/30 text-white
                   hover:bg-primary/80 hover:border-white hover:scale-110
                   transition-all duration-300"
      >
        <FiChevronRight size={24} />
      </button>
    </section>
  );
}