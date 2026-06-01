import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import TopBar from '../components/topBar'

export default function Home() {
  return (
    <Box>
      <TopBar title='Kit Grail Admin Portal' />
      <Box sx={{ p: 3 }}>
        <Typography variant='h5' sx={{ color: '#154212', fontWeight: 600, mb: 3 }}>
          Dashboard
        </Typography>
        <Link href='/sellers' style={{ textDecoration: 'none' }}>
          <Box sx={{
            display: 'inline-block', border: '1px solid #154212',
            borderRadius: '4px', px: 3, py: 1.5, cursor: 'pointer',
            '&:hover': { bgcolor: '#f0ebe0' },
          }}>
            <Typography sx={{ color: '#154212', fontWeight: 600 }}>
              Manage Sellers
            </Typography>
          </Box>
        </Link>
      </Box>
    </Box>
  );
}
