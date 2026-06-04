'use client';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import {useState, type KeyboardEvent} from 'react';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';

export default function Search() {
  const t = useTranslations('Shop')
  const [search, setSearch] = useState('');
  const router = useRouter();
  const handleSearch = () => {
    router.push(`?search=${encodeURIComponent(search.trim())}`);
  };
  // need to specify type HTMLInputElement (there was a lint error)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      handleSearch();
    }
  };
  const handleClear = () => {
    setSearch('');
    router.push(`?search=`);
  };
  return (
    <Box sx={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
      <TextField
        value={search}
        onChange={(e) => { setSearch(e.target.value); }}
        onKeyDown={handleKeyDown}
        placeholder={t('searchPlaceholder')}
        size='small' sx={{width: '100%', bgcolor: '#ffffff', borderRadius: '4px'}}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                {search && (
                  <IconButton aria-label={t('clearSearch')} onClick={handleClear} size='small'>
                    <ClearIcon fontSize='small' />
                  </IconButton>
                )}
                <IconButton aria-label={t('search')} onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
          htmlInput: {
            maxLength: 100,
          },
        }}
      />
    </Box>
  );
}