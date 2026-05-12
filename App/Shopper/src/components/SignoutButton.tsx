'use client'
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import {useRouter} from 'next/navigation';
import {signOut} from '../auth/actions';

export default function SignoutButton() {
  const router = useRouter();
  const handleClick = () => {
    const doSignOut = async (): Promise<void> => {
      await signOut();
      router.push('/login');
    }
    void doSignOut();
  }
  return (
    <Button
      variant="contained"
      endIcon={<LogoutIcon />}
      onClick={handleClick}
      sx={{
        bgcolor: '#885035',
        color: '#ffffff',
        fontFamily: '"Work Sans", sans-serif',
        fontWeight: 600,
        borderRadius: '4px',
        textTransform: 'none',
        '&:hover': { bgcolor: '#6b3a20' },
      }}
    >
      Sign Out
    </Button>
  );
}
