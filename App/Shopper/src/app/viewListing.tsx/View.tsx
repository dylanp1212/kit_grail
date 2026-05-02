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
    </main>
  )
}
