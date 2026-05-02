'use client'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const sizes = ['S', 'M', 'L', 'XL']

export default function SelectSize() {
  const [selected, setSelected] = useState('M')
  return (
    <Box>
      <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: '#1a1c1a', textTransform: 'uppercase', mb: 1.5 }}>
        Select Size
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5 }}>
        {sizes.map((size) => (
          <Button
            key={size}
            onClick={() => { setSelected(size); }}
            variant="outlined"
            sx={{
              height: '48px',
              fontFamily: '"Work Sans", sans-serif',
              fontSize: '16px',
              textTransform: 'none',
              borderRadius: '8px',
              borderColor: selected === size ? '#154212' : '#c2c9bb',
              bgcolor: selected === size ? '#154212' : 'transparent',
              color: selected === size ? '#ffffff' : '#1a1c1a',
              '&:hover': { borderColor: '#154212', bgcolor: selected === size ? '#154212' : 'transparent' },
            }}
          >
            {size}
          </Button>
        ))}
      </Box>
    </Box>
  )
}
