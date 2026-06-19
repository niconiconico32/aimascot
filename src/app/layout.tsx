import type { Metadata } from "next";
import { Be_Vietnam_Pro, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

const bodyFont = Be_Vietnam_Pro({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const headingFont = Plus_Jakarta_Sans({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Crowned Portraits",
  description: "Custom vibrant portraits for your loved ones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=optional"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
