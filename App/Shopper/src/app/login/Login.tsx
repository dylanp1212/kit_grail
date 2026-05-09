'use client'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import Image from 'next/image';
import { styled } from '@mui/material/styles';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
}));

export default function Login() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100vw', p: 2 }}>
      <Card variant="outlined">
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Image src="/KG_logo.svg" alt="Kit Grail" width={64} height={64} />
        </Box>
        <Typography
          component="h1"
          sx={{
            fontFamily: '"Lexend", sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.75rem, 8vw, 2rem)',
            color: '#1a1c1a',
            textAlign: 'center',
          }}
        >
          Sign in
        </Typography>
        <Typography sx={{ fontFamily: '"Work Sans", sans-serif', color: '#42493e', fontSize: '0.9375rem', textAlign: 'center' }}>
          Sign in to your Kit Grail account to save wishlists, track orders, and check out faster.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            fullWidth
            variant="contained"
            href="/api/auth/start/google"
            sx={{
              height: '56px',
              bgcolor: '#154212',
              color: '#ffffff',
              fontFamily: '"Work Sans", sans-serif',
              fontSize: '1rem',
              textTransform: 'none',
              borderRadius: '8px',
              '&:hover': { bgcolor: '#23501e' },
            }}
          >
            Sign in with Google
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
