'use client'
import Button from '@mui/material/Button'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import {useCart} from '../../shoppingcart/useCart'
import {useTranslations} from 'next-intl'

export default function AddToCartButton({listingid}: {listingid: string}) {
  const {inCart, handleClick} = useCart(listingid)
  const t = useTranslations('Cart')
  return (
    <Button
      variant="contained"
      fullWidth
      disabled={inCart}
      startIcon={<ShoppingCartIcon />}
      onClick={handleClick}
      sx={{
        height: '56px',
        bgcolor: '#154212',
        color: '#ffffff',
        fontFamily: '"Work Sans", sans-serif',
        fontSize: '18px',
        textTransform: 'none',
        borderRadius: '8px',
        '&:hover': { bgcolor: '#23501e' },
      }}
    >
      {inCart ? t('addedToCart') : t('addToCart')}
    </Button>
  )
}
