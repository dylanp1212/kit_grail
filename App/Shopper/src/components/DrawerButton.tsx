'use client'

import { useState } from 'react'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import DrawerList from './DrawerList'

export default function DrawerButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButton onClick={() => { setOpen(true); }} sx={{ color: '#1a1c1a' }}
        aria-label={open ? 'close menu' : 'open menu'}>
        <MenuIcon />
      </IconButton>
      <Drawer
        open={open}
        onClose={() => { setOpen(false); }}
        slotProps={{ paper: { sx: { bgcolor: '#f4f4f0', width: 250 } } }}
      >
        <DrawerList />
      </Drawer>
    </>
  )
}
