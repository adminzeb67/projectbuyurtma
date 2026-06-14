import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { AuthView } from "@/components/AuthView";
import { SplashScreen } from "@/components/SplashScreen";
import { LayoutWrapper } from "@/components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "F.Lavash - Yetkazib Berish",
  description: "O'zbekiston bo'ylab ovqat, ichimlik va fastfud yetkazib berish xizmati",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "F.Lavash",
  },
  formatDetection: {
    telephone: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  const isAuthenticated = !!sessionToken;

  return (
    <html
      lang="uz"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ background: "#09090b" }}
    >
      <body className="min-h-full flex" style={{ background: "#09090b", color: "#fafafa" }}>
        <SplashScreen>
          {!isAuthenticated ? (
            <div className="w-full">
              <AuthView />
            </div>
          ) : (
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
          )}
        </SplashScreen>
      </body>
    </html>
  );
}
