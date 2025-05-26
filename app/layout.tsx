import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HTTPie Collection Viewer',
  description: 'View HTTPie collections',
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
