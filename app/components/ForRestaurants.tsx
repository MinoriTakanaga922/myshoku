'use client';
import AnimatedSection from './AnimatedSection';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4z" stroke="currentColor" strokeWidth="2" />
        <path d="M11 16l4 4 7-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: '新しい顧客との出会い',
    desc: 'アレルギーを持つ方々が安心して来店できるお店として認知され、これまでリーチできなかった層へのアプローチが可能になります。',
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <rect x="4" y="8" width="24" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M8 14h16M8 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: '対応情報を正確に発信',
    desc: '「実は対応できます」という情報を正確かつ詳細に発信。お客様の「電話して確認する」という手間をなくし、来店のハードルを下げます。',
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <path d="M16 4l3.09 6.26L26 11.27l-5 4.87 1.18 6.88L16 19.77l-6.18 3.25L11 16.14 6 11.27l6.91-1.01L16 4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
    title: 'アレルギー対応店として差別化',
    desc: '食物アレルギー対応への取り組みを可視化することで、社会的責任を果たす企業として信頼とブランド価値を高めます。',
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <path d="M8 24V12l8-8 8 8v12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <rect x="13" y="18" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    title: '掲載は無料からスタート',
    desc: '基本情報の掲載は無料でご利用いただけます。まずはお気軽にご登録ください。サポートチームが丁寧にご案内します。',
  },
];

export default function ForRestaurants() {
  return (
    <section id="restaurants" className="py-28 bg-navy overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block text-teal text-sm font-bold tracking-widest uppercase mb-4">
            For Restaurants
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">
            飲食店の方へ
          </h2>
          <p className="text-white/55 text-lg max-w-xl mx-auto leading-relaxed">
            アレルギー対応の取り組みを、もっと多くの人に届けましょう。<br />
            MYSHOKUに掲載することで、新しいつながりが生まれます。
          </p>
        </AnimatedSection>

        {/* Benefits grid */}
        <div className="grid sm:grid-cols-2 gap-5 mb-14">
          {benefits.map((b, i) => (
            <AnimatedSection key={i} delay={0.1 + i * 0.1}>
              <div className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1">
                <div className="inline-flex p-3 rounded-xl bg-white/10 text-teal mb-5 group-hover:bg-teal group-hover:text-white transition-all duration-300">
                  {b.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{b.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{b.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA block */}
        <AnimatedSection delay={0.5}>
          <div className="relative bg-white/5 border border-white/10 rounded-3xl p-10 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange/10 to-teal/10 rounded-3xl" />
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
                まずは無料で掲載してみませんか？
              </h3>
              <p className="text-white/55 mb-8 max-w-md mx-auto">
                導入に際してご不明な点はサポートチームが丁寧にお答えします。お気軽にお申し込みください。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 bg-orange hover:bg-orange/90 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-orange/40 hover:-translate-y-1"
                >
                  掲載を申し込む（無料）
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-full transition-all duration-300"
                >
                  詳しく聞いてみる
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
