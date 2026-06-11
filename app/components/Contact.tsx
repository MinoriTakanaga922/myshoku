'use client';
import { useState } from 'react';
import AnimatedSection from './AnimatedSection';

type FormType = 'user' | 'restaurant' | 'other';

const types: { value: FormType; label: string }[] = [
  { value: 'user', label: 'ユーザーとして' },
  { value: 'restaurant', label: '飲食店として掲載したい' },
  { value: 'other', label: 'その他のお問い合わせ' },
];

export default function Contact() {
  const [formType, setFormType] = useState<FormType>('restaurant');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: フォーム送信ロジック（Formspree / メール等）
    setSent(true);
  };

  return (
    <section id="contact" className="py-28 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <AnimatedSection className="text-center mb-12">
          <span className="inline-block text-orange text-sm font-bold tracking-widest uppercase mb-4">
            Contact
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-navy leading-tight mb-5">
            お問い合わせ
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            ご質問・掲載のご相談など、お気軽にご連絡ください。<br />
            通常2営業日以内にご返信いたします。
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          {sent ? (
            <div className="text-center py-16">
              <div className="inline-flex w-16 h-16 bg-teal-50 rounded-full items-center justify-center mb-5">
                <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 text-teal">
                  <path d="M7 16l7 7 11-12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-navy mb-2">送信しました！</h3>
              <p className="text-muted">お問い合わせありがとうございます。2営業日以内にご連絡いたします。</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-cream rounded-3xl p-8 md:p-12 space-y-6">
              {/* Type selector */}
              <div>
                <label className="block text-navy font-bold text-sm mb-3">お問い合わせの種類</label>
                <div className="flex flex-wrap gap-3">
                  {types.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setFormType(t.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                        formType === t.value
                          ? 'bg-orange border-orange text-white shadow-md shadow-orange/20'
                          : 'bg-white border-navy/10 text-muted hover:border-orange/40'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-navy font-bold text-sm mb-2">お名前 <span className="text-orange">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="山田 太郎"
                    className="w-full bg-white border border-navy/10 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:border-orange transition-colors placeholder:text-navy/30"
                  />
                </div>
                <div>
                  <label className="block text-navy font-bold text-sm mb-2">メールアドレス <span className="text-orange">*</span></label>
                  <input
                    type="email"
                    required
                    placeholder="example@email.com"
                    className="w-full bg-white border border-navy/10 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:border-orange transition-colors placeholder:text-navy/30"
                  />
                </div>
              </div>

              {formType === 'restaurant' && (
                <div>
                  <label className="block text-navy font-bold text-sm mb-2">店舗名</label>
                  <input
                    type="text"
                    placeholder="○○レストラン"
                    className="w-full bg-white border border-navy/10 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:border-orange transition-colors placeholder:text-navy/30"
                  />
                </div>
              )}

              <div>
                <label className="block text-navy font-bold text-sm mb-2">メッセージ <span className="text-orange">*</span></label>
                <textarea
                  required
                  rows={5}
                  placeholder="お問い合わせ内容をご記入ください"
                  className="w-full bg-white border border-navy/10 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:border-orange transition-colors placeholder:text-navy/30 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange hover:bg-orange/90 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange/30 hover:-translate-y-0.5 text-base"
              >
                送信する
              </button>
            </form>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}
