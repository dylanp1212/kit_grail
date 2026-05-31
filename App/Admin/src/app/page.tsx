import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { signOut } from '../auth/actions';

export default function Home() {
  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant='h5' sx={{ color: '#154212', fontWeight: 600 }}>
        Admin Portal
      </Typography>
      <form action={signOut}>
        <Button
          type='submit'
          variant='outlined'
          sx={{
            color: '#154212',
            borderColor: '#154212',
            textTransform: 'none',
            '&:hover': { bgcolor: '#f0ebe0', borderColor: '#154212' },
          }}
        >
          Log out
        </Button>
      </form>
    </Box>
  );
}
