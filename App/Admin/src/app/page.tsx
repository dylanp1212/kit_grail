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
        <Box sx={{width: '250px'}}>
          <Link href='/sellers' style={{ textDecoration: 'none' }}>
            <Box sx={{ mb: '20px',
              border: '1px solid #154212',
              borderRadius: '4px', px: 3, py: 1.5, cursor: 'pointer',
              '&:hover': { bgcolor: '#f0ebe0' },
            }}>
              <Typography sx={{color: '#154212', fontWeight: 600, textAlign: 'center'}}>
                Manage Sellers
              </Typography>
            </Box>
          </Link>
          <Link href='/orders' style={{textDecoration: 'none'}}>
            <Box sx={{border: '1px solid #154212',
              borderRadius: '4px', px: 3, py: 1.5, cursor: 'pointer',
              '&:hover': {bgcolor: '#f0ebe0'}}}>
              <Typography sx={{color: '#154212', fontWeight: 600, textAlign: 'center'}}>
                View Orders
              </Typography>
            </Box>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
