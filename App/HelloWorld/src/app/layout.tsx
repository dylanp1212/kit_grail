import * as React from 'react'

export const metadata = {
  title: 'CSE187 Assignment 3',
  icons: {
    icon: [
      { url: '/favicon.ico' },
    ]
  }
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
