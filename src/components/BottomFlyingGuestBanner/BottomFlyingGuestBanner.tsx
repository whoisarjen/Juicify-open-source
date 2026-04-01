import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import CustomAvatar from '../CustomAvatar/CustomAvatar';

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
            <div className="w-full h-9" />
            <button
                data-testid="BottomFlyingGuestBanner"
                onClick={() => router.push(`/${router.query.login}`)}
                className="fixed bottom-[52px] flex w-[calc(100%-24px)] max-w-[700px] items-center justify-center gap-2 rounded bg-primary-dark px-4 py-2 text-[#121212] hover:bg-[#64b5f6] disabled:opacity-50"
            >
                <CustomAvatar
                    src={src}
                    username={username}
                    size="24px"
                />
                {t('WATCHING')} {username}
            </button>
        </>
    )
}

export default BottomFlyingGuestBanner;