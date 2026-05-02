
import TopBar from '../../components/TopBar'
import KitList from './kitList'
import Search from './search'
import {Suspense} from 'react'
import Box from '@mui/material/Box';

export default function View() {
  return (
    <main>
      <TopBar />
      <Box sx={{ mt: 2 }}>
        <Search />
      </Box>
      <br />
        <Suspense fallback={<div>Loading...</div>}>
          <KitList />
        </Suspense>
    </main>
  )
}
