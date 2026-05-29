import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import Home from '@mui/icons-material/Home';
import Inventory from '@mui/icons-material/Inventory';
import LocalShipping from '@mui/icons-material/LocalShipping';
import PostAdd from '@mui/icons-material/PostAdd';
import VpnKey from '@mui/icons-material/VpnKey';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import Logout from '@mui/icons-material/Logout';
import Language from '@mui/icons-material/Language';
import Check from '@mui/icons-material/Check';

import {signOut} from '../auth';
import i18n from '../i18n';
import '../global.css';

const LANGUAGES = [
  {code: 'en', label: 'English', flag: '🇺🇸'},
  {code: 'sp', label: 'Español', flag: '🇪🇸'},
];

export const Sidebar = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [langAnchor, setLangAnchor] = useState<HTMLElement | null>(null);
  const handleSignOut = async () => {
    await signOut();
    navigate('/login', {replace: true});
  };
  const SidebarDrawer = (
    <Box sx={{width: 250}} role='presentation' aria-label='sidebar menu'>
      <List>
        <ListItem sx={{ml: 2}}>
          {/* <ListItemText primary='Kit Grail'/> */}
          <Typography variant='h5'>Kit Grail</Typography>
        </ListItem>

        <Divider />

        <Link to='/' style={{textDecoration: 'none', color: 'inherit'}}>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary={t('dashboard')}/>
            </ListItemButton>
          </ListItem>
        </Link>

        <Link
          to='/inventory'
          style={{textDecoration: 'none', color: 'inherit'}}>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <Inventory />
              </ListItemIcon>
              <ListItemText primary={t('inventory')}/>
            </ListItemButton>
          </ListItem>
        </Link>

        <Link
          to='/orders'
          style={{textDecoration: 'none', color: 'inherit'}}>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <LocalShipping />
              </ListItemIcon>
              <ListItemText primary={t('orders')}/>
            </ListItemButton>
          </ListItem>
        </Link>

        <Link
          to='/new'
          style={{textDecoration: 'none', color: 'inherit'}}>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <PostAdd />
              </ListItemIcon>
              <ListItemText primary={t('newListing')}/>
            </ListItemButton>
          </ListItem>
        </Link>

        <Link
          to='/account/keys'
          style={{textDecoration: 'none', color: 'inherit'}}>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <VpnKey />
              </ListItemIcon>
              <ListItemText primary={t('apiKeys')}/>
            </ListItemButton>
          </ListItem>
        </Link>

        <ListItem>
          <ListItemButton onClick={(e) => setLangAnchor(e.currentTarget)}>
            <ListItemIcon>
              <Language />
            </ListItemIcon>
            <ListItemText primary={t('language')}/>
          </ListItemButton>
        </ListItem>
        <Menu anchorEl={langAnchor} open={Boolean(langAnchor)} onClose={() => setLangAnchor(null)}>
          {LANGUAGES.map(({code, label, flag}) => (
            <MenuItem key={code} onClick={() => { setLangAnchor(null); document.cookie = `locale=${code}; path=/`; i18n.changeLanguage(code); }}
              sx={{gap: 1, minWidth: 160}}>
              {i18n.language === code ? <Check fontSize='small' /> : <Box sx={{width: 20}} />}
              {flag}&nbsp;&nbsp;{label}
            </MenuItem>
          ))}
        </Menu>

        <ListItem>
          <ListItemButton onClick={handleSignOut}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary={t('signOut')}/>
          </ListItemButton>
        </ListItem>

      </List>
    </Box>
  );

  return (
    <Drawer
      variant='permanent'
      sx={{
        'width': 250,
        'flexShrink': 0,
        '& .MuiDrawer-paper': {
          'width': 250,
          'position': 'relative',
          'bgcolor': '#154212',
          'color': '#eeebe5',
          'border': 'none',
          'overflowX': 'hidden',
          '& .MuiListItemIcon-root': {
            color: '#eeebe5',
          },
        },
      }}
    >
      {SidebarDrawer}
    </Drawer>
  );
};
