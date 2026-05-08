import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';


import {useMyListings} from '../hooks/useMyListings';


export const ListingsOverview = () => {
  const {listings} = useMyListings();
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
        <Table aria-label="active-listings-overview">
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
            {listings.map((listing) => (
              <TableRow
                key={listing.id}
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
                  <Typography variant='h6'>
                    0
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
