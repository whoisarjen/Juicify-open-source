import { createContext, useContext } from "react";
import { useTheme as useThemeDefault } from '@mui/material/styles';

const THEME_VALUE: any = {
    LIGHT: {
        PRIMARY: '#1976d2'
    },
    DARK: {
        PRIMARY: '#90caf9'
    }
}

const ColorModeContext = createContext({ toggleColorMode: () => { } });

const useTheme = () => {
    const theme: any = useThemeDefault();
    const colorMode = useContext(ColorModeContext);

    const toggleDarkMode = () => {
        if (theme.palette.mode === 'dark') {
            localStorage.setItem('isDarkMode', JSON.stringify(false))
        } else {
            localStorage.setItem('isDarkMode', JSON.stringify(true))
        }
        colorMode.toggleColorMode()
    }

    const getTheme = (what: string) => THEME_VALUE[theme.palette.mode.toUpperCase() || 'DARK'][what]

    return { getTheme, toggleDarkMode, theme }
}

export {
    useTheme,
    ColorModeContext
}