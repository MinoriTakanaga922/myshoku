'use client';
import AnimatedSection from './AnimatedSection';
import { motion, type Variants } from 'framer-motion';

// microCMS連携時はこのデータをAPIから取得する
const newsItems = [
  {
    id: 1,
    category: 'パートナーシップ',
    categoryColor: 'bg-teal-50 text-teal',
    date: '2024年1月',
    title: '立命館アジア太平洋大学生活協同組合とパートナーシップを締結',
    excerpt: 'APU生協との連携により、学生・教職員のアレルギー対応情報へのアクセス向上を目指します。',
  },
  {
    id: 2,
    category: '受賞',
    categoryColor: 'bg-orange-50 text-orange',
    date: '2023年12月',
    title: '日本ビジネスデザイン大賞 グランプリを受賞',
    excerpt: 'アレルギーを持つ方の外食体験を変革するビジネスモデルが評価され、グランプリを受賞しました。',
  },
  {
    id: 3,
    category: '研究',
    categoryColor: 'bg-warm text-navy',
    date: '2024年3月',
    title: 'アレルギー患者の外食行動に関する研究論文を発表',
    excerpt: 'アレルギー患者が外食時に感じる不安とMYSHOKUの有効性についての研究成果を学術論文として発表しました。',
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function News() {
  return (
    <section id="news" className="py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <AnimatedSection className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
          <div>
            <span className="inline-block text-orange text-sm font-bold tracking-widest uppercase mb-4">
              News
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-navy leading-tight">
              最新ニュース
            </h2>
          </div>
          <a
            href="/news"
            className="inline-flex items-center gap-2 text-orange font-bold text-sm hover:gap-3 transition-all duration-200 shrink-0"
          >
            すべて見る
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </AnimatedSection>

        {/* News cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid md:grid-cols-3 gap-6"
        >
          {newsItems.map((item) => (
            <motion.article
              key={item.id}
              variants={cardVariants}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              {/* Image placeholder */}
              <div className="h-44 bg-gradient-to-br from-warm to-cream relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/60 flex items-center justify-center">
                    <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 text-navy/20">
                      <rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="2" />
                      <path d="M4 20l7-7 5 5 4-4 8 8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                      <circle cx="22" cy="11" r="2.5" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/10 transition-colors duration-300" />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.categoryColor}`}>
                    {item.category}
                  </span>
                  <span className="text-muted text-xs">{item.date}</span>
                </div>
                <h3 className="font-bold text-navy text-base leading-snug mb-2 group-hover:text-orange transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed line-clamp-2">{item.excerpt}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
