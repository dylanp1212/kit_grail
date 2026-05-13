import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export default function CheckoutSuccessPage() {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: 2, px: 3}}>
      <CheckCircleIcon sx={{fontSize: 72, color: '#154212'}} />
      <Typography variant="h5" sx={{fontFamily: '"Lexend", sans-serif', fontWeight: 600, color: '#154212'}}>
        Order placed!
      </Typography>
      <Typography sx={{color: '#5f5e5a', textAlign: 'center'}}>
        Your payment was successful. You will receive a confirmation shortly.
      </Typography>
      <Button
        href="/listings"
        variant="contained"
        sx={{mt: 2, bgcolor: '#154212', '&:hover': {bgcolor: '#23501e'}, textTransform: 'none', fontFamily: '"Work Sans", sans-serif'}}
      >
        Continue Shopping
      </Button>
    </Box>
  )
}
