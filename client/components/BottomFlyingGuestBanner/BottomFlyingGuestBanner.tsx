import Button from '@mui/material/Button';
import styled from 'styled-components'
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import CustomAvatar from '../CustomAvatar/CustomAvatar';

const Placeholder = styled.div`
    height: 36.5px;
    width: 100%;
`

interface BottomFlyingGuestBannerProps {
    src?: string | null
    username: string
}

const BottomFlyingGuestBanner = ({ src, username }: BottomFlyingGuestBannerProps) => {
    const router = useRouter()
    const { t } = useTranslation()

    if (!username) {
        return null
    }

    return (
        <>
            <Placeholder />
            <Button
                data-testid="BottomFlyingGuestBanner"
                onClick={() => router.push(`/${router.query.login}`)}
                sx={{
                    maxWidth: 700,
                    position: 'fixed',
                    bottom: 52,
                    width: 'calc( 100% - 24px )'
                }}
                variant="contained"
                startIcon={<CustomAvatar
                    src={src}
                    username={username}
                    size="24px"
                />}
            >
                {t('WATCHING')} {username}
            </Button>
        </>
    )
}

export default BottomFlyingGuestBanner;