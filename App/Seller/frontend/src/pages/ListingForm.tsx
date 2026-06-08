import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {z} from 'zod';
import {useSellerContext} from '../context/SellerContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
  createNewListing, getListing, editListing, type NewListing,
} from '../api/listings';
import playersData from '../data/players.json';
import clubsData from '../data/clubs.json';

const players: string[] = playersData;
const clubs: string[] = clubsData;


const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
type Size = typeof sizes[number];
const sizeLabels: Record<Size, string> = {
  xsmall: 'XS', small: 'S', medium: 'M', large: 'L', xlarge: 'XL',
};
const colorlist = ['red', 'orange', 'yellow', 'green', 'blue', 'navy',
  'purple', 'pink', 'black', 'white', 'grey', 'brown', 'gold', 'silver'];

const listingSchema = z.object({
  title: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
  size: z.enum(sizes, {errorMap: () => ({message: 'Select a size'})}),
  colors: z.array(z.string()).min(1, 'Select at least one color'),
  price: z.number().positive('Must be greater than $0.00'),
  image: z.union([z.string().url('Must be a valid URL'), z.literal('')]),
  quantity: z.number().int().min(1, 'Must be at least 1'),
});

type ListingErrors =
  Partial<Record<keyof z.infer<typeof listingSchema>, string>>;

