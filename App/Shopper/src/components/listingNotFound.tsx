import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';


export default function ListingNotFound () {
  const router = useRouter();
  const t = useTranslations('Common')
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', height: '80vh'}}>
      <Box sx={{width: '100%'}}>
        <Typography sx={{color: '#141413', fontSize: '30px',
          fontWeight: '500'}}>
          {t('listingNotFound')}
        </Typography>
      </Box>
      <Box sx={{borderRadius: '4px', border: '1px solid #5f5e5a',
        padding: '5px', marginTop: '50px'}} onClick={() => { router.push('/listings')}}>
        <Typography sx={{color: '#5f5e5a'}}>
          {t('backToShop')}
        </Typography>
      </Box>
    </Box>
  );
}