'use client';
import AnimatedSection from './AnimatedSection';
import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: '食べられないものを登録',
    desc: '自分のアレルゲンをアプリに登録するだけ。一度設定すれば毎回入力する必要はありません。',
  },
  {
    num: '02',
    title: '近くの飲食店を検索',
    desc: '現在地や食べたい料理ジャンルで絞り込み。アレルギー対応情報付きで飲食店が一覧表示されます。',
  },
  {
    num: '03',
    title: '安心してお食事を',
    desc: '「食べられる」「要確認」を事前に把握。当日のコミュニケーションもスムーズになります。',
  },
];

export default function ForUsers() {
  return (
    <section id="users" className="py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Phone mockup */}
          <AnimatedSection direction="left" className="relative flex justify-center lg:justify-end">
            <div className="relative w-64 md:w-72">
              {/* Glow */}
              <div className="absolute inset-0 bg-orange/20 rounded-[40px] blur-3xl scale-110" />
              {/* Phone frame */}
              <div className="relative bg-navy rounded-[36px] p-3 shadow-2xl shadow-navy/30">
                <div className="bg-cream rounded-[28px] overflow-hidden aspect-[9/19]">
                  {/* Mock screen */}
                  <div className="p-4 h-full flex flex-col gap-3">
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-6 h-6 bg-orange rounded-full" />
                      <div className="text-[10px] font-black text-navy">MYSHOKU</div>
                    </div>
                    <div className="bg-warm rounded-2xl p-3">
                      <div className="text-[8px] text-muted mb-1">検索</div>
                      <div className="bg-white rounded-lg px-2 py-1.5 text-[8px] text-navy/40">レストランを探す...</div>
                    </div>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white rounded-xl p-3 flex gap-2 shadow-sm">
                        <div className="w-10 h-10 rounded-lg bg-warm shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="h-2 bg-navy/10 rounded mb-1.5 w-3/4" />
                          <div className="h-1.5 bg-navy/5 rounded w-1/2 mb-2" />
                          <div className="flex gap-1">
                            <span className="text-[6px] bg-teal-50 text-teal px-1.5 py-0.5 rounded-full font-bold">対応OK</span>
                            <span className="text-[6px] bg-orange-50 text-orange px-1.5 py-0.5 rounded-full font-bold">要確認</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute -right-6 top-16 bg-white rounded-2xl shadow-xl px-4 py-3"
              >
                <div className="text-[10px] text-muted font-medium">対応アレルゲン</div>
                <div className="text-lg font-black text-navy">30<span className="text-sm">種類以上</span></div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -left-6 bottom-20 bg-orange rounded-2xl shadow-xl px-4 py-3"
              >
                <div className="text-[10px] text-white/80 font-medium">掲載店舗数</div>
                <div className="text-lg font-black text-white">増加中！</div>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Right: Content */}
          <div>
            <AnimatedSection delay={0.1}>
              <span className="inline-block text-orange text-sm font-bold tracking-widest uppercase mb-4">
                For Users
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-navy leading-tight mb-5">
                使い方は<br />かんたん3ステップ
              </h2>
              <p className="text-muted text-lg leading-relaxed mb-10">
                アレルギーがあっても、食事は人生の楽しみ。<br />
                MYSHOKUで「食べられるお店」を、もっと簡単に見つけよう。
              </p>
            </AnimatedSection>

            <div className="flex flex-col gap-6">
              {steps.map((step, i) => (
                <AnimatedSection key={i} delay={0.2 + i * 0.12}>
                  <div className="flex gap-5 group">
                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center transition-colors duration-300 group-hover:bg-orange">
                      <span className="text-orange font-black text-sm transition-colors duration-300 group-hover:text-white">
                        {step.num}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-navy mb-1.5 text-base">{step.title}</h3>
                      <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.55} className="mt-10">
              <a
                href="/search"
                className="inline-flex items-center gap-2.5 bg-navy hover:bg-navy-light text-white font-bold px-7 py-3.5 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                飲食店を探す
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
