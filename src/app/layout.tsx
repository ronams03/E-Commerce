import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GlassAdmin - E-commerce Admin Panel",
  description: "Modern glass morphism e-commerce admin panel with stunning UI",
  keywords: ["Admin Panel", "E-commerce", "Glass Morphism", "Next.js", "TypeScript", "Tailwind CSS"],
  authors: [{ name: "GlassAdmin Team" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Hide Next.js development indicator */
              [data-nextjs-dialog], [data-nextjs-toast], [data-nextjs-banner],
              nextjs-portal, [class*="nextjs-"], [data-nextjs-scroll-focus-boundary] {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
