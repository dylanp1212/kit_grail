import Button from '@mui/material/Button'

export default function MakeOfferButton() {
  return (
    <Button
      variant="outlined"
      fullWidth
      sx={{
        height: '56px',
        borderColor: '#885035',
        color: '#885035',
        fontFamily: '"Work Sans", sans-serif',
        fontSize: '18px',
        textTransform: 'none',
        borderRadius: '8px',
        '&:hover': { bgcolor: '#ffdbcc33' },
      }}
    >
      Make an Offer
    </Button>
  )
}
