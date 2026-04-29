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
      <IconButton onClick={() => setOpen(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <DrawerList />
      </Drawer>
    </>
  )
}
