import type { Metadata } from "next";
import { ZCOOL_XiaoWei, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const zCOOL = ZCOOL_XiaoWei({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-zCOOL",
});

const notoSans = Noto_Sans_SC({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "AndyAI - 宝宝成长记录",
  description: "记录小Andy的每一个珍贵时刻",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${zCOOL.variable} ${notoSans.variable} min-h-screen flex flex-col antialiased`}>
        {children}
      </body>
    </html>
  );
}
