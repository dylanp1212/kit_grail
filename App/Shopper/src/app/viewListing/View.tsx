import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ListingImage from '../../components/ListingImage'
import TopBar from '../../components/TopBar'
import OptionMenu from './OptionMenu'
import { ListingService } from '../../kit_listing/service'
import { notFound } from 'next/navigation'


// This file is temporary and logic will be moved
export default async function View({ id }: { id: string }) {
  const listing = await new ListingService().getKitListingById(id)
  if (!listing) notFound()
  return (
    <main>
      <TopBar title={'Kit Grail'}/>
      <ListingImage src={listing.image} alt={listing.title} />
      <Box sx={{ px: 2, py: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>{listing.title}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 400 }}>{`$${listing.price.toFixed(2)}`}</Typography>

        <Typography variant="body1" sx={{ mt: 1, color: '#42493e', whiteSpace: 'pre-wrap'}}>{listing.description}</Typography>

      </Box>
      <OptionMenu />
    </main>
  )
}
