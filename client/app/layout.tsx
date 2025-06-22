import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Agro Guide',
  description: 'Created with saraz',
  generator: 'saraz.in',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
