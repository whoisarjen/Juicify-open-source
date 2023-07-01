import ListSubheader from '@mui/material/ListSubheader';
import { trpc } from "@/utils/trpc.utils"
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useRouter } from "next/router";
import CustomAvatar from "../CustomAvatar/CustomAvatar";
import useTranslation from 'next-translate/useTranslation';
import slugify from 'slugify';

export const SidebarRightBlogList = () => {
    const router = useRouter()
    const { data: posts } = trpc.post.getAll.useQuery({ take: 3 })

    return (
        <List
            sx={{
                width: '100%',
                bgcolor: 'background.paper'
            }}
            subheader={
                <ListSubheader component='div' id='nested-list-subheader'>
                    Blog: 
                </ListSubheader>
            }
        >
            {posts?.data.map((post: any) =>
                <ListItemButton key={post.id} onClick={() => router.push(`/blog/${slugify(post.attributes.title, { lower: true, strict: true })}-${post.id}`)}>
                    {/* <ListItemIcon>
                        <CustomAvatar
                            src={`${post.attributes.thumbnail.data
                                ? `${env.NEXT_PUBLIC_STRAPI_URL}${post.attributes.thumbnail.data?.attributes.formats.large.url}`
                                : '/images/logo.png'
                            }`}
                            username={post.attributes.title}
                            size="28px"
                            margin="auto auto auto 0"
                        />
                    </ListItemIcon> */}
                    <ListItemText
                        className='line-clamp-2'
                        primary={post.attributes.title}
                    />
                </ListItemButton>
            )}
        </List>
    )
}

export const LastJoinedUsersList = () => {
    const router = useRouter()
    const { t } = useTranslation('home')
    const { data: users = [] } = trpc.user.getAll.useQuery({ take: 10 })

    return (
        <div className="flex flex-col max-w-xs">
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

                {SidebarRightBlogList()}
            </List>
        </div>
    )
}
