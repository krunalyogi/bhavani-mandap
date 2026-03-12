import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: {
    default: "Bhavani Mandap – Premium Wedding Decoration Services",
    template: "%s | Bhavani Mandap",
  },
  description:
    "Book luxurious mandap setups, floral décor, stage lighting, and complete wedding decoration in India. Premium quality, royal aesthetics.",
  keywords: ["mandap", "wedding decoration", "stage decoration", "floral décor", "Indian wedding", "booking"],
  openGraph: {
    title: "Bhavani Mandap – Premium Wedding Decoration Services",
    description: "Book luxurious mandap setups & wedding decoration across India.",
    type: "website",
    locale: "en_IN",
    siteName: "Bhavani Mandap",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: { background: "#1a0a00", color: "#f0c95a", border: "1px solid #d4a017" },
              }}
            />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
