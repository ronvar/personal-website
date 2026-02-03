import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MantineProviderWrapper, ColorSchemeScript } from "@/components/MantineProviderWrapper";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ronald Vargas | Full Stack Software Engineer",
  description: "Full Stack Software Engineer specializing in React, Next.js, TypeScript, and cloud technologies. Building exceptional digital experiences.",
  keywords: ["Software Engineer", "Full Stack Developer", "React", "Next.js", "TypeScript", "AWS"],
  authors: [{ name: "Ronald Vargas" }],
  openGraph: {
    title: "Ronald Vargas | Full Stack Software Engineer",
    description: "Full Stack Software Engineer specializing in React, Next.js, TypeScript, and cloud technologies.",
    type: "website",
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
          {children}
        </MantineProviderWrapper>
      </body>
    </html>
  );
}
