import type { Metadata } from "next";
import {
  Barlow_Condensed,
  Inter,
  Roboto_Serif,
  Tenor_Sans,
} from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  weight: ["900"],
  style: ["normal"],
});

const robotoSerif = Roboto_Serif({
  axes: ["GRAD", "opsz", "wdth"],
  subsets: ["latin"],
  variable: "--font-roboto-serif",
});

const tenorSans = Tenor_Sans({
  subsets: ["latin"],
  variable: "--font-tenor-sans",
  weight: "400",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AK",
  description: "A minimal portfolio workspace for AK.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${tenorSans.variable} ${robotoSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-text-primary">
        {children}
      </body>
    </html>
  );
}
