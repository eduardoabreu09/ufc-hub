import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "UFC Hub",
    template: "%s | UFC Hub",
  },
  description:
    "Plataforma de colaboração para estudantes da UFC com grupos, eventos e blog.",
  keywords: [
    "UFC",
    "universidade",
    "grupos de estudo",
    "eventos acadêmicos",
    "blog estudantil",
  ],
  openGraph: {
    title: "UFC Hub",
    description:
      "Central para grupos, eventos e notícias da comunidade da UFC.",
    siteName: "UFC Hub",
    locale: "pt_BR",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
