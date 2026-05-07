import {useRouter} from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function NoSearchResults () {
  const router = useRouter();
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center'}}>
      <Box sx={{width: '100%', marginTop: '30px'}}>
        <Typography sx={{color: '#5f5e5a', fontSize: '20px',
          fontWeight: '500'}}>
          Hmm, we can't find anything like that...
        </Typography>
      </Box>
      <Box sx={{borderRadius: '4px', border: '1px solid #5f5e5a',
        padding: '5px', marginTop: '30px'}} onClick={() => {router.push('?search=')}}>
        <Typography sx={{color: '#5f5e5a'}}>
          Clear search
        </Typography>
      </Box>
    </Box>
  );
}