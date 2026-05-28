import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';

import {getListing, type MyListing} from '../api/listings';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import {LoadingError} from '../components/LoadingError';
import {Button} from '@mui/material';

export const ListingPage = () => {
  const {id} = useParams<{ id: string }>();
  const [listing, setListing] = useState<MyListing | null>(null);
  const [loading, setLoading] = useState(!!id);
  const missingId = id ? null : 'Missing listing id';
  const [error, setError] = useState<string | null>(missingId);

  const navigate = useNavigate();

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

  const handleClick = () => {
    navigate(`/edit/${id}`);
  };

  if (loading || error) return <LoadingError loading={loading} error={error} />;
  if (!listing) return <Typography>Listing not found.</Typography>;

  return (
    <Box
      sx={{
        p: 3,
      }}
    >
      <Box
        sx={{

        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant='h3'
            sx={{
              fontFamily: 'Lexend, sans-serif',
            }}
          >
            {listing.title}
          </Typography>
          <Button
            variant='outlined'
            onClick={handleClick}
          >
            Edit Listing
          </Button>
        </Box>

        <Box
          component="img"
          src={listing.image}
          alt="Description"
          sx={{width: '40%', height: '40%', borderRadius: 2}}
        />
      </Box>

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
