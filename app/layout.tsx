import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New, Jost } from "next/font/google"; // New fonts: Zen Kaku Gothic New (JP) + Jost (EN)
import "./globals.css";

const zenFont = Zen_Kaku_Gothic_New({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-zen",
});

const jostFont = Jost({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "Scent Planet",
  description: "Visualize Scent Profiles in 3D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${zenFont.variable} ${jostFont.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
