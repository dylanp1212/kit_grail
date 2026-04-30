import { Box, Toolbar } from "@mui/material";
import Header from "./Header";
import { CssBaseline } from "@mui/material";
import ItemList from "./ItemList";

export default function Home() {
  return (
    <Box>
      <CssBaseline />
      <Box>
        <Header />
      </Box>

      {/* Adds an offset for the Header */}
      <Toolbar />

      {/* List of card items */}
      <Box>
        <ItemList />
      </Box>
    </Box>
  );
}