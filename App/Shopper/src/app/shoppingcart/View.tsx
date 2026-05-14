import TopBar from '../../components/TopBar'
import CartList from './CartList'
import {Suspense} from 'react'
import Box from '@mui/material/Box';
import CheckoutButton from './CheckoutButton';
import {getTranslations} from 'next-intl/server'

export default async function View() {
  const t = await getTranslations('ShoppingCart')
  return (
    <main>
      <TopBar title={t('title')}/>
      <Box sx={{ mt: 2 }}>
      </Box>
      <br />
        <Suspense fallback={<div>Loading...</div>}>
          <CartList />
        </Suspense>
        <CheckoutButton />

    </main>
  )
}
