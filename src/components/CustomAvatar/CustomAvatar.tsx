import Avatar from '@mui/material/Avatar';

interface CustomAvatarProps {
    src?: string | null
    username?: string
    size?: string
    margin?: string
}

const CustomAvatar = ({
    src,
    username,
    size = '128px',
    margin = 'auto'
}: CustomAvatarProps) => {
    if (!src) {
        return (
            <Avatar
                data-testid="default_logo"
                sx={{ background: 'none !important', width: size, height: size, margin }}
                alt={`${username} on Juicify.app`}
                src='/images/logo.png'
            />
        )
    }

    return (
        <Avatar
            data-testid="user_logo"
            sx={{ background: 'none !important', width: size, height: size, margin }}
            alt={`${username} on Juicify.app`}
            src={src}
        >
            <Avatar
                data-testid="default_logo"
                sx={{ background: 'none !important', width: size, height: size, margin }}
                alt={`${username} on Juicify.app`}
                src='/images/logo.png'
            />
        </Avatar>
    )
}

export default CustomAvatar;