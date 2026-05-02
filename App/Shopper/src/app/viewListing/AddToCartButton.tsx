import Button from '@mui/material/Button'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

export default function AddToCartButton() {
  return (
    <Button
      variant="contained"
      fullWidth
      startIcon={<ShoppingCartIcon />}
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
      Add to Cart
    </Button>
  )
}
