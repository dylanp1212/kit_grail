'use client';

import Button from '@mui/material/Button';
import { setSuspended } from '../../sellers/actions';

interface Props {
  id: string;
  suspended: boolean;
}

export default function SuspendButton({ id, suspended }: Props) {
  return (
    <Button
      onClick={() => { void setSuspended(id, !suspended); }}
      variant='outlined'
      sx={{
        color: suspended ? '#154212' : '#93000a',
        borderColor: suspended ? '#154212' : '#93000a',
        textTransform: 'none',
        '&:hover': { bgcolor: suspended ? '#f0ebe0' : '#fff0f0', borderColor: suspended ? '#154212' : '#93000a' },
      }}
    >
      {suspended ? 'Unsuspend' : 'Suspend'}
    </Button>
  );
}
