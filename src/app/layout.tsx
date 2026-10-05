import type { Metadata } from "next";
import Link from "next/link";
import {
  Abril_Fatface,
  Barlow_Condensed,
  Roboto_Serif,
} from "next/font/google";
import "./globals.css";
import "./design-system.css";

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
      className={`${abrilFatface.variable} ${barlowCondensed.variable} ${robotoSerif.variable} h-full antialiased`}
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
