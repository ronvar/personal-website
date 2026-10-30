import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import { MantineProviderWrapper, ColorSchemeScript } from "@/components/MantineProviderWrapper";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  axes: ["wdth"],
  variable: "--font-archivo",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

const title = "Ronald Vargas | Software engineer & technical support";
const description = "Software engineer who builds web products and supports the people and systems behind them: React, TypeScript, Node.js, AWS, and hands-on IT.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Software Engineer", "Technical Support", "Consultant", "Full Stack Developer", "React", "Next.js", "TypeScript", "AWS", "End-user Support"],
  authors: [{ name: "Ronald Vargas" }],
  openGraph: {
    title,
    description,
    type: "website",
    images: ["/img/meta.png"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/img/meta.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <MantineProviderWrapper>
          <Analytics />
          {children}
        </MantineProviderWrapper>
      </body>
    </html>
  );
}
