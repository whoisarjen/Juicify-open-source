import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import BookIcon from '@mui/icons-material/Book'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'
import moment from 'moment'
import IconButton from '@mui/material/IconButton'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const Footer = () => {
    const { data: sessionData } = useSession()

    return (
        <div className="footer w-full">
            {sessionData?.user?.username && (
                <div
                    role="navigation"
                    aria-label="Mobile navigation"
                    className="footer fixed bottom-0 left-0 z-50 flex w-full items-center justify-evenly bg-gray-200 shadow dark:bg-black xl:hidden"
                >
                    <Link href="/coach">
                        <IconButton color="primary" aria-label="Coach">
                            <SmartToyIcon color="primary" />
                        </IconButton>
                    </Link>
                    <Link href={`/${sessionData?.user?.username}/workout`}>
                        <IconButton color="primary" aria-label="Workout">
                            <FitnessCenterIcon color="primary" />
                        </IconButton>
                    </Link>
                    <Link href="/barcode">
                        <IconButton color="primary" aria-label="Barcode scanner">
                            <PhotoCameraIcon color="primary" />
                        </IconButton>
                    </Link>
                    <Link
                        href={`/${
                            sessionData?.user?.username
                        }/consumed/${moment().format('YYYY-MM-DD')}`}
                    >
                        <IconButton color="primary" aria-label="Diary">
                            <BookIcon color="primary" />
                        </IconButton>
                    </Link>
                    <Link href="/measurements">
                        <IconButton color="primary" aria-label="Measurements">
                            <EmojiEventsIcon color="primary" />
                        </IconButton>
                    </Link>
                    {(sessionData?.user as any)?.permissions?.some((p: any) => p.name === 'Administration') && (
                        <Link href="/health">
                            <IconButton color="primary" aria-label="Health">
                                <MonitorHeartIcon color="primary" />
                            </IconButton>
                        </Link>
                    )}
                </div>
            )}
        </div>
    )
}

export default Footer
