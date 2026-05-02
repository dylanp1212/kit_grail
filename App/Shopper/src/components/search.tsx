'use client';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function Search() {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && search.trim()) {
      router.push(`?search=${encodeURIComponent(search.trim())}`);
    }
  };
  return (
    <Box sx={{width: '100%'}}>
      <TextField
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='What are you looking for?'
        size='small' sx={{width: '100%'}}
      />
    </Box>
  );
}