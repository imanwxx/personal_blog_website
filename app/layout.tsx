import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/blog/Header";
import Footer from "@/components/blog/Footer";
import SpaceBackground from "@/components/SpaceBackground";
import MouseGlow from "@/components/MouseGlow";
import ReadingProgress from "@/components/blog/ReadingProgress";
import BackToTop from "@/components/blog/BackToTop";
import { WebsiteStructuredData } from "@/components/blog/StructuredData";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const BASE_URL = 'http://49.232.232.252:3000';

export const metadata = {
  title: {
    default: "imanwxx - 太空科幻博客",
    template: "%s | imanwxx 博客",
  },
  description: "探索技术宇宙的博客 - 分享机器人、人工智能与智能驾驶技术。imanwxx的个人技术博客，记录学习历程与技术思考。",
  keywords: ["博客", "技术博客", "机器人", "人工智能", "AI", "深度学习", "强化学习", "Next.js", "React"],
  authors: [{ name: "imanwxx" }],
  creator: "imanwxx",
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: "/",
    types: {
      'application/rss+xml': `${BASE_URL}/rss.xml`,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: BASE_URL,
    siteName: "imanwxx - 太空科幻博客",
    title: "imanwxx - 太空科幻博客",
    description: "探索技术宇宙的博客 - 分享机器人、人工智能与智能驾驶技术",
    images: [
      {
        url: `${BASE_URL}/favicon.ico`,
        width: 32,
        height: 32,
        alt: "imanwxx 博客",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "imanwxx - 太空科幻博客",
    description: "探索技术宇宙的博客 - 分享机器人、人工智能与智能驾驶技术",
    creator: "@imanwxx",
    images: [`${BASE_URL}/favicon.ico`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <WebsiteStructuredData
          name="imanwxx - 太空科幻博客"
          url={BASE_URL}
          description="探索技术宇宙的博客 - 分享机器人、人工智能与智能驾驶技术"
        />
      </head>
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
