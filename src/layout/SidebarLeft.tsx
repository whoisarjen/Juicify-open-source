import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import SchoolIcon from '@mui/icons-material/School'
import BookIcon from '@mui/icons-material/Book'
import { useRouter } from 'next/router'
import Settings from '@mui/icons-material/Settings'
import useTranslation from 'next-translate/useTranslation'
import CustomAvatar from '@/components/CustomAvatar/CustomAvatar'
import moment from 'moment'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import LogoutIcon from '@mui/icons-material/Logout'
import { useSession, signIn } from 'next-auth/react'
import Divider from '@mui/material/Divider'
import NoteAltIcon from '@mui/icons-material/NoteAlt'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import { type Translate } from 'next-translate'
import { type Session } from 'next-auth'
import { handleSignOut } from '@/utils/user.utils'
import FastfoodIcon from '@mui/icons-material/Fastfood';

const getRouterPushOptions = (sessionData: Session | null, t: Translate) => {
    const username = sessionData?.user?.username

    return {
        profile: {
            link: `/${username}`,
            text: t('Profile'),
            children: (
                <CustomAvatar
                    src={sessionData?.user?.image}
                    username={username}
                    size="28px"
                    margin="auto auto auto 0"
                />
            ),
        },
        blog: {
            link: `/blog`,
            text: t('Blog'),
            children: <SchoolIcon color="primary" />,
        },
        // products: {
        //     link: `/products`,
        //     text: t('PRODUCTS'),
        //     children: <FastfoodIcon color="primary" />,
        // },
        diary: {
            link: `/${username}/consumed/${moment().format('YYYY-MM-DD')}`,
            text: t('Diary'),
            children: <BookIcon color="primary" />,
        },
        barcode: {
            link: `/barcode`,
            text: t('Barcode'),
            children: <PhotoCameraIcon color="primary" />,
        },
        measurements: {
            link: `/measurements`,
            text: t('Measurements'),
            children: <EmojiEventsIcon color="primary" />,
        },
        results: {
            link: `/${username}/workout/results`,
            text: t('WORKOUT_RESULTS'),
            children: <FitnessCenterIcon color="primary" />,
        },
        plans: {
            link: `/${username}/workout/plans`,
            text: t('WORKOUT_PLANS'),
            children: <NoteAltIcon color="primary" />,
        },
        coach: {
            link: `/coach`,
            text: t('Coach'),
            children: <SmartToyIcon color="primary" />,
        },
    }
}

const SidebarLeft = () => {
    const router = useRouter()
    const { t } = useTranslation('home')
    const { data: sessionData } = useSession()

    return (
        <Box
            sx={{
                width: '100%',
                bgcolor: 'background.paper',
                position: 'sticky',
                top: 0,
            }}
        >
            <nav>
                <List>
                    {Object.keys(getRouterPushOptions(sessionData, t)).map(
                        (key) => {
                            const { link, children, text } =
                                getRouterPushOptions(sessionData, t)[key]

                            return (
                                <ListItem disablePadding key={key}>
                                    <ListItemButton
                                        onClick={() =>
                                            sessionData?.user
                                                ? router.push(link)
                                                : signIn()
                                        }
                                    >
                                        <ListItemIcon>{children}</ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItemButton>
                                </ListItem>
                            )
                        }
                    )}
                    <Divider />
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => router.push('/settings')}
                        >
                            <ListItemIcon>
                                <Settings color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={t('Settings')} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() =>
                                sessionData ? handleSignOut() : signIn()
                            }
                        >
                            <ListItemIcon>
                                <LogoutIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                                primary={sessionData ? t('LOGOUT') : t('LOGIN')}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </nav>
        </Box>
    )
}

export default SidebarLeft
