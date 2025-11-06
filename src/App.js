import React from "react";
import { CssBaseline, Container } from "@mui/material";
import RestaurantWineManager from "./RestaurantWineManager";

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <RestaurantWineManager />
      </Container>
    </>
  );
}

export default App;
