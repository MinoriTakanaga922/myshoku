import Link from 'next/link';

const footerLinks = {
  サービス: [
    { label: 'ユーザーの方へ', href: '#users' },
    { label: '飲食店の方へ', href: '#restaurants' },
    { label: '飲食店を探す', href: '/search' },
  ],
  会社情報: [
    { label: 'MYSHOKUについて', href: '#story' },
    { label: 'ニュース', href: '#news' },
    { label: 'お問い合わせ', href: '#contact' },
  ],
  法的情報: [
    { label: 'プライバシーポリシー', href: '/privacy' },
    { label: '利用規約', href: '/terms' },
    { label: '特定商取引法に基づく表記', href: '/legal' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-black tracking-tight">
                MY<span className="text-orange">SHOKU</span>
              </span>
            </Link>
            <p className="text-white/45 text-sm leading-relaxed mb-6">
              毎食を、MY食に。<br />
              食物アレルギーがある方も安心して外食できる社会をつくります。
            </p>
            {/* Social links placeholder */}
            <div className="flex gap-3">
              {['twitter', 'instagram'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-orange transition-colors duration-200 flex items-center justify-center"
                  aria-label={s}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white/60 hover:text-white">
                    <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-bold text-sm mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/45 text-sm hover:text-orange transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} MYSHOKU. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            食物アレルギーのある方が安心して外食できる社会へ
          </p>
        </div>
      </div>
    </footer>
  );
}
