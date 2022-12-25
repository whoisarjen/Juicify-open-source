import Avatar from '@mui/material/Avatar';

interface CustomAvatarProps {
    id?: string
    username: string
    size?: string
    margin?: string
}

const CustomAvatar = ({
    id,
    username,
    size = '110px',
    margin = 'auto'
}: CustomAvatarProps) => (
    <Avatar
        data-testid="user_logo"
        sx={{ background: 'none !important', width: size, height: size, margin }}
        alt={`${username} on Juicify`}
        src={`${process.env.SERVER}/avatar/${id}.jpg`}
    >
        <Avatar
            data-testid="default_logo"
            sx={{ background: 'none !important', width: size, height: size, margin }}
            alt={`${username} on Juicify`}
            src='/images/logo.png'
        />
    </Avatar>
)

export default CustomAvatar;