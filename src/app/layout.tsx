import type { Metadata } from "next";
import Link from "next/link";
import {
  Abril_Fatface,
  Barlow_Condensed,
  Inter,
  Roboto_Serif,
  Tenor_Sans,
} from "next/font/google";
import "./globals.css";

const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  variable: "--font-abril-fatface",
  weight: "400",
});

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
  description: "Automotive photography and CGI by AK.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${abrilFatface.variable} ${barlowCondensed.variable} ${tenorSans.variable} ${robotoSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-text-primary">
        {children}
        <footer aria-label="Privacy information">
          <Link className="privacy-utility-link" href="/privacy">
            Privacy
          </Link>
        </footer>
      </body>
    </html>
  );
}
