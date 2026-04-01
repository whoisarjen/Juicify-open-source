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
    margin = 'auto',
}: CustomAvatarProps) => {
    const style = { width: size, height: size, margin }
    const alt = `${username} on Juicify.app`

    const fallback = (
        <img
            data-testid="default_logo"
            className="rounded-full object-cover"
            style={style}
            alt={alt}
            src="/images/logo.png"
        />
    )

    if (!src) {
        return fallback
    }

    return (
        <img
            data-testid="user_logo"
            className="rounded-full object-cover"
            style={style}
            alt={alt}
            src={src}
            onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = '/images/logo.png'
            }}
        />
    )
}

export default CustomAvatar
