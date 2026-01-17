import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google"; // Softer, rounded Japanese font
import "./globals.css";

const roundedFont = M_PLUS_Rounded_1c({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-rounded",
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
        className={`${roundedFont.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
