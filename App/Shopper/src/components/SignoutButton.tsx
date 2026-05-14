'use client'
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import {useRouter} from 'next/navigation';
import {signOut, getSessionUser} from '../auth/actions';
import {useTranslations} from 'next-intl';
import { useEffect, useState } from 'react'


export default function SignoutButton() {
  const router = useRouter();
  const t = useTranslations('Auth');
  const [user, setUser] = useState<SessionUser | undefined>(undefined)
  useEffect(() => {
    getSessionUser().then(setUser)
  }, [])
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
        bgcolor: '#154212',
        color: '#ffffff',
        fontFamily: '"Work Sans", sans-serif',
        fontWeight: 600,
        borderRadius: '4px',
        textTransform: 'none',
        '&:hover': { bgcolor: '#6b3a20' },
      }}
    >
      {user ? t('signOut') : t('signIn')}
    </Button>
  );
}
