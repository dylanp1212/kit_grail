import TopBar from '../../components/TopBar'
import CartList from './CartList'
import {Suspense} from 'react'
import Box from '@mui/material/Box';

export default function View() {
  return (
    <main>
      <TopBar />
      <Box sx={{ mt: 2 }}>
      </Box>
      <br />
        <Suspense fallback={<div>Loading...</div>}>
          <CartList />
        </Suspense>
    </main>
  )
}
