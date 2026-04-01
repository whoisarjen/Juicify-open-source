import { Camera, Trophy, Dumbbell, BookOpen, Bot } from 'lucide-react'
import moment from 'moment'
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
                        <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Coach">
                            <Bot className="text-[#90caf9]" />
                        </button>
                    </Link>
                    <Link href={`/${sessionData?.user?.username}/workout`}>
                        <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Workout">
                            <Dumbbell className="text-[#90caf9]" />
                        </button>
                    </Link>
                    <Link href="/barcode">
                        <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Barcode scanner">
                            <Camera className="text-[#90caf9]" />
                        </button>
                    </Link>
                    <Link
                        href={`/${
                            sessionData?.user?.username
                        }/consumed/${moment().format('YYYY-MM-DD')}`}
                    >
                        <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Diary">
                            <BookOpen className="text-[#90caf9]" />
                        </button>
                    </Link>
                    <Link href="/measurements">
                        <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Measurements">
                            <Trophy className="text-[#90caf9]" />
                        </button>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default Footer
