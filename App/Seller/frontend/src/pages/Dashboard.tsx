import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {DashboardCard} from '../components/DashboardCard';
import {useTranslation} from 'react-i18next';
import {ListingsOverview} from '../components/ListingsOverview';

export const Dashboard = () => {
  const {t} = useTranslation();
  return (
    <Box
      sx={{p: 3}}
    >
      <Typography gutterBottom variant='h3' sx={{p: 3}}>
        {t('dashboard')}
      </Typography>

      <DashboardCard />

      <ListingsOverview />
    </Box>
  );
};
