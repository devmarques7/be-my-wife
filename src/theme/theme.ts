import { createTheme } from "@mui/material/styles";
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
    dark: string;
    light: string;
}

export const tokens = (mode: CustomPaletteMode["mode"]): ThemeTokens => ({
    ...(mode === "dark"
    ?{
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

    } : {
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
          },
       
    })
})


// Interface para as configurações do tema
export interface ThemeSettings {
  palette: {
    mode: CustomPaletteMode["mode"];
    primary: {
      main: string;
    };
    secondary: {
      main: string;
    };
    green: {
      main: string;
    };
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    h1: {
      fontFamily: string;
      fontSize: number;
    };
    h2: {
      fontFamily: string;
      fontSize: number;
    };
    h3: {
      fontFamily: string;
      fontSize: number;
    };
    h4: {
      fontFamily: string;
      fontSize: number;
    };
    h5: {
      fontFamily: string;
      fontSize: number;
    };
    h6: {
      fontFamily: string;
      fontSize: number;
    };
    p: {
      fontFamily: string;
      fontSize: number;
    };
    span: {
      fontFamily: string;
      fontSize: number;
    };
  };
}

export const themeSettings = (mode: CustomPaletteMode["mode"]): ThemeSettings => {
    const colors = tokens(mode);

    return {
        palette: {
            mode: mode,
            ...(mode === 'dark'
                ? {
                    primary: {
                        main: colors.primary[500],
                    },
                    secondary: {
                        main: colors.secondary[500],
                    },
                    green: {
                        main: colors.secondary[500],
                    },
                } : {
                    primary: {
                        main: colors.primary[500],
                    },
                    secondary: {
                        main: colors.secondary[500],
                    },
                    green: {
                        main: colors.secondary[500],
                    },
                }),
        },
        typography: {
            fontFamily: ["Noto Sans", "sans-serif"].join(","),
            fontSize: 12,
            h1: {
                fontFamily: ["Noto Sans", "sans-serif"].join(","),
                fontSize: 35,
            },
            h2: {
                fontFamily: ["Noto Sans", "sans-serif"].join(","),
                fontSize: 32,
            },
            h3: {
                fontFamily: ["Noto Sans", "sans-serif"].join(","),
                fontSize: 24,
            },
            h4: {
                fontFamily: ["Noto Sans", "sans-serif"].join(","),
                fontSize: 20,
            },
            h5: {
                fontFamily: ["Noto Sans", "sans-serif"].join(","),
                fontSize: 18,
            },
            h6: {
                fontFamily: ["Noto Sans", "sans-serif"].join(","),
                fontSize: 16,
            },
            p: {
                fontFamily: ["Noto Sans", "sans-serif"].join(","),
                fontSize: 15,
            },
            span: {
                fontFamily: ["Noto Sans", "sans-serif"].join(","),
                fontSize: 15,
            }
        },
    }
}

// Interface para o contexto de modo de cor
interface ColorModeContextType {
    toggleColorMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextType>({
    toggleColorMode: () => {}
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