import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Soviets — Participant Questionnaire",
  description: "Join the E-Soviets digital organization. Complete the questionnaire to share your skills, availability, and project ideas for the first year.",
  keywords: ["E-Soviets", "digital organization", "participant questionnaire", "volunteer", "collaboration"],
  authors: [{ name: "E-Soviets Organizers" }],
  openGraph: {
    title: "E-Soviets — Participant Questionnaire",
    description: "Join the E-Soviets digital organization. Complete the questionnaire to share your skills, availability, and project ideas.",
    type: "website",
    locale: "en_US",
    siteName: "E-Soviets",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Soviets — Participant Questionnaire",
    description: "Join the E-Soviets digital organization.",
  },
  robots: {
    index: true,
    follow: false,
    googleBot: {
      index: true,
      follow: false,
      "noarchive": true,
      "nosnippet": false,
    },
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/site.webmanifest",
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('esoviets-theme');var d=document.documentElement;if(t==='light'){d.classList.remove('dark')}else if(t==='dark'){d.classList.add('dark')}else if(window.matchMedia('(prefers-color-scheme: light)').matches){d.classList.remove('dark')}else{d.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}