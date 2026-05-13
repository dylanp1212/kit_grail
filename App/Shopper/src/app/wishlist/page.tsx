import TopBar from '../../components/TopBar'
import WishList from './wishList'
import Search from '../listings/search'
import {Suspense} from 'react'
import Box from '@mui/material/Box';

export default function Page() {
  return (
    <main>
      <TopBar title={'Wishlist'} />
      <Box sx={{mt: 2, px: '10px'}}>
        <Search />
      </Box>
      <br />
        <Suspense fallback={<div>Loading...</div>}>
          <WishList />
        </Suspense>
    </main>
  )
}
