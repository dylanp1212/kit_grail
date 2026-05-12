'use client'

import { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { getSessionUser } from '../auth/actions'
import { SessionUser } from '../auth'

export default function ProfileCard() {
  const [user, setUser] = useState<SessionUser | undefined>(undefined)

  useEffect(() => {
    getSessionUser().then(setUser)
  }, [])

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #c2c9bb' }}>
      <Avatar alt={user?.name ?? 'User'} sx={{ width: 56, height: 56, mr: 2 }} />
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
