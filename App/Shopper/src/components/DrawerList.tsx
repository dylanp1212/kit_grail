'use client'

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LanguageIcon from '@mui/icons-material/Language';
import CheckIcon from '@mui/icons-material/Check';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SignoutButton from './SignoutButton';
import ProfileCard from './ProfileCard';
import {useRouter} from 'next/navigation';
import {useTranslations, useLocale} from 'next-intl';
import {setLocale} from '../i18n/actions';
import {useState, useEffect, MouseEvent} from 'react';

const iconSx = { color: '#42493e', minWidth: 40 };
const btnSx = { borderRadius: '4px', '&:hover': { bgcolor: '#eeeeea' } };
const textSlotProps = { primary: { sx: { fontFamily: '"Work Sans", sans-serif', color: '#1a1c1a', fontSize: '0.9375rem' } } };

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'sp', label: 'Español', flag: '🇪🇸' },
]

export default function DrawerList() {
  const router = useRouter();
  const t = useTranslations('Drawer');
  const locale = useLocale();
  const [langAnchor, setLangAnchor] = useState<HTMLElement | null>(null);
  return (
    <Box sx={{ width: 250 }} role="presentation">
      <ProfileCard />
      <List sx={{ p: 1 }}>
        <ListItemButton sx={btnSx} onClick={() => { router.push('/listings'); }}>
          <ListItemIcon sx={iconSx}><StorefrontIcon /></ListItemIcon>
          <ListItemText primary={t('shop')} slotProps={textSlotProps} />
        </ListItemButton>
        <ListItemButton sx={btnSx} onClick={() => {router.push('/wishlist')}}>
          <ListItemIcon sx={iconSx}><FavoriteIcon /></ListItemIcon>
          <ListItemText primary={t('wishlist')} slotProps={textSlotProps} />
        </ListItemButton>
        <ListItemButton sx={btnSx} onClick={() => { router.push('/orders'); }}>
          <ListItemIcon sx={iconSx}><ReceiptLongIcon /></ListItemIcon>
          <ListItemText primary={t('orders')} slotProps={textSlotProps} />
        </ListItemButton>
        <Divider sx={{ my: 1, borderColor: '#c2c9bb' }} />
        <ListItemButton sx={btnSx} onClick={(e: MouseEvent<HTMLElement>) => setLangAnchor(e.currentTarget)}>
          <ListItemIcon sx={iconSx}><LanguageIcon /></ListItemIcon>
          <ListItemText primary={t('language')} slotProps={textSlotProps} />
        </ListItemButton>
        <Menu anchorEl={langAnchor} open={Boolean(langAnchor)} onClose={() => setLangAnchor(null)}>
          {LANGUAGES.map(({ code, label, flag }) => (
            <MenuItem key={code} onClick={async () => { setLangAnchor(null); await setLocale(code); }}
              sx={{ gap: 1, minWidth: 160 }}>
              {code === locale ? <CheckIcon fontSize="small" /> : <Box sx={{ width: 20 }} />}
              {flag}&nbsp;&nbsp;{label}
            </MenuItem>
          ))}
        </Menu>
        <Divider sx={{ my: 2, visibility: 'hidden' }} />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <SignoutButton />
        </Box>
      </List>
    </Box>
  );
}
