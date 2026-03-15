import type { Metadata } from "next";
import Script from "next/script";
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Bhavani Mandap",
    "image": "https://bhavani-mandap.vercel.app/icon.png",
    "description": "Premium Wedding Decoration Services in Gujarat, providing luxurious mandap setups, floral décor, and stage lighting.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "21, Gautam Nagar, Opp. Nirma Factory, Modhera Road",
      "addressLocality": "Mehsana",
      "addressRegion": "Gujarat",
      "postalCode": "384002",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 23.5854,
      "longitude": 71.9421
    },
    "url": "https://bhavani-mandap.vercel.app/",
    "telephone": "+919824520806",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "09:00",
        "closes": "21:00"
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5YKBK6TEZF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-5YKBK6TEZF');
          `}
        </Script>
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
