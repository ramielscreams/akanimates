import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-bg text-text-primary">
        {children}
      </body>
    </html>
  );
}
