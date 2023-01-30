import ListSubheader from '@mui/material/ListSubheader';
import { trpc } from "@/utils/trpc.utils"
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useRouter } from "next/router";
import CustomAvatar from "../CustomAvatar/CustomAvatar";
import useTranslation from 'next-translate/useTranslation';

export const LastJoinedUsersList = () => {
    const router = useRouter()
    const { t } = useTranslation('home')
    const { data: users = [] } = trpc.user.getAll.useQuery({ take: 10 })

    return (
        <List
            sx={{
                width: '100%',
                bgcolor: 'background.paper'
            }}
            subheader={
                <ListSubheader component='div' id='nested-list-subheader'>
                    {t('LAST_JOINED')}: 
                </ListSubheader>
            }
        >
            {users.map(({ id, name, username, image }) =>
                <ListItemButton key={id} onClick={() => router.push(`/${username}`)}>
                    <ListItemIcon>
                        <CustomAvatar
                            src={image}
                            username={username}
                            size="28px"
                            margin="auto auto auto 0"
                        />
                    </ListItemIcon>
                    <ListItemText primary={name || '-'} />
                </ListItemButton>
            )}
        </List>
    )
}
