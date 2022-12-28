import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import BookIcon from "@mui/icons-material/Book";
import { useRouter } from "next/router";
import Settings from "@mui/icons-material/Settings";
import useTranslation from "next-translate/useTranslation";
import styled from 'styled-components'
import CustomAvatar from '@/components/CustomAvatar/CustomAvatar';
import moment from 'moment';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSession, signIn, signOut } from "next-auth/react"
import Divider from '@mui/material/Divider';
import NoteAltIcon from '@mui/icons-material/NoteAlt'

const Grid = styled.aside`
    padding: 12px;
    margin-left: auto;
    margin-right: 0;
    width: 100%;
    max-width: 200px;
    @media(max-width: 1468px) {
        display: none;
    }
`

const getRouterPushOptions = (username: string) => ({
    profile: `/${username}`,
    diary: `/${username}/consumed/${moment().format('YYYY-MM-DD')}`,
    measurements: `/measurements`,
    results: `/${username}/workout/results`,
    plans: `/${username}/workout/plans`,
    coach: `/coach`,
    settings: `/settings`,
    blog: `/blog`,
})

const SidebarLeft = () => {
    const router = useRouter()
    const { t } = useTranslation('home')
    const { data: sessionData } = useSession()

    const handleRouter = (where: keyof ReturnType<typeof getRouterPushOptions>) => () => {
        if (!sessionData?.user) {
            return signIn()
        }

        router.push(getRouterPushOptions(sessionData.user.username)[where])
    }

    return (
        <Grid>
            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <nav>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleRouter("profile")}>
                                <ListItemIcon>
                                    <CustomAvatar
                                        src={sessionData?.user?.image}
                                        username={sessionData?.user?.username}
                                        size="28px"
                                        margin="auto auto auto 0"
                                    />
                                </ListItemIcon>
                                <ListItemText primary="Profile" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleRouter('diary')}>
                                <ListItemIcon>
                                    <BookIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={t('Diary')} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleRouter('measurements')}>
                                <ListItemIcon>
                                    <EmojiEventsIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={t('Measurements')} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleRouter('results')}>
                                <ListItemIcon>
                                    <FitnessCenterIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={t('WORKOUT_RESULTS')} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleRouter('plans')}>
                                <ListItemIcon>
                                    <NoteAltIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={t('WORKOUT_PLANS')} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleRouter('coach')}>
                                <ListItemIcon>
                                    <SmartToyIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={t('Coach')} />
                            </ListItemButton>
                        </ListItem>
                        {/* <ListItem disablePadding>
                                <ListItemButton onClick={handleRouter('blog')}>
                                    <ListItemIcon>
                                        <SchoolIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary={t('Blog')} />
                                </ListItemButton>
                            </ListItem> */}
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleRouter('settings')}>
                                <ListItemIcon>
                                    <Settings color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={t('Settings')} />
                            </ListItemButton>
                        </ListItem>
                        <Divider />
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => sessionData ? signOut({ callbackUrl: '/', redirect: true }) : signIn()}>
                                <ListItemIcon>
                                    <LogoutIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={sessionData ? t('Logout') : t('Login')} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </nav>
            </Box>
        </Grid>
    )
}

export default SidebarLeft;