import Box from '@mui/material/Box';

interface Props {
  src?: string
  alt: string
}

export default function ListingImage({ src, alt }: Props) {
  return (
    <Box
      component='img'
      src={src ?? 'http://localhost:3000/blankJersey.jpg'}
      alt={alt}
      sx={{width: '100%'}}
    />
  );
}
