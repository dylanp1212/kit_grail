import { Box } from "@mui/material";
import Header from "./Header";
import { CssBaseline } from "@mui/material";

export default function Home() {
  return (
    <Box>
      <CssBaseline />
      <Box>
        <Header />
      </Box>

      {/* List of card items */}
      <Box>Real</Box>
    </Box>
  );
}