import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { FloatingMedicalElements } from "@/components/floating-medical-elements"
import { PoppingAnimations } from "@/components/popping-animations"
import { HealthLogo } from "@/components/health-logo"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "HealthConnect - Healthcare Management System",
  description: "Connect with nearby clinics and monitor your health",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
        <head>
        {/* ✅ Move Leaflet CSS and JS here */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        {/* ⚠️ Best practice is to NOT include JS here — use NPM instead */}
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <FloatingMedicalElements />
          <PoppingAnimations />
          <HealthLogo />
          {children} 
        </ThemeProvider>
      </body>
    </html>
  )
}
