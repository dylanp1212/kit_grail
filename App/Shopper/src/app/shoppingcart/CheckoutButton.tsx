import Button from '@mui/material/Button'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

export default function AddToCartButton() {
  return (
    <Button
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
      Proceed to Checkout
    </Button>
  )
}