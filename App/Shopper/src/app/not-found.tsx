import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import {getTranslations} from 'next-intl/server';
import TopBar from '../components/TopBar'

export default async function Page () {
  const t = await getTranslations('Common')
  return (
    <>
      <TopBar title={'Kit Grail'} />
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center', height: '80vh'}}>
        <Box sx={{width: '100%'}}>
          <Typography sx={{color: '#141413', fontSize: '50px',
            fontWeight: '600'}}>
            404
          </Typography>
          <Typography sx={{color: '#141413', fontSize: '20px',
            fontWeight: '500'}}>
            {t('404')}
          </Typography>
        </Box>
        <Link href='/listings' style={{textDecoration: 'none'}}>
          <Box sx={{borderRadius: '4px', border: '1px solid #5f5e5a',
            padding: '5px', marginTop: '50px'}}>
            <Typography sx={{color: '#5f5e5a'}}>
              {t('backToShop')}
            </Typography>
          </Box>
        </Link>
      </Box>
    </>
  );
}