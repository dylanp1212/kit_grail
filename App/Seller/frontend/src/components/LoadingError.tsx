import Typography from '@mui/material/Typography';

interface Props {
  loading: boolean;
  error: string | null;
}

export const LoadingError = ({loading, error}: Props) => (
  <>
    {loading && (
      <Typography sx={{textAlign: 'center'}}>Loading...</Typography>
    )}
    {error && (
      <Typography color="error" sx={{textAlign: 'center'}}>
        Error: {error}
      </Typography>
    )}
  </>
);
