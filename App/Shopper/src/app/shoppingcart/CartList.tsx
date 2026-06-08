'use client'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {useState, useEffect} from 'react';
import { CartItem } from '@/shoppingcart';
import {getAllCartItems, removeFromCart} from '../../shoppingcart/actions';
import {useCartCount} from '../../shoppingcart/CartCountContext';
import CartListItem from './CartItem';
import {useTranslations} from 'next-intl';


export default function CartList() {
  const t = useTranslations('ShoppingCart')
  const [items, setItems] = useState<CartItem[]>([]);
  const {decrement} = useCartCount();
  useEffect(() => {
    const getItems = async (): Promise<void> => {
      const i = await getAllCartItems();
      // remove items no longer in stock
      const unavailable = i.filter(item => item.quantity !== undefined && item.quantity <= 0)
      for (const item of unavailable) {
        await removeFromCart(item.id)
        decrement()
      }
      setItems(i.filter(item => item.quantity === undefined || item.quantity > 0));
    }
    void getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRemove = async (listingid: string): Promise<void> => {
    await removeFromCart(listingid)
    setItems(prev => prev.filter(item => item.id !== listingid))
    decrement()
  }

  // calculate total price
  const total = items.reduce((sum, item) => sum + item.price, 0)

  return (
    <Box sx={{ maxWidth: { xs: '100%', md: 800 }, mx: 'auto', px: { xs: 2, md: 4 } }}>
      {items.length === 0 ? (
        <Typography sx={{textAlign: 'center', color: '#5f5e5a', mt: 4}}>
          {t('empty')}
        </Typography>
      ) : (
        <>
          <Box sx={{width: '100%', display: 'flex', flexWrap: 'wrap',
            columnGap: '4%', rowGap: '10px'}}>
            {items.map((k) => (
              <Box key={k.id} sx={{width: '100%'}}>
                <CartListItem item={k} onRemove={() => { void handleRemove(k.id) }} />
              </Box>
            ))}
          </Box>
          <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 3, px: 1}}>
            <Typography sx={{fontWeight: 700, fontSize: '26px'}}>{t('total')}</Typography>
            <Typography sx={{fontWeight: 700, fontSize: '26px'}}>${total.toFixed(2)}</Typography>
          </Box>
        </>
      )}
    </Box>
  );
}
