import WaveHeader from "@/components/ui/waveHeader"
import { GoogleAnalytics } from "@next/third-parties/google"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from 'sonner'
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "OSDay25 Tech Event Challenge",
  description: "Join the OSDay25 tech event challenge and compete with other attendees",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <title>OSDay25 Tech Event Challenge</title>
        <meta name="description" content="Join the OSDay25 tech event challenge and compete with other attendees. Earn points by completing challenges and redeem them for awards." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:title" content="OSDay25 Tech Event Challenge" />
        <meta property="og:description" content="Join the OSDay25 tech event challenge and compete with other attendees. Earn points by completing challenges and redeem them for awards." />
        <meta property="og:image:width" content="2128" />
        <meta property="og:image:height" content="1666" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="SH" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${inter.variable} antialiased min-h-screen bg-primary`}
      >
        <WaveHeader />
        {children}
        <Toaster />
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
      </body>
    </html>
  )
}