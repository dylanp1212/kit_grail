import Box from '@mui/material/Box';
import {KitListing} from '../kit_listing';
import KitListItem from './kitListItem';
import {getAllKitListings} from '../kit_listing/actions';
import {useState, useEffect} from 'react';


export default function KitList() {
  // const listings = [
  //   {
  //     id: 'aa0fccb7-06f8-4f29-ae65-b30c2adabce8',
  //     size: 'large',
  //     title: 'Messi Argentina Home Jersey 2014',
  //     colors: [ 'blue', 'white' ],
  //     description: 'Messi Jersey\\n2014 Argentina home jersey\\nSize large\\nBlue and white',
  //     price: 300,
  //     listed: Date.now(),
  //     image: 'https://i.ebayimg.com/images/g/CZ8AAOSwzetlssmP/s-l400.jpg',
  //   },
  //   {
  //     id: 'bde7457b-d78c-4c6b-bbe2-79047fa6d4d5',
  //     size: 'xlarge',
  //     title: 'Busquets Spain Home Jersey 2010',
  //     colors: [ 'red', 'blue' ],
  //     description: 'Messi Jersey\\n2014 Argentina home jersey\\nSize large\\nBlue and white',
  //     price: 130,
  //     listed: Date.now(),
  //   },
  //   {
  //     id: '1ec5b401-5a82-4dbe-8745-feb18a322be4',
  //     size: 'small',
  //     title: 'Brazil 1996 Away Jersey Shirt Football Soccer Small Mens',
  //     colors: [ 'yellow', 'green' ],
  //     description: 'Messi Jersey\\n2014 Argentina home jersey\\nSize large\\nBlue and white',
  //     price: 75,
  //     listed: Date.now(),
  //     image: 'https://i.ebayimg.com/images/g/CZ8AAOSwzetlssmP/s-l400.jpg',
  //   },
  // ];
  const empty: KitListing[] = [];
  const [listings, setListings] = useState(empty);
  useEffect(() => {
    const getListings = async (): Promise<void> => {
      const l = await getAllKitListings();
      setListings(l);
    }
    void getListings();
  }, [])
  return (
    <Box>
      <Box sx={{width: '100%', display: 'flex', flexWrap: 'wrap',
        columnGap: '4%', rowGap: '10px'}}>
        {listings.map((k) => (
          <Box key={k.id} sx={{width: '48%'}}>
            <KitListItem listing={k} />
          </Box>
        ))}
        {/* <Box sx={{width: '49%'}}>
          <KitListItem listing={testlisting}/>
        </Box>
        <Box sx={{width: '49%'}}>
          <KitListItem listing={testlisting}/>
        </Box> */}
      </Box>
    </Box>
  );
}