import { Trophy, Dumbbell, GraduationCap, BookOpen, Settings, Bot, LogOut } from 'lucide-react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import moment from 'moment'
import { useSession, signIn } from 'next-auth/react'
import { type Translate } from 'next-translate'
import { type Session } from 'next-auth'
import { handleSignOut } from '@/utils/user.utils'

const getRouterPushOptions = (sessionData: Session | null, t: Translate) => {
    const username = sessionData?.user?.username

    return {
        diary: {
            link: `/${username}/consumed/${moment().format('YYYY-MM-DD')}`,
            text: t('Diary'),
            children: <BookOpen className="text-[#90caf9]" />,
        },
        measurements: {
            link: `/measurements`,
            text: t('Measurements'),
            children: <Trophy className="text-[#90caf9]" />,
        },
        workout: {
            link: `/${username}/workout`,
            text: t('Workout'),
            children: <Dumbbell className="text-[#90caf9]" />,
        },
        coach: {
            link: `/coach`,
            text: t('Coach'),
            children: <Bot className="text-[#90caf9]" />,
        },
        blog: {
            link: `/blog`,
            text: t('Blog'),
            children: <GraduationCap className="text-[#90caf9]" />,
        },
    }
}

const SidebarLeft = () => {
    const router = useRouter()
    const { t } = useTranslation('home')
    const { data: sessionData } = useSession()

    return (
        <div className="sticky top-0 w-full">
            <nav role="navigation" aria-label="Main navigation">
                <ul className="flex flex-col">
                    {Object.keys(getRouterPushOptions(sessionData, t)).map(
                        (key) => {
                            const { link, children, text } =
                                getRouterPushOptions(sessionData, t)[key]

                            return (
                                <li key={key}>
                                    <button
                                        className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        aria-label={text}
                                        onClick={() => {
                                            if (
                                                sessionData?.user ||
                                                link === '/blog'
                                            ) {
                                                router.push(link)
                                            } else {
                                                signIn()
                                            }
                                        }}
                                    >
                                        <span className="flex items-center">{children}</span>
                                        <span>{text}</span>
                                    </button>
                                </li>
                            )
                        }
                    )}
                    <hr className="border-t border-gray-200 dark:border-gray-700" />
                    <li>
                        <button
                            className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label={t('Settings')}
                            onClick={() => router.push('/settings')}
                        >
                            <span className="flex items-center">
                                <Settings className="text-[#90caf9]" />
                            </span>
                            <span>{t('Settings')}</span>
                        </button>
                    </li>
                    <li>
                        <button
                            className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label={sessionData ? t('LOGOUT') : t('LOGIN')}
                            onClick={() =>
                                sessionData ? handleSignOut() : signIn()
                            }
                        >
                            <span className="flex items-center">
                                <LogOut className="text-[#90caf9]" />
                            </span>
                            <span>
                                {sessionData ? t('LOGOUT') : t('LOGIN')}
                            </span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default SidebarLeft
