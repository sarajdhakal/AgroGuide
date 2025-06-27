import type React from "react"
import type { Metadata } from "next"
import { AuthProvider } from "@/components/AuthProvider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Agro Guide",
  description: "Created with saraz",
  generator: "saraz.in",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
