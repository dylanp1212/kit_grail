import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {useSellerContext} from '../context/SellerContext';
import {useNavigate} from 'react-router-dom';

export const ProfileCard = () => {
  const user = useSellerContext();
  const navigate = useNavigate();
  return (
    <Box
      onClick={() => {
        navigate('/profile');
      }}
      aria-label="profile card"
      sx={{
        'display': 'flex',
        'alignItems': 'center',
        'p': 2,
        'borderBottom': '1px solid #1e5a19',
        'cursor': 'pointer',
        '&:hover': {bgcolor: '#1e5a19'},
      }}
    >
      <Avatar
        alt={user?.name ?? 'User'}
        sx={{width: 48, height: 48, mr: 2}}
      />
      <Box>
        <Typography sx={{
          fontFamily: '"Lexend", sans-serif',
          fontWeight: 600,
          fontSize: '1rem',
          color: '#eeebe5',
        }}>
          {user?.name ?? ''}
        </Typography>
        <Typography sx={{
          fontFamily: '"Work Sans", sans-serif',
          fontSize: '0.75rem',
          color: '#a8c0a0',
        }}>
          {user?.email ?? ''}
        </Typography>
      </Box>
    </Box>
  );
};
