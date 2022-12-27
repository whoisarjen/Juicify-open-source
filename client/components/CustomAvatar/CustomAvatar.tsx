import Avatar from '@mui/material/Avatar';

interface CustomAvatarProps {
    src?: string | null
    size?: string
    margin?: string
}

const CustomAvatar = ({
    src,
    size = '110px',
    margin = 'auto'
}: CustomAvatarProps) => {
    if (!src) {
        return (
            <Avatar
                data-testid="default_logo"
                sx={{ background: 'none !important', width: size, height: size, margin }}
                src='/images/logo.png'
            />
        )
    }

    return (
        <Avatar
            data-testid="user_logo"
            sx={{ background: 'none !important', width: size, height: size, margin }}
            src={src}
        >
            <Avatar
                data-testid="default_logo"
                sx={{ background: 'none !important', width: size, height: size, margin }}
                src='/images/logo.png'
            />
        </Avatar>
    )
}

export default CustomAvatar;