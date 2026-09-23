import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RSSA Radiology Viewer",
  description:
    "Mobile-first radiology viewer workspace — RSUD Dr. Saiful Anwar (PACS/RIS portal untuk dokter pengirim & keluarga pasien).",
};

export const viewport: Viewport = {
  themeColor: "#07090c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen overflow-hidden bg-background font-sans text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
