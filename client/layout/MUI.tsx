import { createTheme, ThemeProvider as ThemeProviderMUI } from "@mui/material/styles";
import { useState, useMemo, useEffect } from "react";
import { ColorModeContext } from '../hooks/useTheme'

const MUI = ({ children }: { children: any }) => {
    const [mode, setMode]: any = useState('dark')

    const theme = createTheme({
        typography: {
            fontFamily: "Quicksand, sans-serif",
        },
        palette: {
            mode,
        },
    });

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode: string) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    useEffect(() => setMode(localStorage.getItem('isDarkMode') || localStorage.getItem('isDarkMode') === null ? 'dark' : 'light'), [])

    useEffect(() => document.documentElement.style.setProperty('--theme-background', mode == 'dark' ? '#121212' : '#ffffff'), [mode])

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProviderMUI theme={theme}>
                {children}
            </ThemeProviderMUI>
        </ColorModeContext.Provider>
    )
}

export default MUI
