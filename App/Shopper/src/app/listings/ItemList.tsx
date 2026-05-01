import { Box, Card, CardContent, Typography } from '@mui/material';
import {getAllListings} from './actions';

export default async function ItemList() {
  const listings = await getAllListings();
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 2,
        p: 2,
      }}
    >
      {listings.map((listing, index) => (
        <Box key={index} sx={{
          width: { xs: 'calc(50% - 16px)',
            sm: 'calc(33.33% - 16px)',
            md: 'calc(25% - 16px)',
            lg: 'calc(25% - 16px)'
          }
        }}>
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {listing.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {listing.description}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
}
