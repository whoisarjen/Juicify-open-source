import { useTheme } from '@/hooks/useTheme';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { IconButton } from '@mui/material';
import { useRouter } from "next/router";
import BetterLink from '../BetterLink/BetterLink';

export const ButtonToggleDarkMode = () => {
    const router = useRouter()
    const { toggleDarkMode, theme } = useTheme()

    return (
        <BetterLink href={`${router.asPath}`}>
            <IconButton color="primary" aria-label="Dark / light mode" onClick={toggleDarkMode}>
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
        </BetterLink>
    )
}
