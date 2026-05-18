'use client'
import Button from '@mui/material/Button'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import {useTranslations} from 'next-intl';

export default function AddToCartButton() {
  const t = useTranslations('Cart')
  return (
    <Button
      variant="contained"
      fullWidth
      startIcon={<ShoppingBagIcon />}
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
      {t('buyNow')}
    </Button>
  )
}
