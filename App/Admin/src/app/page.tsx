import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TopBar from '../components/topBar'

export default function Home() {
  return (
    <Box>
      <TopBar title='Kit Grail Admin Portal' />
      <Box sx={{ p: 3 }}>
        <Typography variant='h5' sx={{ color: '#154212', fontWeight: 600 }}>
          Dashboard
        </Typography>
      </Box>
    </Box>
  );
}
