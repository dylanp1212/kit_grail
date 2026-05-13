'use client'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import {useRouter} from 'next/navigation';


function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#FBBC04" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
      <path fill="#EA4335" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
      <path fill="#34A853" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
      <path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
  )
}

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  boxSizing: 'border-box',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
}));

export default function Login({ returnTo }: { returnTo?: string } = {}) {
  const startUrl = returnTo
    ? `/api/auth/start/google?returnTo=${encodeURIComponent(returnTo)}`
    : '/api/auth/start/google'
  const router = useRouter();
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', boxSizing: 'border-box', overflowX: 'hidden', overflowY: 'auto', p: 2, flexDirection: 'column' }}>
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
            href={startUrl}
            startIcon={<GoogleLogo />}
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
            Sign In With Google
          </Button>
        </Box>
      </Card>
      <Box sx={{pt: '10px'}} onClick={() => {router.push('/listings')}}>
        <Typography>
          Back to shop
        </Typography>
      </Box>
    </Box>
  );
}
