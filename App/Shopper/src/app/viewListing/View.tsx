'use client'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ListingImage from '../../components/ListingImage'
import TopBar from '../../components/TopBar'
import OptionMenu from './OptionMenu'
// import { ListingService } from '../../kit_listing/service'
import {getKitListingById} from '../../kit_listing/actions'
// import { notFound } from 'next/navigation'
import {useState, useEffect} from 'react';
import {KitListing} from '../../kit_listing';
import {useSearchParams} from 'next/navigation';


// This file is temporary and logic will be moved
export default function View() {
  // const listing = await new ListingService().getKitListingById(id)
  // if (!listing) notFound()
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? undefined;
  const [listing, setListing] = useState<KitListing|null>(null);
  // if id not uuid, go to not found
  useEffect(() => {
    const getListing = async (): Promise<void> => {
      if (!id) {
        return
      }
      const l = await getKitListingById(id);
      setListing(l);
    }
    void getListing();
  }, [id])
  if (!id) {
    return (<>no id</>)
  }
  return (
    <main>
      <TopBar title={'Kit Grail'}/>
      {listing &&
        <>
          <ListingImage src={listing.image} alt={listing.title} />
          <Box sx={{ px: 2, py: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>{listing.title}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 400 }}>{`$${listing.price.toFixed(2)}`}</Typography>

            <Typography variant="body1" sx={{ mt: 1, color: '#42493e', whiteSpace: 'pre-wrap'}}>{listing.description}</Typography>

          </Box>
          <OptionMenu />
        </>
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
