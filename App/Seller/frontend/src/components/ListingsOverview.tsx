import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import {useNavigate} from 'react-router-dom';

import {useMyListings} from '../hooks/useMyListings';


export const ListingsOverview = () => {
  const {listings, loading, error} = useMyListings();
  const navigate = useNavigate();
  const cellSX = {
    py: 5,
  };

  return (
    <Box
      sx={{
        p: 3,
      }}
    >
      <TableContainer component={Paper}>
        <Table aria-label="active listings">
          <TableHead>
            <TableRow>
              <TableCell colSpan={3}>
                <Typography
                  variant='overline'
                  sx={{
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}
                >
                  Active Listings
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow
              sx={{
                bgcolor: '#f3f3f3',
              }}
            >
              <TableCell>
                <Typography variant='overline'>
                  Product Name
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant='overline'>
                  Inventory Status
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant='overline'>
                  Price
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={3} align='center'>
                  <Typography>Loading...</Typography>
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={3} align='center'>
                  <Typography color="error">Error: {error}</Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading && !error && listings.length === 0 && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography>No listings yet.</Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading && !error && listings.map((listing) => (
              <TableRow
                key={listing.id}
                onClick={() => navigate(`/inventory/${listing.id}`)}
                sx={{
                  'cursor': 'pointer',
                  '&:hover': {bgcolor: 'grey.100'},
                }}
              >
                <TableCell
                  sx={cellSX}
                >
                  <Typography variant='h6'>
                    {listing.title}
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={cellSX}
                >
                  <Typography variant='overline'>
                    Low Stock
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={cellSX}
                >
                  <Typography variant='h6'>
                    ${listing.price}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>


        </Table>
      </TableContainer>
    </Box>
  );
};
