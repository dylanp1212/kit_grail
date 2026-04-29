import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

export default function SignoutButton() {
  return (
    <Button
      variant="contained"
      endIcon={<LogoutIcon />}
      sx={{
        bgcolor: '#885035',
        color: '#ffffff',
        fontFamily: '"Work Sans", sans-serif',
        fontWeight: 600,
        borderRadius: '4px',
        textTransform: 'none',
        '&:hover': { bgcolor: '#6b3a20' },
      }}
    >
      Sign Out
    </Button>
  );
}
