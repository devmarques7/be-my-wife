import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppContextProvider } from "./context/AppContext";
import { ColorModeContext, useMode } from "./theme/theme";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <AppContextProvider>
          <CssBaseline />
        </AppContextProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
