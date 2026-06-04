import TopBar from '../../components/TopBar'
import WishList from './wishList'
import Search from '../listings/search'
import {Suspense} from 'react'
import Box from '@mui/material/Box'

export default function Page() {
  return (
    <main>
      <TopBar title={'Wishlist'} />
      <Box sx={{ maxWidth: { xs: '100%', md: 800 }, mx: 'auto', px: { xs: 2, md: 4 }, mt: 2, mb: 1 }}>
        <Search />
      </Box>
      <Suspense fallback={<div>Loading...</div>}>
        <WishList />
      </Suspense>
    </main>
  )
}
