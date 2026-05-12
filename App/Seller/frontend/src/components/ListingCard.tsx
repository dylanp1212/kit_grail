// import { Box, Card, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';

import type {MyListing} from '../api/listings';

export const ListingCard = ({listings}: {listings: MyListing[]}) => {
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
              md: 'calc(45% - 16px)',
              lg: 'calc(50% - 16px)',
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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
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
              </Box>
              <Divider />
              <Typography variant='overline'>
                Stock: 0
              </Typography>
              <Divider />
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
};
