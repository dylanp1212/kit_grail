'use client'
import Button from '@mui/material/Button'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import {useRouter} from 'next/navigation'
import {getAllCartItems, getShopperId} from '../../shoppingcart/actions'
import {getSessionUser} from '../../auth/actions'
import {createCheckoutSession} from '../../checkout/service'
import {useTranslations} from 'next-intl'

export default function CheckoutButton() {
  const router = useRouter()
  const t = useTranslations('Cart')

  const handleCheckout = async () => {
    const user = await getSessionUser()
    if (!user) {
      router.push('/login?returnTo=/shoppingcart')
      return
    }
    const [shopperid, items] = await Promise.all([getShopperId(), getAllCartItems()])
    const url = await createCheckoutSession(
      shopperid,
      items.map(item => ({id: item.id, title: item.title, price: item.price, image: item.image})),
      // `${window.location.origin}/checkout/success`, // production
      // `${window.location.origin}/checkout/canceled`, // production
      'http://localhost:3000/checkout/success',
      'http://localhost:3000/checkout/canceled',
    )
    router.push(url)
  }

  return (
    <Button
      onClick={() => { void handleCheckout() }}
      variant="contained"
      fullWidth
      startIcon={<ShoppingBagIcon />}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '56px',
        bgcolor: '#154212',
        color: '#ffffff',
        fontFamily: '"Work Sans", sans-serif',
        fontSize: '18px',
        textTransform: 'none',
        borderRadius: 0,
        '&:hover': { bgcolor: '#23501e' },
      }}
    >
      {t('proceedToCheckout')}
    </Button>
  )
}
