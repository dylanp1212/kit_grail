'use client'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ListingImage from '../../components/ListingImage'
import OptionMenu from './OptionMenu'
// import { ListingService } from '../../kit_listing/service'
import {getKitListingById} from '../../kit_listing/actions'
// import { notFound } from 'next/navigation'
import {useState, useEffect} from 'react';
import {KitListing} from '../../kit_listing';
import {useSearchParams} from 'next/navigation';
import ListingNotFound from '../../components/listingNotFound';


// This file is temporary and logic will be moved
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export default function View() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? undefined;
  const [listing, setListing] = useState<KitListing|null>(null);
  // const isuuid = uuidRegex.test(id)
  useEffect(() => {
    const getListing = async (): Promise<void> => {
      if (!id || !(uuidRegex.test(id))) {
        return
      }
      const l = await getKitListingById(id);
      setListing(l);
    }
    void getListing();
  }, [id])
  if (!id || !(uuidRegex.test(id))) {
    return <ListingNotFound />
  }
  return (
    <main>
      {listing ?
        (<>
          <ListingImage src={listing.image} alt={listing.title} />
          <Box sx={{ px: 2, py: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>{listing.title}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 400 }}>{`$${listing.price.toFixed(2)}`}</Typography>

            <Typography variant="body1" sx={{ mt: 1, color: '#42493e', whiteSpace: 'pre-wrap'}}>{listing.description}</Typography>

          </Box>
          <OptionMenu listingid={id} />
        </>) : <ListingNotFound />
      }
      {/* <ListingImage src={listing.image} alt={listing.title} />
      <Box sx={{ px: 2, py: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>{listing.title}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 400 }}>{`$${listing.price.toFixed(2)}`}</Typography>

        <Typography variant="body1" sx={{ mt: 1, color: '#42493e', whiteSpace: 'pre-wrap'}}>{listing.description}</Typography>

      </Box>
      <OptionMenu /> */}
    </main>
  )
}
