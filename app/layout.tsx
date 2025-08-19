import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Flashdrop Market - Plateforme de Deals Flash pour Professionnels | Mali",
  description:
    "Flashdrop Market (FDM) - Offres flash quotidiennes sur produits tech, mode et maison pour professionnels au Mali. Jusqu'à 70% de réduction. Quantités limitées.",
  keywords:
    "Flashdrop Market, FDM, deals professionnels Mali, offres flash Bamako, grossiste tech Mali, prix imbattables, revente produits, plateforme pro Mali, achats en gros",
  authors: [{ name: "Flashdrop Market" }],
  creator: "Flashdrop Market",
  publisher: "Flashdrop Market",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://flashdrop.vercel.app",
    title: "Flashdrop Market - Les meilleurs deals pour professionnels",
    description:
      "Plateforme de deals flash réservée aux professionnels au Mali. Tech, mode, maison à prix imbattables.",
    siteName: "Flashdrop Market",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Flashdrop Market - Deals pour professionnels",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flashdrop Market - Deals Professionnels",
    description: "Offres flash quotidiennes pour professionnels au Mali",
    images: ["/og-image.jpg"],
    creator: "@flashdropmali",
  },
  verification: {
    google: "votre-code-google",
  },
  alternates: {
    canonical: "https://flashdrop.vercel.app",
  },
  metadataBase: new URL("https://flashdrop.vercel.app"),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="geo.region" content="ML" />
        <meta name="geo.placename" content="Bamako" />
        <meta name="geo.position" content="12.6392;-8.0029" />
        <meta name="ICBM" content="12.6392, -8.0029" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Flashdrop Market",
              url: "https://flashdrop.vercel.app",
              logo: "https://flashdrop.vercel.app/logo.png",
              description: "Plateforme de deals flash pour professionnels au Mali",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Bamako",
                addressCountry: "ML",
              },
              telephone: "+22383000099",
              foundingDate: "2024",
              sameAs: [
                "https://facebook.com/flashdropmarket",
                "https://linkedin.com/company/flashdropmarket"
              ],
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: "https://flashdrop.vercel.app",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://flashdrop.vercel.app/boutique?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="light" 
            enableSystem 
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}