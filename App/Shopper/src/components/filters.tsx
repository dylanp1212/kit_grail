'use client';

import {useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {Size} from '../kit_listing';
import {sizeToSymbol} from '../app/listings/helperFuncs';

const sizes: Size[] = ['xsmall', 'small', 'medium', 'large', 'xlarge'];
const colorlist = ['red', 'orange', 'yellow', 'green', 'blue', 'navy',
  'purple', 'pink', 'black', 'white', 'grey', 'brown', 'gold', 'silver'];

interface FiltersProps {
  setSizes: (sizes: Size[]) => void;
  setColors: (colors: string[]) => void;
}

export default function Filters({setSizes, setColors}: FiltersProps) {
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const toggleSize = (s: Size) => {
    setSelectedSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  };

  const toggleColor = (c: string) => {
    setSelectedColors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  };

  const handleApply = () => {
    setSizes(selectedSizes);
    setColors(selectedColors);
  };

  const handleClear = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSizes([]);
    setColors([]);
  };

  return (
    <Box sx ={{pb: '10px'}}>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Typography variant='h6' sx={{pr: '20px'}}>
          Filtering
        </Typography>
        <Box sx={{display: 'flex', gap: 1}}>
          <Button
            aria-label='clear filters'
            onClick={handleClear}
            variant='outlined'
            sx={{mt: 2, color: '#154212', borderColor: '#154212', '&:hover': {bgcolor: '#f0ebe0', borderColor: '#154212'}}}
          >
            Clear
          </Button>
          <Button
            aria-label='apply filters'
            onClick={handleApply}
            variant='contained'
            sx={{mt: 2, bgcolor: '#154212', '&:hover': {bgcolor: '#0d2b0a'}}}
          >
            Go
          </Button>
        </Box>
      </Box>
      <Typography variant='subtitle1' sx={{pb: 1}}>Size</Typography>
      <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 1}}>
        {sizes.map((s) => {
          const isSelected = selectedSizes.includes(s);
          return (
            <Box
              key={s}
              onClick={() => toggleSize(s)}
              aria-pressed={isSelected}
              aria-label={sizeToSymbol(s)}
              sx={{
                display: 'flex', border: '2px solid #154212',
                justifyContent: 'center', alignItems: 'center',
                height: '35px', width: '35px', cursor: 'pointer',
                bgcolor: isSelected ? '#154212' : 'transparent',
              }}
            >
              <Typography variant='body1' sx={{color: isSelected ? 'white' : '#154212'}}>
                {sizeToSymbol(s)}
              </Typography>
            </Box>
          );
        })}
      </Box>
      <Typography variant='subtitle1' sx={{pt: 2, pb: 1}}>Colors</Typography>
      <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5}}>
        {colorlist.map((c) => {
          const isSelected = selectedColors.includes(c);
          return (
            <Box
              key={c}
              onClick={() => toggleColor(c)}
              aria-pressed={isSelected}
              aria-label={c}
              sx={{
                display: 'flex', border: '2px solid #154212',
                justifyContent: 'center', alignItems: 'center',
                height: '28px', width: '28px', cursor: 'pointer',
                bgcolor: c, backgroundClip: 'padding-box',
              }}
            >
              {isSelected && (
                <Typography variant='body2' sx={{
                  fontWeight: 'bold', lineHeight: 1,
                  color: 'white', textShadow: '0 0 3px black',
                }}>
                  {'✔'}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
