// import { Box, Card, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';

import type {MyListing} from '../api/listings';
import {useNavigate} from 'react-router-dom';

export const ListingCard = ({listings}: {listings: MyListing[]}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 2,
        p: 3,
      }}
    >
      {listings.map((listing) => (
        <Box
          key={listing.id}
          sx={{
            width: {
              xs: 'calc(50%)',
              sm: 'calc(33.33%)',
              md: 'calc(25%)',
              lg: 'calc(30%)',
            },
          }}
        >
          <Card
            sx={{
              'height': '100%',
              'display': 'flex',
              'flexDirection': 'column',
              'transition': 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: 6,
                cursor: 'pointer',
              },
            }}
            onClick={() => navigate(`/inventory/${listing.id}`)}
            // aria-label={}
          >
            <CardMedia
              sx={{height: 300}}
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
