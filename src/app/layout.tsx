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
      <body className="min-h-full flex" style={{ background: "#0f0f12", color: "#fafafa" }}>
        {/* Animated background orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
          <div className="bg-orb-1 absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }} />
          <div className="bg-orb-2 absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle, #ea580c 0%, transparent 70%)" }} />
          <div className="bg-orb-3 absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)" }} />
        </div>
        <SplashScreen>
          {!isAuthenticated ? (
            <div className="w-full relative z-10">
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
