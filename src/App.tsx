import Dashboard from "./components/Dashboard";
import { Box } from "@mui/material";

function App() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        bgcolor: "#f5f5f5",
        overflowY: "auto",
      }}
    >
      <Dashboard />
    </Box>
  );
}

export default App;
