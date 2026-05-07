// import { Box, Card, Typography } from '@mui/material';
import {Box, Card, CardContent, Typography, CardMedia} from '@mui/material';

import type {MyListing} from '../api/listings';

export const ListingCard = ({listings}: MyListing[]) => {
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
      {listings.map((listing) => (
        <Box
          key={listing.id}
          sx={{
            width: {xs: 'calc(50% - 16px)',
              sm: 'calc(33.33% - 16px)',
              md: 'calc(25% - 16px)',
              lg: 'calc(25% - 16px)',
            },
          }}
        >
          <Card sx={{
            'height': '100%',
            'display': 'flex',
            'flexDirection': 'column',
            'transition': 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'scale(1.03)',
              boxShadow: 6,
              cursor: 'pointer',
            },
          }}>
            <CardMedia
              sx={{height: 200}}
              image={listing.image}
              title={listing.title}
            />
            <CardContent sx={{flexGrow: 1}}>
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{
                  overflow: 'hidden',
                  minHeight: '3.6em',
                }}
              >
                {listing.title}
              </Typography>
              <Typography
                variant='overline'
                gutterBottom
                sx={{display: 'block'}}
              >
                  ${listing.price}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
};
