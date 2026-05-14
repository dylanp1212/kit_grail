'use client'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import {useTranslations} from 'next-intl'

export default function CheckoutCanceledPage() {
  const t = useTranslations('Cart')
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: 2, px: 3}}>
      <HighlightOffIcon sx={{fontSize: 72, color: '#8b0000'}} />
      <Typography variant="h5" sx={{fontFamily: '"Lexend", sans-serif', fontWeight: 600, color: '#141413'}}>
        {t('orderCanceled')}
      </Typography>
      <Typography sx={{color: '#5f5e5a', textAlign: 'center'}}>
        {t('paymentNotCompleted')}
      </Typography>
      <Button
        href="/shoppingcart"
        variant="contained"
        sx={{mt: 2, bgcolor: '#154212', '&:hover': {bgcolor: '#23501e'}, textTransform: 'none', fontFamily: '"Work Sans", sans-serif'}}
      >
        {t('backToCart')}
      </Button>
    </Box>
  )
}
