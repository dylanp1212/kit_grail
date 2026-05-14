import Box from '@mui/material/Box';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import Paid from '@mui/icons-material/Paid';
import Inventory from '@mui/icons-material/Inventory';
import PendingActions from '@mui/icons-material/PendingActions';


export const DashboardCard = () => {
  const minHeight = 250;
  const cardContentSX = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  };
  const cardSX = {
    flex: 1,
    minHeight: minHeight,
    display: 'flex',
    alignItems: 'center',
    pl: 2,
  };
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        p: 3,
      }}
    >
      <Card sx={cardSX} aria-label='total sales'>
        <CardContent sx={cardContentSX}>
          <Paid sx={{fontSize: 40}}/>
          <Typography variant='subtitle2'>TOTAL SALES</Typography>
          <Typography gutterBottom variant='h3'>$0</Typography>
        </CardContent>
      </Card>

      <Card sx={cardSX} aria-label='active listings'>
        <CardContent sx={cardContentSX}>
          <Inventory sx={{fontSize: 40}}/>
          <Typography variant='subtitle2'>ACTIVE LISTINGS</Typography>
          <Typography gutterBottom variant='h3'>0</Typography>
        </CardContent>
      </Card>

      <Card sx={cardSX} aria-label='pending orders'>
        <CardContent sx={cardContentSX}>
          <PendingActions sx={{fontSize: 40}}/>
          <Typography variant='subtitle2'>PENDING ORDERS</Typography>
          <Typography gutterBottom variant='h3'>0</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
