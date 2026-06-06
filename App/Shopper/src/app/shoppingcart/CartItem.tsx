'use client'
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {sizeToSymbol} from '../listings/helperFuncs';
import ListingImage from '../../components/ListingImage';
import {CartItem} from '@/shoppingcart';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CartListItem(
  // onRemove callback to pass props up to CartList and update state on delete
  { item, onRemove }: { item: CartItem, onRemove: () => void }) {
  const router = useRouter();
  const t = useTranslations('Common')
  console.log(item.size)
  return(
    <Box onClick={() => { router.push(`/viewlisting?id=${item.id}`); }}
      sx={{borderRadius: '10px', border: '1px solid #b3b2ae', cursor: 'pointer',
      overflow: 'hidden', width: '100%', position: 'relative'}}>
      <Box sx={{width: '100%', display: 'flex'}}>
        <Box sx={{width: '40%'}}>
          <ListingImage src={item.image} alt={item.title} />
        </Box>
        <Box sx={{width: '60%'}}>
          <Box sx={{px: '10px', py: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <Typography sx={{fontSize: '20px',
              fontWeight: '325', color: '#141413', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              pb: 1,
              }}>
              {item.title}
            </Typography>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
              <Box>
                <Typography sx={{fontSize: '14px', fontWeight: '600', color: '#141413'}}>
                  {t('price')}: ${item.price}
                </Typography>
                <Typography sx={{fontSize: '14px', fontWeight: '600', color: '#141413'}}>
                  {t('size')}: {sizeToSymbol(item.size)}
                </Typography>
              </Box>
              <IconButton aria-label="remove from cart" sx={{padding: '0px'}}
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); onRemove(); }}>
                <DeleteIcon sx={{color: '#141413', fontSize: '35px'}}/>
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
