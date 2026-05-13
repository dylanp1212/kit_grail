import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import {getListing, type MyListing} from '../api/listings';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

export const ListingPage = () => {
  const {id} = useParams<{ id: string }>();
  const [listing, setListing] = useState<MyListing | null>(null);
  const [loading, setLoading] = useState(!!id);
  const missingId = id ? null : 'Missing listing id';
  const [error, setError] = useState<string | null>(missingId);

  const stackSX = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  useEffect(() => {
    if (!id) return;

    getListing(id)
        .then((data) => setListing(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
  }, [id]);

  if (!listing) return null;

  return (
    <Box
      sx={{
        p: 3,
      }}
    >
      {loading && (
        <Typography sx={{textAlign: 'center'}}>Loading...</Typography>
      )}

      {error && (
        <Typography color="error" sx={{textAlign: 'center'}}>
          Error: {error}
        </Typography>
      )}

      {!loading && !error && !listing && (
        <Typography>Listing not found.</Typography>
      )}

      {/* Actual Page */}
      <Typography variant='h3'>{listing.title}</Typography>
      <Box
        component="img"
        src={listing.image}
        alt="Description"
        sx={{width: '40%', height: '40%', borderRadius: 2}}
      />
      <Card>
        <CardContent>
          <Typography
            variant='h4'
          >
            Item Description
          </Typography>
          <Typography
            variant='body1'
            sx={{
              fontSize: 20,
            }}
          >
            {listing.description}
          </Typography>
          <Divider />

          <Box>
            <Typography
              variant='overline'
            >
              Specifications
            </Typography>
            <Stack spacing={2} sx={{mt: 2}}>
              <Box sx={stackSX}>
                <Typography>Colors</Typography>
                <Typography>{listing.colors.join(', ')}</Typography>
              </Box>
              <Box sx={stackSX}>
                <Typography>Size</Typography>
                <Typography>{listing.size}</Typography>
              </Box>
            </Stack>
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
};
