import * as React from 'react'

export const metadata = {
  title: 'ShopPage Spike',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
