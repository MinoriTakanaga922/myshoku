import type { Metadata } from "next";
import { Noto_Sans_JP, Inter } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-noto",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MYSHOKU | 毎食を、MY食に。",
  description:
    "食物アレルギーがあっても安心して外食できる。飲食店のアレルゲン対応情報を可視化するサービス、MYSHOKU（マイショク）。",
  openGraph: {
    title: "MYSHOKU | 毎食を、MY食に。",
    description: "食物アレルギーがあっても安心して外食できる社会をつくる。",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
