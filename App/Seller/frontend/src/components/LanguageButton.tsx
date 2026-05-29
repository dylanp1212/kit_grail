import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Language from '@mui/icons-material/Language';
import Check from '@mui/icons-material/Check';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import i18n from '../i18n';

const LANGUAGES = [
  {code: 'en', label: 'English', flag: '🇺🇸'},
  {code: 'sp', label: 'Español', flag: '🇪🇸'},
];

const setLocaleCookie = (code: string) => {
  document.cookie = `locale=${code}; path=/`;
};

export const LanguageButton = () => {
  const {t} = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const handleSelect = (code: string) => {
    setAnchor(null);
    setLocaleCookie(code);
    i18n.changeLanguage(code);
  };

  return (
    <>
      <ListItem>
        <ListItemButton onClick={(e) => setAnchor(e.currentTarget)}>
          <ListItemIcon>
            <Language />
          </ListItemIcon>
          <ListItemText primary={t('language')}/>
        </ListItemButton>
      </ListItem>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
      >
        {LANGUAGES.map(({code, label, flag}) => (
          <MenuItem
            key={code}
            onClick={() => handleSelect(code)}
            sx={{gap: 1, minWidth: 160}}
          >
            {i18n.language === code ?
              <Check fontSize='small' /> :
              <Box sx={{width: 20}} />
            }
            {flag}&nbsp;&nbsp;<span>{label}</span>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
