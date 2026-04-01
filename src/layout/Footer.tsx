import { Camera, Trophy, Dumbbell, BookOpen, Bot } from 'lucide-react'
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
                            <Bot className="text-[#90caf9]" />
                        </IconButton>
                    </Link>
                    <Link href={`/${sessionData?.user?.username}/workout`}>
                        <IconButton color="primary" aria-label="Workout">
                            <Dumbbell className="text-[#90caf9]" />
                        </IconButton>
                    </Link>
                    <Link href="/barcode">
                        <IconButton color="primary" aria-label="Barcode scanner">
                            <Camera className="text-[#90caf9]" />
                        </IconButton>
                    </Link>
                    <Link
                        href={`/${
                            sessionData?.user?.username
                        }/consumed/${moment().format('YYYY-MM-DD')}`}
                    >
                        <IconButton color="primary" aria-label="Diary">
                            <BookOpen className="text-[#90caf9]" />
                        </IconButton>
                    </Link>
                    <Link href="/measurements">
                        <IconButton color="primary" aria-label="Measurements">
                            <Trophy className="text-[#90caf9]" />
                        </IconButton>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default Footer
