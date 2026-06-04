'use client'

import { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { getSessionUser } from '../auth/actions'
import { getProfilePicture } from '../profile/actions'
import { SessionUser } from '../auth'
import { useRouter } from 'next/navigation'

export default function ProfileCard() {
  const [user, setUser] = useState<SessionUser | undefined>(undefined)
  const [picture, setPicture] = useState<string | undefined>(undefined)
  const router = useRouter()

  useEffect(() => {
    getSessionUser().then(setUser)
    getProfilePicture().then(setPicture)
  }, [])

  const handleClick = async () => {
    const u = await getSessionUser()
    router.push(u ? '/profile' : '/login')
  }

  return (
    <Box
      onClick={() => { void handleClick() }}
      aria-label="profile card"
      sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #c2c9bb', cursor: 'pointer', '&:hover': { bgcolor: '#eeeeea' } }}
    >
      <Avatar src={picture} alt={user?.name ?? 'User'} sx={{ width: 56, height: 56, mr: 2 }} />
      <Box>
        <Typography sx={{ fontFamily: '"Lexend", sans-serif', fontWeight: 600, fontSize: '1rem', color: '#1a1c1a' }}>
          {user?.name ?? ''}
        </Typography>
        <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontSize: '0.75rem', color: '#42493e' }}>
          {user?.email ?? ''}
        </Typography>
      </Box>
    </Box>
  );
}
