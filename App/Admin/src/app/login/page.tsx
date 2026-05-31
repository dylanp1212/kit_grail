'use client';

import { useState, type SyntheticEvent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { loginAdmin } from '../../auth/actions';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const err = await loginAdmin(email, password);
    if (err) setError(err);
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      bgcolor: '#f5f5f5',
    }}>
      <Card sx={{ minWidth: 360, p: 2 }}>
        <CardContent sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}>
          <Typography variant='h4' sx={{ color: '#154212', fontWeight: 'bold' }}>
            Kit Grail
          </Typography>
          <Typography variant='h6' color='text.secondary'>
            Admin Portal
          </Typography>
          <Box component='form' onSubmit={handleSubmit} sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
          }}>
            <TextField
              label='Email'
              type='email'
              value={email}
              onChange={(e) => { setEmail(e.target.value); }}
              fullWidth
              required
            />
            <TextField
              label='Password'
              type='password'
              value={password}
              onChange={(e) => { setPassword(e.target.value); }}
              fullWidth
              required
            />
            <Button
              type='submit'
              variant='contained'
              sx={{
                'bgcolor': '#154212',
                '&:hover': { bgcolor: '#1e5c1a' },
                'textTransform': 'none',
                'py': 1.5,
              }}
            >
              Sign In
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => { setError(undefined); }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity='error' onClose={() => { setError(undefined); }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
