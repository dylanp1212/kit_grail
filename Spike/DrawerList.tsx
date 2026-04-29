import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonIcon from '@mui/icons-material/Person';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import HelpIcon from '@mui/icons-material/Help';

/* Items to add to list

- member profile (with picture)
- shop
- wishlist
- my orders
- profile
<divider>
- offers made
- help and support
<divider space big>

- sign out*/

export default function DrawerList() {
    return (
          <Box sx={{width: 250}} role="presentation">
          <List>
                <ListItemButton>
                  <StorefrontIcon />
                  <ListItemText primary="Shop"/>
                </ListItemButton>
                <ListItemButton>
                  <FavoriteIcon />
                  <ListItemText primary="Wishlist"/>
                </ListItemButton>
                <ListItemButton>
                  <ReceiptLongIcon />
                  <ListItemText primary="My Orders"/>
                </ListItemButton>
                 <ListItemButton>
                  <PersonIcon />
                  <ListItemText primary="Profile"/>
                </ListItemButton>
                <Divider />
                <ListItemButton>
                    <LocalOfferIcon />
                  <ListItemText primary="Offers Made"/>
                </ListItemButton>
                <ListItemButton>
                    <HelpIcon />
                    <ListItemText primary="Help and Support"/>
                    </ListItemButton>
          </List>
        </Box>
    );
}