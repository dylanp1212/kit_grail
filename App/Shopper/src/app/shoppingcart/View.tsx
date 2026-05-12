import TopBar from '../../components/TopBar'
import CartList from './CartList'
import {Suspense} from 'react'
import Box from '@mui/material/Box';
import CheckoutButton from './CheckoutButton';

export default function View() {
  return (
    <main>
      <TopBar title={'Shopping Cart'}/>
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
