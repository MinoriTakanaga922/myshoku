'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const headline = ['毎食を、', 'MY食に。'];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy"
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-orange/10 rounded-full blur-[100px] animate-float-slow" />
        <div className="absolute top-1/2 -left-48 w-[400px] h-[400px] bg-teal/10 rounded-full blur-[80px]" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-orange/5 rounded-full blur-[60px] animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Diagonal accent line */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-orange/30 to-transparent hidden md:block" style={{ right: '25%' }} />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-16"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-5 py-2 mb-10"
        >
          <span className="w-2 h-2 bg-orange rounded-full animate-pulse-soft" />
          <span className="text-white/75 text-sm font-medium tracking-wide">
            食物アレルギーのある方も、安心して外食を
          </span>
        </motion.div>

        {/* Headline */}
        <div className="mb-8">
          {headline.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.span
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.9,
                  delay: 0.4 + i * 0.18,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="block text-6xl sm:text-7xl md:text-[88px] font-black text-white leading-[1.1] tracking-tight"
              >
                {line}
              </motion.span>
            </div>
          ))}
        </div>

        {/* Sub-headline accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-8 h-1 w-20 bg-orange rounded-full origin-left"
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          className="text-white/65 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12"
        >
          MYSHOKUは、飲食店のアレルゲン対応情報を可視化し、<br className="hidden sm:block" />
          食物アレルギーがある方が安心して外食できる社会をつくります。
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#services"
            className="group inline-flex items-center gap-2.5 bg-orange hover:bg-orange/90 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-orange/40 hover:-translate-y-1 text-base"
          >
            サービスを見る
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
            >
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#restaurants"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 hover:-translate-y-1 text-base"
          >
            飲食店の方はこちら
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs tracking-[0.2em] uppercase font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 leading-none">
        <svg viewBox="0 0 1440 64" fill="none" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0 64L1440 64L1440 24C1080 64 360 0 0 40L0 64Z" fill="#FDFAF5" />
        </svg>
      </div>
    </section>
  );
}
