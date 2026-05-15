import {useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';


const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
type Size = typeof sizes[number];
const sizeLabels: Record<Size, string> = {
  xsmall: 'XS', small: 'S', medium: 'M', large: 'L', xlarge: 'XL',
};
const colorlist = ['red', 'orange', 'yellow', 'green', 'blue', 'navy',
  'purple', 'pink', 'black', 'white', 'grey', 'brown', 'gold', 'silver'];

export const NewListing = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [size, setSize] = useState<Size|null>(null);
  const emptycolors: string[] = [];
  const [colors, setColors] = useState(emptycolors);
  const [priceLeft, setPriceLeft] = useState('');
  const [priceRight, setPriceRight] = useState('00');
  return (
    <Box sx={{p: 3}} >
      <Typography gutterBottom variant='h3' sx={{px: 3}}>
        New Listing
      </Typography>
      <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Box sx={{width: '70%', display: 'flex', flexDirection: 'column'}}>
          <Box sx={{px: 3, pt: 3}}>
            <Card sx={{display: 'flex', flex: 1,
              alignItems: 'center'}} aria-label='total sales'>
              <CardContent sx={{display: 'flex', flexDirection: 'column',
                width: '100%', gap: 2}}>
                <Typography variant='h5'>Title</Typography>
                <TextField value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  variant="outlined"
                  slotProps={{htmlInput: {style: {fontSize: '30px'}}}}
                />
              </CardContent>
            </Card>
          </Box>
          <Box sx={{px: 3, pt: 3}}>
            <Card sx={{flex: 1, display: 'flex',
              alignItems: 'center'}} aria-label='total sales'>
              <CardContent sx={{display: 'flex', flexDirection: 'column',
                gap: 2, width: '100%'}}>
                <Typography variant='h5'>Description</Typography>
                <TextField multiline rows={7} value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  variant="outlined"
                  slotProps={{htmlInput: {style: {fontSize: '15px'}}}}
                />
              </CardContent>
            </Card>
          </Box>
          <Box sx={{px: 3, pt: 3, flex: 1, display: 'flex',
            flexDirection: 'column'}}>
            {(() => {
              const complete = title !== '' && description !== '' &&
                size !== null && colors.length > 0 &&
                (parseInt(priceLeft) > 0 || parseInt(priceRight) > 0);
              return (
                <Box sx={{
                  flex: 1, border: '2px solid #154212', borderRadius: '4px',
                  display: 'flex', justifyContent: 'center',
                  alignItems: 'center', cursor: 'pointer',
                  bgcolor: complete ? '#154212' : 'transparent',
                }}>

                  <Typography variant='h5'
                    sx={{color: complete ? 'white' : '#154212'}}>
                    Create new listing
                  </Typography>
                  <AddIcon sx={{color: complete ? 'white' : '#154212',
                    pl: '5px', fontSize: '30px'}} />
                </Box>
              );
            })()}
          </Box>
        </Box>
        <Box sx={{width: '25%', px: 3, pt: 3}}>
          <Box>
            <Card sx={{flex: 1, display: 'flex', flexDirection: 'column'}}
              aria-label='total sales'>
              <Box sx={{p: 2}}>
                <Typography variant='h5' sx={{pb: 2}}>Size</Typography>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                  {sizes.map((s) => {
                    const selected = size === s;
                    return (
                      <Box key={s} onClick={() => setSize(s)}
                        sx={{
                          display: 'flex', border: '2px solid #154212',
                          justifyContent: 'center', alignItems: 'center',
                          height: '35px', width: '35px', cursor: 'pointer',
                          bgcolor: selected ? '#154212' : 'transparent',
                        }}
                      >
                        <Typography variant='body1'
                          sx={{color: selected ? 'white' : '#154212'}}>
                          {sizeLabels[s]}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
              <Box sx={{p: 2}}>
                <Typography variant='h5' sx={{pb: 2}}>Colors</Typography>
                <Box sx={{display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5}}>
                  {colorlist.map((c) => {
                    const selected = colors.includes(c);
                    return (
                      <Box key={c}
                        onClick={() => setColors((prev) =>
                          prev.includes(c) ?
                            prev.filter((x) => x !== c) :
                            [...prev, c],
                        )}
                        sx={{
                          display: 'flex', border: '2px solid #154212',
                          justifyContent: 'center', alignItems: 'center',
                          height: '28px', width: '28px', cursor: 'pointer',
                          bgcolor: c, backgroundClip: 'padding-box',
                        }}
                      >
                        {selected && (
                          <Typography variant='body2' sx={{
                            fontWeight: 'bold', lineHeight: 1,
                            color: 'white', textShadow: '0 0 3px black',
                          }}>
                            {'✔'}

                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
              <Box sx={{p: 2}}>
                <Typography variant='h5'>Image</Typography>
                <Typography variant='caption' sx={{pb: 2, color: '#5f5e5a'}}>
                  Please provide a url to an image of your kit:
                </Typography>
                <TextField value={image} fullWidth type="url"
                  onChange={(e) => setImage(e.target.value)}
                  variant="outlined"
                  slotProps={{htmlInput: {style: {fontSize: '15px'}}}}
                />
              </Box>
              <Box sx={{p: 2}}>
                <Typography variant='h5'>Price</Typography>
                <Typography variant='caption' sx={{pb: 2, color: '#5f5e5a'}}>
                  Price in USD:
                </Typography>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  <Typography variant='h5'>$</Typography>
                  <TextField value={priceLeft} sx={{px: '5px'}}
                    onChange={(e) =>
                      setPriceLeft(e.target.value.replace(/\D/g, ''))
                    }
                  />
                  <Typography variant='h5'>.</Typography>
                  <TextField value={priceRight} sx={{pl: '5px'}}
                    onChange={(e) =>
                      setPriceRight(
                          e.target.value.replace(/\D/g, '').slice(0, 2),
                      )
                    }
                    onBlur={() =>
                      setPriceRight((prev) => prev.padStart(2, '0'))
                    }
                  />
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
