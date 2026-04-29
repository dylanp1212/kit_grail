import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export default function ProfileCard() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #c2c9bb' }}>
      <Avatar alt="User Name" src="/static/images/avatar/1.jpg" sx={{ width: 56, height: 56, mr: 2 }} />
      <Box>
        <Typography sx={{ fontFamily: '"Lexend", sans-serif', fontWeight: 600, fontSize: '1rem', color: '#1a1c1a' }}>
          John Doe
        </Typography>
        <Typography sx={{ fontFamily: '"Work Sans", sans-serif', fontSize: '0.75rem', color: '#42493e' }}>
          Product Designer
        </Typography>
      </Box>
    </Box>
  );
}
