'use client';

import {useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {Size} from '../kit_listing';
import {sizeToSymbol} from '../app/listings/helperFuncs';

const sizes: Size[] = ['xsmall', 'small', 'medium', 'large', 'xlarge'];

interface FiltersProps {
  setSizes: (sizes: Size[]) => void;
}

export default function Filters({ setSizes }: FiltersProps) {
  const [selected, setSelected] = useState<Size[]>([]);

  const toggle = (s: Size) => {
    setSelected((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  };

  return (
    <Box>
      <Typography variant='subtitle1' sx={{ pb: 1 }}>Size</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
        {sizes.map((s) => {
          const isSelected = selected.includes(s);
          return (
            <Box
              key={s}
              onClick={() => toggle(s)}
              aria-pressed={isSelected}
              aria-label={sizeToSymbol(s)}
              sx={{
                display: 'flex', border: '2px solid #154212',
                justifyContent: 'center', alignItems: 'center',
                height: '35px', width: '35px', cursor: 'pointer',
                bgcolor: isSelected ? '#154212' : 'transparent',
              }}
            >
              <Typography variant='body1' sx={{ color: isSelected ? 'white' : '#154212' }}>
                {sizeToSymbol(s)}
              </Typography>
            </Box>
          );
        })}
      </Box>
      <Button
        aria-label='apply filters'
        onClick={() => setSizes(selected)}
        variant='contained'
        sx={{ mt: 2, bgcolor: '#154212', '&:hover': { bgcolor: '#0d2b0a' } }}
      >
        Go
      </Button>
    </Box>
  );
}
