import { createTheme, ThemeOptions } from "@mui/material/styles"; 
import { createContext, useMemo, useState } from "react";

// Definição das cores customizadas
interface ColorTokens {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

interface ThemeTokens {
  primary: ColorTokens;
  secondary: ColorTokens;
  green: ColorTokens; // Cor verde
}

interface CustomPaletteMode {
  mode: "dark" | "light"; // Modificado para corresponder à definição esperada
}

export const tokens = (mode: CustomPaletteMode["mode"]): ThemeTokens => ({
  ...(mode === "dark"
    ? {
        primary: {
          100: "#323232",
          200: "#636464",
          300: "#959596",
          400: "#c6c7c8",
          500: "#f8f9fa",
          600: "#f9fafb",
          700: "#fbfbfc",
          800: "#fcfdfd",
          900: "#fefefe",
        },
        secondary: {
          100: "#020202",
          200: "#040403",
          300: "#060505",
          400: "#080706",
          500: "#0a0908",
          600: "#3b3a39",
          700: "#6c6b6b",
          800: "#9d9d9c",
          900: "#cecece",
        },
        green: {
          100: "#080d08",
          200: "#0f1a10",
          300: "#172617",
          400: "#1e331f",
          500: "#264027",
          600: "#516652",
          700: "#7d8c7d",
          800: "#a8b3a9",
          900: "#d4d9d4",
        }
      }
    : {
        primary: {
          100: "#fefefe",
          200: "#fcfdfd",
          300: "#fbfbfc",
          400: "#f9fafb",
          500: "#f8f9fa",
          600: "#c6c7c8",
          700: "#959596",
          800: "#636464",
          900: "#323232"
        },
        secondary: {
          100: "#cecece",
          200: "#9d9d9c",
          300: "#6c6b6b",
          400: "#3b3a39",
          500: "#0a0908",
          600: "#080706",
          700: "#060505",
          800: "#040403",
          900: "#020202"
        },
        green: {
          100: "#d4d9d4",
          200: "#a8b3a9",
          300: "#7d8c7d",
          400: "#516652",
          500: "#264027",
          600: "#1e331f",
          700: "#172617",
          800: "#0f1a10",
          900: "#080d08"
        }
      })
});

// Interface para as configurações do tema
export interface ThemeSettings extends ThemeOptions {
  palette: {
    mode: CustomPaletteMode["mode"];
    primary: {
      dark: string;
      main: string;
      light: string;
    };
    secondary: {
      dark: string;
      main: string;
      light: string;
    };
    green: {
      dark: string;
      main: string;
      light: string;
    };
    background: {
      default: string;
    };
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    h1: {
        fontFamily: string;
        fontSize: number;
        fontWeight:number;
        lineHeight: number;
    };
    h2: {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
}
    h3: {
      fontFamily: string;
      fontSize: number;
      fontWeight: number;
      lineHeight: number;
  }
    h4: {
      fontFamily: string;
      fontSize: number;
      fontWeight: number;
      lineHeight: number;
  }
    h5: {
      fontFamily: string;
      fontSize: number;
      fontWeight: number;
      lineHeight: number;
  }
    h6: {
      fontFamily: string;
      fontSize: number;
      fontWeight: number;
      lineHeight: number;
  }
    p: {
      fontFamily: string;
      fontSize: number;
      fontWeight: number;
      lineHeight: number;
  }
    span: {
      fontFamily: string;
      fontSize: number;
      fontWeight: number;
      lineHeight: number;
  }
}
  breakpoints: {
    values: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  };
}
//"Shadows Into Light", cursive;
const fontFamily = ["Shadows Into Light", "cursive"].join(",");

export const themeSettings = (mode: CustomPaletteMode["mode"]): ThemeSettings => {
  const colors = tokens(mode);

  return {
    palette: {
      mode: mode,
      ...(mode === 'dark'
        ? {
            primary: {
              dark: colors.primary[700],
              main: colors.primary[500],
              light: colors.primary[100]
            },
            secondary: {
              dark: colors.secondary[700],
              main: colors.secondary[500],
              light: colors.secondary[100]
            },
            green: {
              dark: colors.green[700],
              main: colors.green[500],
              light: colors.green[100]
            },
            background: {
              default: colors.primary[500],
            }
          }
        : {
            primary: {
              dark: colors.primary[700],
              main: colors.primary[500],
              light: colors.primary[100]
            },
            secondary: {
              dark: colors.secondary[700],
              main: colors.secondary[500],
              light: colors.secondary[100]
            },
            green: {
              dark: colors.green[700],
              main: colors.green[500],
              light: colors.green[100]
            },
            background: {
              default: colors.primary[500],
            }
          }),
    },
    typography: {
      fontFamily: fontFamily,
      fontSize: 14, // Base font size
      h1: {
        fontFamily: fontFamily,
        fontSize: 48,
        fontWeight: 700, // Bold
        lineHeight: 1.2, // Line height for better readability
      },
      h2: {
        fontFamily: fontFamily,
        fontSize: 40,
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontFamily: fontFamily,
        fontSize: 36,
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h4: {
        fontFamily: fontFamily,
        fontSize: 30,
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h5: {
        fontFamily: fontFamily,
        fontSize: 24,
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h6: {
        fontFamily: fontFamily,
        fontSize: 22,
        fontWeight: 400,
        lineHeight: 1.5,
      },
      p: {
        fontFamily: fontFamily,
        fontSize: 20,
        fontWeight: 400,
        lineHeight: 1.6,
      },
      span: {
        fontFamily: fontFamily,
        fontSize: 20,
        fontWeight: 400,
        lineHeight: 1.5,
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  };
};


// Interface para o contexto de modo de cor
interface ColorModeContextType {
  toggleColorMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
});

export const useMode = (): [ReturnType<typeof createTheme>, ColorModeContextType] => {
  const [mode, setMode] = useState<CustomPaletteMode["mode"]>("light");

  const colorMode: ColorModeContextType = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev: CustomPaletteMode["mode"]) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};
