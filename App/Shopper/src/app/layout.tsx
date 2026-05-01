import * as React from 'react'

export const metadata = {
  title: 'Kit Grail',
  icons: {
    icon: [
      {url: '/KG_logo.svg'},
    ]
  },
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
