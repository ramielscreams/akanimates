import type { Metadata } from "next";
import {
  Geist,
  Instrument_Serif,
  Michroma,
  Recursive,
  Roboto_Serif,
  Saira_Condensed,
} from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-ui",
});

const recursive = Recursive({
  subsets: ["latin"],
  variable: "--font-technical",
});

const robotoSerif = Roboto_Serif({
  subsets: ["latin"],
  variable: "--font-editorial",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-photography",
  weight: "400",
});

const michroma = Michroma({
  subsets: ["latin"],
  variable: "--font-cgi",
  weight: "400",
});

const sairaCondensed = Saira_Condensed({
  subsets: ["latin"],
  variable: "--font-design",
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
      className={`${geist.variable} ${recursive.variable} ${robotoSerif.variable} ${instrumentSerif.variable} ${michroma.variable} ${sairaCondensed.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-text-primary">
        {children}
      </body>
    </html>
  );
}
