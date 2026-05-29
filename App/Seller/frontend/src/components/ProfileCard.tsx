import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {useSellerContext} from '../context/SellerContext';

export const ProfileCard = () => {
  const user = useSellerContext();
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      p: 2,
      borderBottom: '1px solid #1e5a19',
    }}>
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
