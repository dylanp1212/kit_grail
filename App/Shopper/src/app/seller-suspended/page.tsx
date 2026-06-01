import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function SellerSuspendedPage() {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      gap: 2,
      textAlign: 'center',
      px: 3,
    }}>
      <Typography variant='h4' sx={{ color: '#154212', fontWeight: 600 }}>
        Account Suspended
      </Typography>
      <Typography variant='body1' color='text.secondary'>
        Your seller account has been suspended. Please contact support.
      </Typography>
    </Box>
  );
}
