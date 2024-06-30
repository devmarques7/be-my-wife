import { ReactNode } from "react";
import { ColorModeContext, useMode } from "./theme";
import { ThemeProvider } from "@mui/material";
import GlobalStyles from "../style/styledGlobal";

interface AppThemeProviderProps {
  children: ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <GlobalStyles theme={theme}/>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
