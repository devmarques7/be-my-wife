import { AppThemeProvider } from "./theme/themeProvider";
import AppContextProvider from "./context/AppContext";
import Layout from "./layout/Layout";

function App() {
  return (
    <AppThemeProvider>
      <AppContextProvider>
        <Layout />
      </AppContextProvider>
    </AppThemeProvider>
  );
}

export default App;
