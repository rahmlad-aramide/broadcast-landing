import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "../context/ThemeContext";
import "./globals.css";
import "./landing.css";
import "./modal.css";

export const viewport: Viewport = {
  themeColor: "#25D366",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://broadcast.com.ng"),
  title: {
    default: "Broadcast - WhatsApp Bulk Messaging Platform | Send Messages at Scale",
    template: "%s | Broadcast",
  },
  description:
    "Broadcast is a powerful WhatsApp bulk messaging platform built on Meta's Official API. Send personalized messages, invoices, and documents to thousands of contacts with no markup fees. Perfect for businesses, schools, and organizations.",
  keywords: [
    "WhatsApp bulk messaging",
    "WhatsApp broadcast",
    "bulk SMS",
    "WhatsApp API",
    "message management",
    "contact management",
    "WhatsApp marketing",
    "enterprise messaging",
    "customer engagement",
    "Nigeria",
  ],
  applicationName: "Broadcast",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Broadcast",
  },
  openGraph: {
    type: "website",
    url: "https://broadcast.com.ng/",
    title: "Broadcast - WhatsApp Bulk Messaging Platform",
    description:
      "Send personalized WhatsApp messages to thousands at scale. No markup fees. Built on Meta's Official WhatsApp Business API.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Broadcast WhatsApp Messaging Dashboard",
      },
    ],
    siteName: "Broadcast",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Broadcast - WhatsApp Bulk Messaging Platform",
    description:
      "Send personalized WhatsApp messages to thousands at scale. No markup fees. Built on Meta's Official WhatsApp Business API.",
    images: ["/og-image.png"],
    creator: "@Dev_Rahmlad",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://broadcast.com.ng/",
    languages: { en: "https://broadcast.com.ng/" },
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Broadcast",
    description: "WhatsApp bulk messaging platform for businesses and organizations",
    url: "https://broadcast.com.ng",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "15000",
      priceCurrency: "NGN",
      description: "Starting from ₦15,000/month",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "250",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Broadcast",
    url: "https://broadcast.com.ng",
    logo: "https://broadcast.com.ng/favicon.png",
    description: "Professional WhatsApp bulk messaging platform",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@broadcast.com.ng",
    },
    sameAs: ["https://twitter.com/BroadcastApp", "https://linkedin.com/company/broadcast-messaging"],
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme before React mounts/hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
        {jsonLd.map((data, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
        ))}
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
