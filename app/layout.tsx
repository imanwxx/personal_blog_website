import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/blog/Header";
import Footer from "@/components/blog/Footer";
import SpaceBackground from "@/components/SpaceBackground";
import MouseGlow from "@/components/MouseGlow";
import ReadingProgress from "@/components/blog/ReadingProgress";
import BackToTop from "@/components/blog/BackToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "imanwxx - 太空科幻博客",
  description: "探索技术宇宙的博客 - imanwxx (1064930364@qq.com)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ReadingProgress />
        <SpaceBackground />
        <MouseGlow />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <BackToTop />
      </body>
    </html>
  );
}
