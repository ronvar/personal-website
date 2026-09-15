import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import { MantineProviderWrapper, ColorSchemeScript } from "@/components/MantineProviderWrapper";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ronald Vargas | Software Engineer & Technical Support",
  description: "Software engineer and technical support specialist. I build products and help people use them: application issues, hardware, networking, and training.",
  keywords: ["Software Engineer", "Technical Support", "Full Stack Developer", "React", "Next.js", "TypeScript", "AWS", "End-user Support"],
  authors: [{ name: "Ronald Vargas" }],
  openGraph: {
    title: "Ronald Vargas | Software Engineer & Technical Support",
    description: "Software engineer who also supports users, colleagues, and systems: React, TypeScript, and hands-on technology support.",
    type: "website",
    images: ["/img/meta.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ronald Vargas | Software Engineer & Technical Support",
    description: "Software engineer who also supports users, colleagues, and systems: React, TypeScript, and hands-on technology support.",
    images: ["/img/meta.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className={inter.className}>
        <MantineProviderWrapper>
          <Analytics />
          {children}
        </MantineProviderWrapper>
      </body>
    </html>
  );
}
