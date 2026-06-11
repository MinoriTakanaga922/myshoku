'use client';
import AnimatedSection from './AnimatedSection';
import { motion } from 'framer-motion';

const stats = [
  { value: '30+', label: '持ち合わせたアレルゲン' },
  { value: '2023', label: '年 日本ビジネスデザイン大賞' },
  { value: '0', label: '円 ユーザー利用料' },
];

const awards = [
  { name: '日本ビジネスデザイン大賞 グランプリ', year: '2023' },
  { name: '立命館APU生活協同組合 パートナーシップ締結', year: '2024' },
  { name: 'アレルギー患者の外食実態に関する研究論文 発表', year: '2024' },
];

export default function Story() {
  return (
    <section id="story" className="py-28 bg-warm overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Content */}
          <div>
            <AnimatedSection direction="left">
              <span className="inline-block text-orange text-sm font-bold tracking-widest uppercase mb-4">
                Our Story
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-navy leading-tight mb-6">
                「食べる楽しみ」を、<br />すべての人に。
              </h2>
              <div className="space-y-4 text-muted leading-relaxed mb-8">
                <p>
                  代表の本田颯大は、生まれながらに30種類以上の食物アレルギーを持っています。
                  外食のたびに感じる不安、「何が入っているか分からない」という恐怖——
                  その経験が、MYSHOKUの原点です。
                </p>
                <p>
                  「アレルギーがあっても、食事の時間を心から楽しんでほしい」
                  その想いひとつで、飲食店と食べる人をつなぐプラットフォームの開発をスタートしました。
                </p>
                <p>
                  情報を可視化することで、アレルギーを持つ人が安心して外食できる社会を—。
                  MYSHOKUは、その第一歩です。
                </p>
              </div>

              {/* Awards */}
              <div className="space-y-3">
                {awards.map((a, i) => (
                  <AnimatedSection key={i} delay={0.2 + i * 0.1}>
                    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm">
                      <div className="w-1.5 h-8 bg-orange rounded-full shrink-0" />
                      <div>
                        <div className="text-navy font-medium text-sm">{a.name}</div>
                        <div className="text-muted text-xs">{a.year}</div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Right: Founder card + stats */}
          <AnimatedSection direction="right" className="flex flex-col gap-6">
            {/* Founder card */}
            <div className="relative bg-white rounded-3xl p-8 shadow-xl shadow-navy/8 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange/8 rounded-full blur-3xl" />
              <div className="relative z-10 flex gap-6 items-start">
                {/* Avatar placeholder */}
                <div className="shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange/30 to-teal/30 flex items-center justify-center">
                    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10 text-navy/40">
                      <circle cx="20" cy="15" r="7" stroke="currentColor" strokeWidth="2" />
                      <path d="M6 36c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="text-navy font-black text-xl mb-1">本田 颯大</div>
                  <div className="text-orange text-sm font-bold mb-2">代表</div>
                  <p className="text-muted text-sm leading-relaxed">
                    30種類以上の食物アレルギーを持ち、自身の経験からMYSHOKUを創業。
                    アレルギーを持つ人が安心して外食できる社会の実現を目指す。
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white rounded-2xl p-5 text-center shadow-sm"
                >
                  <div className="text-2xl font-black text-orange mb-1">{s.value}</div>
                  <div className="text-muted text-xs leading-tight">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
