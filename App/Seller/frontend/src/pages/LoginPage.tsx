import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import GoogleIcon from '@mui/icons-material/Google';

export const LoginPage = () => {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      bgcolor: '#f5f5f5',
    }}>
      <Card sx={{minWidth: 360, p: 2}}>
        <CardContent sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}>
          <Typography variant='h4' sx={{color: '#154212', fontWeight: 'bold'}}>
            Kit Grail
          </Typography>
          <Typography variant='h6' color='text.secondary'>
            Seller Portal
          </Typography>
          <Typography variant='body2' color='text.secondary'
            sx={{textAlign: 'center'}}>
            Sign in with your Google account to manage your listings.
          </Typography>
          <Button
            component='a'
            href='/api/v0/auth/start/google'
            variant='contained'
            startIcon={<GoogleIcon />}
            sx={{
              'bgcolor': '#154212',
              '&:hover': {bgcolor: '#1e5c1a'},
              'textTransform': 'none',
              'px': 3,
              'py': 1.5,
              'width': '100%',
            }}
          >
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};
