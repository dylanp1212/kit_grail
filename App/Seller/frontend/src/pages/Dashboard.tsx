import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {DashboardCard} from '../components/DashboardCard';

export const Dashboard = () => {
  return (
    <Box
      sx={{p: 3}}
    >
      <Typography gutterBottom variant='h3'>
        Dashboard
      </Typography>

      <DashboardCard />
    </Box>
  );
};
