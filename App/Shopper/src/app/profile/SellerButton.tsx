'use client'

import Button from '@mui/material/Button';
import StorefrontIcon from '@mui/icons-material/Storefront';

export default function SellerButton() {
  return (
    <Button
      variant="contained"
      startIcon={<StorefrontIcon />}
      sx={{
        bgcolor: '#154212',
        color: '#F2E8D5',
        fontFamily: '"Work Sans", sans-serif',
        fontWeight: 600,
        textTransform: 'none',
        borderRadius: '4px',
        px: 3,
        py: 1.25,
        '&:hover': { bgcolor: '#1e5a19' },
      }}
    >
      Go to Seller App
    </Button>
  );
}
