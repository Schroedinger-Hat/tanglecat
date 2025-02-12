import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from 'sonner'
import WaveHeader from "@/components/ui/waveHeader"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Tech Event Challenge",
  description: "Join the tech event challenge and compete with other attendees",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased min-h-screen`}
      >
        <WaveHeader />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
