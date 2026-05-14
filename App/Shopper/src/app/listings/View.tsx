
import TopBar from '../../components/TopBar'
import KitList from './kitList'
import Search from './search'
import {Suspense} from 'react'
import Box from '@mui/material/Box';
import { useTranslations } from 'next-intl';

export default function View() {
  const t = useTranslations('Shop');
  return (
    <main>
      <TopBar title={t('title')}/>
      <Box sx={{mt: 2, px: '10px'}}>
        <Search />
      </Box>
      <br />
        <Suspense fallback={<div>Loading...</div>}>
          <KitList />
        </Suspense>
    </main>
  )
}
