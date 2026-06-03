import * as React from 'react'
import {NextIntlClientProvider} from 'next-intl';
import {CartCountProvider} from '../shoppingcart/CartCountContext'


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
      <NextIntlClientProvider><CartCountProvider><body style={{margin: 0}}>{children}</body></CartCountProvider></NextIntlClientProvider>
    </html>
  )
}
