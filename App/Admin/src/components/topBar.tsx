'use client';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { signOut } from '../auth/actions';

export default function TopBar ({title}: {title: string}) {
  const router = useRouter();

  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="fixed" color="transparent" sx={{bgcolor: '#F2E8D5', boxShadow: 'none', borderBottom: '1px solid #c2c9bb'}}>
        <Toolbar>
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <Typography variant="h5" component="div"
                sx={{flexGrow: 1, fontFamily: '"Lexend", sans-serif', fontWeight: 600, letterSpacing: '-0.01em', color: '#154212'}}>
                {title}
              </Typography>
              <Button onClick={() => {router.push('/')}}
                variant='outlined' sx={{color: '#154212', borderColor: '#154212', textTransform: 'none',
                '&:hover': { bgcolor: '#f0ebe0', borderColor: '#154212' }, ml: '50px'}}>
                Dashboard
              </Button>
            </Box>
            <Button
              onClick={() => {void signOut()}}
              variant='outlined'
              sx={{color: '#154212', borderColor: '#154212', textTransform: 'none',
                '&:hover': { bgcolor: '#f0ebe0', borderColor: '#154212' }}}>
              Log out
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  );
}
