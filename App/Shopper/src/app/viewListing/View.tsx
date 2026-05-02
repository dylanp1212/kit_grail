import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ListingImage from '../../components/ListingImage'
import TopBar from '../../components/TopBar'
import { ListingService } from '../../kit_listing/service'
import { notFound } from 'next/navigation'

export default async function View({ id }: { id: string }) {
  const listing = await new ListingService().getKitListingById(id)
  if (!listing) notFound()
  return (
    <main>
      <TopBar />
      <ListingImage src={listing.image} alt={listing.title} />
      <Box sx={{ px: 2, py: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>{listing.title}</Typography>
        <Typography variant="body1" sx={{ mt: 1, color: '#42493e' }}>{listing.description}</Typography>
      </Box>
    </main>
  )
}
