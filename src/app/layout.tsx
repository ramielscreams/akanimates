import type { Metadata } from "next";
import {
  Archivo,
  Bodoni_Moda,
  Geist,
  Geist_Mono,
  Manrope,
  Roboto_Serif,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const robotoSerif = Roboto_Serif({
  axes: ["GRAD", "opsz", "wdth"],
  subsets: ["latin"],
  variable: "--font-roboto-serif",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500"],
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni-moda",
  weight: ["400", "500"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500"],
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["300", "400", "500"],
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
      className={`${geist.variable} ${geistMono.variable} ${robotoSerif.variable} ${manrope.variable} ${bodoniModa.variable} ${spaceGrotesk.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-text-primary">
        {children}
      </body>
    </html>
  );
}