export const ListingForm = () => {
  const {id} = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const user = useSellerContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [size, setSize] = useState<Size|null>(null);
  const emptycolors: string[] = [];
  const [colors, setColors] = useState(emptycolors);
  const [priceLeft, setPriceLeft] = useState('');
  const [priceRight, setPriceRight] = useState('00');
  const [quantity, setQuantity] = useState(1);
  const [player, setPlayer] = useState('');
  const [club, setClub] = useState('');
  const [season, setSeason] = useState('');
  const [competition, setCompetition] = useState('');
  const [errors, setErrors] = useState<ListingErrors>({});

  const clearError = (field: keyof ListingErrors) =>
    setErrors((prev) => ({...prev, [field]: undefined}));

  useEffect(() => {
    if (!id) {
      return;
    }

    getListing(id).then((listing) => {
      if (!listing) return;
      setTitle(listing.title);
      setDescription(listing.description);
      setImage(listing.image ?? '');
      setSize(listing.size);
      setColors(listing.colors);
      setPriceLeft(String(Math.floor(listing.price)));
      setPriceRight(
          String(Math.round((listing.price % 1) * 100)).padStart(2, '0'),
      );
      setQuantity(listing.quantity);
      setPlayer(listing.player ?? '');
      setClub(listing.club ?? '');
      setSeason(listing.season ?? '');
      setCompetition(listing.competition ?? '');
    });
  }, [id]);

  const handleSubmit = async () => {
    if (!user) return;

    const price =
      (parseFloat(priceLeft) || 0) + parseInt(priceRight) / 100;
    const result = listingSchema.safeParse({
      title, description, size, colors, price, image, quantity,
    });

    if (!result.success) {
      const fe = result.error.flatten().fieldErrors;
      setErrors({
        title: fe.title?.[0],
        description: fe.description?.[0],
        size: fe.size?.[0],
        colors: fe.colors?.[0],
        price: fe.price?.[0],
        image: fe.image?.[0],
        quantity: fe.quantity?.[0],
      });
      return;
    }

    setErrors({});
    const newListing: NewListing = {
      seller: user.id,
      title: result.data.title,
      description: result.data.description,
      size: result.data.size,
      colors: result.data.colors,
      price: result.data.price,
      image: result.data.image || undefined,
      quantity: result.data.quantity,
      player: player || undefined,
      club: club || undefined,
      season: season || undefined,
      competition: competition || undefined,
    };

    if (isEdit) {
      await editListing(id, newListing);
      navigate(`/inventory/${id}`);
    } else {
      await createNewListing(newListing);
      navigate('/inventory');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Box sx={{p: 3}} >
      <Typography gutterBottom variant='h3' sx={{px: 3}}>
        {isEdit ? 'Edit Listing' : 'New Listing'}
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
                  onChange={(e) => {
                    setTitle(e.target.value); clearError('title');
                  }}
                  variant="outlined"
                  error={!!errors.title}
                  helperText={errors.title}
                  slotProps={{htmlInput: {'style': {fontSize: '30px'},
                    'aria-label': 'title'}}}
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
                  onChange={(e) => {
                    setDescription(e.target.value); clearError('description');
                  }}
                  variant="outlined"
                  error={!!errors.description}
                  helperText={errors.description}
                  slotProps={{htmlInput: {'style': {fontSize: '15px'},
                    'aria-label': 'description'}}}
                />
              </CardContent>
            </Card>
          </Box>
          <Box sx={{
            px: 3, pt: 3, flex: 1, display: 'flex',
            flexDirection: 'row', gap: 2,
          }}>
            {(() => {
              const complete = title !== '' && description !== '' &&
                size !== null && colors.length > 0 &&
                (parseInt(priceLeft) > 0 || parseInt(priceRight) > 0);
              return (
                <Box aria-label="create new listing" aria-pressable={complete}
                  onClick={() => handleSubmit()}
                  sx={{
                    flex: 1, border: '2px solid #154212', borderRadius: '4px',
                    display: 'flex', justifyContent: 'center', height: '42px',
                    alignItems: 'center', cursor: 'pointer',
                    bgcolor: complete ? '#154212' : 'transparent',
                  }}>

                  <Typography variant='h5'
                    sx={{color: complete ? 'white' : '#154212'}}>
                    {isEdit ? 'Save Changes' : 'Create Listing'}
                  </Typography>
                  <AddIcon sx={{color: complete ? 'white' : '#154212',
                    pl: '5px', fontSize: '30px'}} />
                </Box>
              );
            })()}

            <Box
              aria-label="cancel listing"
              onClick={handleCancel}
              sx={{
                flex: 1, border: '2px solid #93000a', borderRadius: '4px',
                display: 'flex', justifyContent: 'center', height: '42px',
                alignItems: 'center', cursor: 'pointer', bgcolor: '#93000a',
              }}
            >
              <Typography variant='h5'
                sx={{
                  color: 'white', pl: '5px',
                }}
              >
                {isEdit ? 'Cancel Edit' : 'Cancel Listing'}
              </Typography>
              <CloseIcon
                sx={{
                  color: 'white',
                  pl: '5px',
                  fontSize: '30px',
                }}
              />
            </Box>
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
                      <Box key={s} onClick={() => {
                        setSize(s); clearError('size');
                      }}
                      aria-pressed={selected} aria-label={sizeLabels[s]}
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
                {errors.size && (
                  <Typography variant='caption'
                    sx={{color: 'error.main', pt: 0.5, display: 'block'}}>
                    {errors.size}
                  </Typography>
                )}
              </Box>
              <Box sx={{p: 2}}>
                <Typography variant='h5' sx={{pb: 2}}>Colors</Typography>
                <Box sx={{display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5}}>
                  {colorlist.map((c) => {
                    const selected = colors.includes(c);
                    return (
                      <Box key={c}
                        onClick={() => {
                          setColors((prev) =>
                            prev.includes(c) ?
                              prev.filter((x) => x !== c) :
                              [...prev, c],
                          );
                          clearError('colors');
                        }}
                        aria-pressed={selected} aria-label={c}
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
                {errors.colors && (
                  <Typography variant='caption'
                    sx={{color: 'error.main', pt: 0.5, display: 'block'}}>
                    {errors.colors}
                  </Typography>
                )}
              </Box>
              <Box sx={{p: 2}}>
                <Typography variant='h5'>Image</Typography>
                <Typography variant='caption' sx={{pb: 2, color: '#5f5e5a'}}>
                  Please provide a url to an image of your kit:
                </Typography>
                <TextField value={image} fullWidth type="url"
                  onChange={(e) => {
                    setImage(e.target.value); clearError('image');
                  }}
                  variant="outlined"
                  error={!!errors.image}
                  helperText={errors.image}
                  slotProps={{htmlInput: {'style': {fontSize: '15px'},
                    'aria-label': 'image url'}}}
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
                    onChange={(e) => {
                      setPriceLeft(e.target.value.replace(/\D/g, ''));
                      clearError('price');
                    }}
                    error={!!errors.price}
                    slotProps={{htmlInput: {'aria-label': 'dollars'}}}
                  />
                  <Typography variant='h5'>.</Typography>
                  <TextField value={priceRight} sx={{pl: '5px'}}
                    onChange={(e) => {
                      setPriceRight(
                          e.target.value.replace(/\D/g, '').slice(0, 2),
                      );
                      clearError('price');
                    }}
                    error={!!errors.price}
                    slotProps={{htmlInput: {'aria-label': 'cents'}}}
                    onBlur={() =>
                      setPriceRight((prev) => prev.padStart(2, '0'))
                    }
                  />
                </Box>
                {errors.price && (
                  <Typography variant='caption'
                    sx={{color: 'error.main', pt: 0.5, display: 'block'}}>
                    {errors.price}
                  </Typography>
                )}
              </Box>
              <Box sx={{p: 2}}>
                <Typography variant='h5'>Quantity</Typography>
                <TextField
                  value={quantity}
                  fullWidth
                  onChange={(e) => {
                    setQuantity(Number(e.target.value.replace(/\D/g, '')));
                    clearError('quantity');
                  }}
                  error={!!errors.quantity}
                  helperText={errors.quantity}
                  slotProps={{htmlInput: {'aria-label': 'quantity'}}}
                />
              </Box>
            </Card>
          </Box>
          <Box sx={{pt: 3}}>
            <Card sx={{flex: 1, display: 'flex', flexDirection: 'column'}}
              aria-label='kit details'>
              <Box sx={{p: 2}}>
                <Typography variant='h5' sx={{pb: 1}}>Kit Details</Typography>
                <Typography variant='caption' sx={{
                  pb: 2, color: '#5f5e5a', display: 'block',
                }}>
                  Optional — helps shoppers find your listing
                  and powers the AI history blurb.
                </Typography>
                <TextField label='Player' fullWidth
                  value={player}
                  onChange={(e) => setPlayer(e.target.value)}
                  placeholder='e.g. Zinedine Zidane'
                  slotProps={{htmlInput: {
                    'aria-label': 'player', 'list': 'players-list',
                  }}}
                  sx={{pb: 2}}
                />
                <datalist id='players-list'>
                  {players.map((p) => <option key={p} value={p} />)}
                </datalist>
                <TextField label='Club' fullWidth
                  value={club}
                  onChange={(e) => setClub(e.target.value)}
                  placeholder='e.g. Real Madrid'
                  slotProps={{htmlInput: {
                    'aria-label': 'club', 'list': 'clubs-list',
                  }}}
                  sx={{pb: 2}}
                />
                <datalist id='clubs-list'>
                  {clubs.map((c) => <option key={c} value={c} />)}
                </datalist>
                <TextField label='Season' fullWidth
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  placeholder='e.g. 2001-02'
                  slotProps={{htmlInput: {'aria-label': 'season'}}}
                  sx={{pb: 2}}
                />
                <TextField label='Competition' fullWidth
                  value={competition}
                  onChange={(e) => setCompetition(e.target.value)}
                  placeholder='e.g. UEFA Champions League'
                  slotProps={{htmlInput: {'aria-label': 'competition'}}}
                />
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
