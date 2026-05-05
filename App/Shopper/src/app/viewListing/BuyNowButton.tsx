import Button from '@mui/material/Button'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

export default function AddToCartButton() {
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
      Buy Now
    </Button>
  )
}