import type { Metadata } from "next";
import { Open_Sans, Koulen } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { WalletProvider } from "@/contexts/WalletContext";

const openSans = Open_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-custom'
});

const koulen = Koulen({
  weight: ['400'],
  subsets: ["latin"],
  variable: '--font-display'
});

export const metadata: Metadata = {
  title: "AutonoBee - AI-powered Content Creation Platform",
  description: "AI-powered content creation platform tailored for your unique needs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${openSans.variable} ${koulen.variable} font-sans bg-background text-accent`}>
        <AuthProvider>
          <WalletProvider>
            <div className="relative z-10">
              {children}
            </div>
          </WalletProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
