'use client';
import { motion, type Variants } from 'framer-motion';
import AnimatedSection from './AnimatedSection';

const services = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="22" cy="22" r="14" stroke="currentColor" strokeWidth="3" />
        <path d="M32 32l8 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M16 22h12M22 16v12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'アレルゲン情報を可視化',
    description:
      '飲食店が対応できるアレルゲンを一目で確認。複雑な成分表示を分かりやすく整理し、「食べられる」か「確認が必要か」を直感的に把握できます。',
    color: 'text-orange',
    bg: 'bg-orange-50',
    border: 'border-orange/10',
    accent: 'bg-orange',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M24 8C15.163 8 8 15.163 8 24s7.163 16 16 16 16-7.163 16-16S32.837 8 24 8z" stroke="currentColor" strokeWidth="3" />
        <path d="M17 24l5 5 9-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: '安心して外食を楽しむ',
    description:
      '30種類以上のアレルゲンに対応。検索・絞り込みで自分に合った飲食店を簡単に発見。事前確認のストレスなく、食事の場を楽しめます。',
    color: 'text-teal',
    bg: 'bg-teal-50',
    border: 'border-teal/10',
    accent: 'bg-teal',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="8" y="20" width="32" height="20" rx="4" stroke="currentColor" strokeWidth="3" />
        <path d="M16 20V16a8 8 0 0116 0v4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="24" cy="30" r="3" fill="currentColor" />
      </svg>
    ),
    title: '飲食店のアレルギー対応を支援',
    description:
      'アレルギー対応に積極的な飲食店をサポート。情報を掲載することで新たな顧客との出会いを生み出し、安心できる外食文化の拡大に貢献できます。',
    color: 'text-navy',
    bg: 'bg-warm',
    border: 'border-navy/10',
    accent: 'bg-navy',
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function Services() {
  return (
    <section id="services" className="py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block text-orange text-sm font-bold tracking-widest uppercase mb-4">
            Services
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-navy leading-tight mb-5">
            MYSHOKUで<br className="sm:hidden" />できること
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
            アレルギーがある人も、飲食店も。<br />
            みんながハッピーになれる仕組みをつくっています。
          </p>
        </AnimatedSection>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid md:grid-cols-3 gap-6"
        >
          {services.map((s, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className={`group relative rounded-2xl p-8 border ${s.bg} ${s.border} overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
            >
              {/* Hover accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${s.accent} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl`} />

              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl ${s.bg} ${s.color} mb-6`}>
                {s.icon}
              </div>

              <h3 className="text-xl font-bold text-navy mb-3 leading-snug">{s.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <AnimatedSection delay={0.3} className="text-center mt-14">
          <a
            href="/search"
            className="inline-flex items-center gap-2 text-orange font-bold text-sm hover:gap-3 transition-all duration-200"
          >
            飲食店を探してみる
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
