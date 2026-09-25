import type { Metadata } from "next";
import { inter, playfair } from "@/lib/fonts";
import ThemeProvider from "@/components/ThemeProvider";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin | Fehintola Onabanjo",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
