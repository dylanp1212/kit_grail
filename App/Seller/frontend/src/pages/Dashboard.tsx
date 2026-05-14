import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {DashboardCard} from '../components/DashboardCard';
import {ListingsOverview} from '../components/ListingsOverview';

export const Dashboard = () => {
  return (
    <Box
      sx={{p: 3}}
    >
      <Typography gutterBottom variant='h3' sx={{p: 3}}>
        Dashboard
      </Typography>

      <DashboardCard />

      <ListingsOverview />
    </Box>
  );
};
