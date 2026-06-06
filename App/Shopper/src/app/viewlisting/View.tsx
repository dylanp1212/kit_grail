'use client'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ListingImage from '../../components/ListingImage'
import OptionMenu from './OptionMenu'
// import { ListingService } from '../../kit_listing/service'
import {getKitListingById} from '../../kit_listing/actions'
// import { notFound } from 'next/navigation'
import {useState, useEffect, useRef} from 'react';
import {KitListing} from '../../kit_listing';
import {useSearchParams} from 'next/navigation';
import ListingNotFound from '../../components/listingNotFound';
import {useTranslations} from 'next-intl';
import {sizeToSymbol} from '../listings/helperFuncs';


// This file is temporary and logic will be moved
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export default function View() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? undefined;
  const [listing, setListing] = useState<KitListing|null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Common')
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

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
    }
  }, []);

  if (!id || !(uuidRegex.test(id))) {
    return <ListingNotFound />
  }

  const wideMode = containerWidth >= 750

  return (
    <main ref={containerRef}>
      {listing ?
        wideMode ? (
          <Box sx={{ display: 'flex', gap: 4, pt: 8, pb: 4, px: 8, maxWidth: 1500, mx: 'auto', alignItems: 'stretch' }}>
            <Box sx={{ flex: 1 }}>
              <ListingImage src={listing.image} alt={listing.title} />
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 600 }}>{listing.title}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 400 }}>{`$${listing.price.toFixed(2)}`}</Typography>
                <Typography variant="h5" sx={{fontWeight: '600', color: '#5f5e5a' }}>{t('size')} {sizeToSymbol(listing.size)}</Typography>
                <Typography variant="h6" sx={{ mt: 2, color: '#42493e', whiteSpace: 'pre-wrap', fontWeight: 400 }}>{listing.description}</Typography>
              </Box>
              <Box sx={{ my: 'auto', display: 'flex', justifyContent: 'center', px: 4 }}>
                <Box sx={{ width: '100%', maxWidth: 400 }}>
                  <OptionMenu listingid={id} />
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{p: 2}}>
            <ListingImage src={listing.image} alt={listing.title} />
            <Box sx={{ py: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>{listing.title}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 400 }}>{`$${listing.price.toFixed(2)}`}</Typography>
              <Typography variant="h6" sx={{fontWeight: '600', color: '#5f5e5a'}}>
                {t('size')} {sizeToSymbol(listing.size)}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, color: '#42493e', whiteSpace: 'pre-wrap'}}>{listing.description}</Typography>
            </Box>
            <OptionMenu listingid={id} />
          </Box>
        ) : <ListingNotFound />
      }
    </main>
  )
}
