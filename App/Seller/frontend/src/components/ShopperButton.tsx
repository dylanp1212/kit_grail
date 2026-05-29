import Button from '@mui/material/Button';
import StorefrontIcon from '@mui/icons-material/Storefront';

const SHOPPER_URL = import.meta.env.VITE_SHOPPER_URL ?? 'https://kitgrail.com/';

export const ShopperButton = () => {
  return (
    <Button
      variant="contained"
      startIcon={<StorefrontIcon />}
      onClick={() => window.location.assign(SHOPPER_URL)}
      sx={{
        'bgcolor': '#eeebe5',
        'color': '#154212',
        'fontFamily': '"Work Sans", sans-serif',
        'fontWeight': 600,
        'textTransform': 'none',
        'borderRadius': '4px',
        'px': 3,
        'py': 1.25,
        '&:hover': {bgcolor: '#c8d4c0'},
      }}
    >
      Go to Shop
    </Button>
  );
};
