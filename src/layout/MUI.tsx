import {
    createTheme,
    ThemeProvider as ThemeProviderMUI,
} from '@mui/material/styles'
import { useState, useEffect, useMemo } from 'react'

const MUI = ({ children }: { children: any }) => {
    const [mode, setMode]: any = useState('dark')

    const theme = useMemo(() => createTheme({
        typography: {
            fontFamily: 'Quicksand, sans-serif',
        },
        palette: {
            mode,
        },
    }), [mode])

    useEffect(
        () =>
            setMode(
                localStorage.getItem('isDarkMode') ||
                    localStorage.getItem('isDarkMode') === null
                    ? 'dark'
                    : 'light'
            ),
        []
    )

    useEffect(
        () =>
            document.documentElement.style.setProperty(
                '--theme-background',
                mode == 'dark' ? '#121212' : '#ffffff'
            ),
        [mode]
    )

    return <ThemeProviderMUI theme={theme}>{children}</ThemeProviderMUI>
}

export default MUI
