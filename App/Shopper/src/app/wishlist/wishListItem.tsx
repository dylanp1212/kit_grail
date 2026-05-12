'use client'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {useRouter} from 'next/navigation';
import {WishlistItem} from '../../wishlist';
import {sizeToSymbol} from '../listings/helperFuncs';
import ListingImage from '../../components/ListingImage';
import {formatDate} from '../listings/helperFuncs';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import {removeFromWishlist} from '../../wishlist/actions';
import {useState, MouseEvent} from 'react';

export default function WishListItem(
  { item }: { item: WishlistItem }) {
  const router = useRouter();
  const [anch, setAnch] = useState<HTMLElement|null>(null);
  const handleDelClick = async (e: MouseEvent) => {
    e.stopPropagation();
    setAnch(null);
    await removeFromWishlist(item.id);
  }
  const menuClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnch(e.currentTarget);
  }
  return(
    <>
      <Box onClick={() => { router.push(`/viewlisting?id=${item.id}`); }}
        sx={{borderRadius: '10px', border: '1px solid #b3b2ae', cursor: 'pointer',
        overflow: 'hidden', width: '100%', position: 'relative'}}>
        <Box sx={{width: '100%', display: 'flex'}}>
          <Box sx={{width: '40%'}}>
            <ListingImage src={item.image} alt={item.title} />
          </Box>
          <Box sx={{width: '60%'}}>
            <Box sx={{px: '10px', py: '10px'}}>
              <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Typography sx={{fontSize: '12px',
                  fontWeight: '500', color: '#5f5e5a'}}>
                  Wishlisted {formatDate(new Date(item.added))}
                </Typography>
                <IconButton sx={{padding: '0px'}} onClick={menuClick}
                  aria-label={'menu for ' + item.title}>
                  <MoreHorizIcon />
                </IconButton>
              </Box>
              <Typography sx={{fontSize: '20px',
                fontWeight: '325', color: '#141413', display: '-webkit-box',
                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                {item.title}
              </Typography>
              <Box sx={{display: 'flex', justifyContent: 'space-between',
                alignItems: 'center'}}>
                <Box sx={{width: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between'}}>
                  <Typography sx={{fontSize: '19px',
                    fontWeight: '700', color: '#141413'}}>
                    ${item.price}
                  </Typography>
                  <Typography sx={{fontSize: '12px',
                    fontWeight: '600', color: '#5f5e5a'}}>
                    SIZE {sizeToSymbol(item.size)}
                  </Typography>
                </Box>
                <Box>
                  <IconButton aria-label="add to cart" sx={{padding: '0px'}}>
                    <AddCircleIcon sx={{color: '#141413', fontSize: '35px'}}/>
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Menu anchorEl={anch} open={Boolean(anch)}
        onClose={() => { setAnch(null); }}>
        <MenuItem onClick={(e) => {void handleDelClick(e)}}>Remove</MenuItem>
      </Menu>
    </>
  );
}
