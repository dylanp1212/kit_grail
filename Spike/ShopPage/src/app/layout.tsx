import * as React from 'react'

export const metadata = { title: 'ShopPage Spike' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@600;700&family=Work+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, backgroundColor: '#faf9f6', fontFamily: '"Work Sans", sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
