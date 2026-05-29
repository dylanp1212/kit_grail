import {useState, FormEvent} from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useSellerContext} from '../context/SellerContext';

export const ChangeProfile = () => {
  const user = useSellerContext();
  const [url, setUrl] = useState('');
  const [preview, setPreview] = useState('');

  /**
   *
   * @param e
   */
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPreview(url);
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
    }}>
      <Avatar
        src={preview || undefined}
        alt={user?.name ?? 'User'}
        sx={{width: 96, height: 96, border: '3px solid #c2c9bb'}}
      />
      <Box sx={{textAlign: 'center'}}>
        <Typography sx={{
          fontFamily: '"Lexend", sans-serif',
          fontWeight: 600,
          fontSize: '1.25rem',
          color: '#1a1c1a',
        }}>
          {user?.name ?? ''}
        </Typography>
        <Typography sx={{
          fontFamily: '"Work Sans", sans-serif',
          fontSize: '0.85rem',
          color: '#42493e',
        }}>
          {user?.email ?? ''}
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          mt: 1,
        }}
      >
        <Typography sx={{
          fontFamily: '"Work Sans", sans-serif',
          fontWeight: 600,
          fontSize: '0.9rem',
          color: '#1a1c1a',
        }}>
          Change Profile Picture
        </Typography>
        <TextField
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste image URL here"
          size="small"
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              'fontFamily': '"Work Sans", sans-serif',
              'borderRadius': '4px',
              '& fieldset': {borderColor: '#c2c9bb'},
              '&:hover fieldset': {borderColor: '#42493e'},
              '&.Mui-focused fieldset': {borderColor: '#154212'},
            },
          }}
        />
        <Button
          type="submit"
          variant="outlined"
          sx={{
            'borderColor': '#154212',
            'color': '#154212',
            'fontFamily': '"Work Sans", sans-serif',
            'fontWeight': 600,
            'textTransform': 'none',
            'borderRadius': '4px',
            '&:hover': {bgcolor: '#f0ebe0', borderColor: '#154212'},
          }}
        >
          Update Picture
        </Button>
      </Box>
    </Box>
  );
};
