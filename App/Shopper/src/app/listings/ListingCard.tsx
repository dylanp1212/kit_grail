import { Box, Card, CardContent, Typography } from '@mui/material';
import { KitListing } from '../../kit_listing';

export default function ListingCard({ listing }: { listing: KitListing }) {
  return (
    <Box sx={{
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
  );
}
