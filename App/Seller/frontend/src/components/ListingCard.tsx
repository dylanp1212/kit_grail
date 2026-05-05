// import { Box, Card, Typography } from '@mui/material';
import { Box, Card, CardContent, Typography } from '@mui/material';

import type { MyListing } from '../api/listings';

export const ListingCard = ({listings}: MyListing[]) => {

  return (
    <Box>
        {listings.map((listing) => (
          <Box key={listing.id}>
            <Card>
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
  )
}
