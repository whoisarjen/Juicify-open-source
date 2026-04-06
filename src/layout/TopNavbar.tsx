import { Trophy, Dumbbell, GraduationCap, BookOpen, Bot, LogOut } from 'lucide-react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import moment from 'moment'
import { useSession, signIn } from 'next-auth/react'
import { handleSignOut } from '@/utils/user.utils'

const TopNavbar = () => {
    const router = useRouter()
    const { t } = useTranslation('home')
    const { data: sessionData } = useSession()
    const username = sessionData?.user?.username

    const allNavItems = [
        { key: 'diary', link: `/${username}/consumed/${moment().format('YYYY-MM-DD')}`, text: t('Diary'), icon: <BookOpen size={16} />, requiresAuth: true },
        { key: 'measurements', link: '/measurements', text: t('Measurements'), icon: <Trophy size={16} />, requiresAuth: true },
        { key: 'workout', link: `/${username}/workout`, text: t('Workout'), icon: <Dumbbell size={16} />, requiresAuth: true },
        { key: 'coach', link: '/coach', text: t('Coach'), icon: <Bot size={16} />, requiresAuth: true },
        { key: 'blog', link: '/blog', text: t('Blog'), icon: <GraduationCap size={16} />, requiresAuth: false },
    ]

    const navItems = sessionData
        ? allNavItems
        : allNavItems.filter((item) => !item.requiresAuth)

    const navigate = (link: string) => {
        if (sessionData?.user || link === '/blog') {
            router.push(link)
        } else {
            signIn()
        }
    }

    return (
        <nav className="max-lg:hidden flex items-center gap-3 py-3">
            <img
                src="/images/logo.png"
                alt="Juicify"
                className="h-8 w-8 cursor-pointer"
                onClick={() => navigate(`/${username}/consumed/${moment().format('YYYY-MM-DD')}`)}
            />
            <div className="flex flex-1 items-center justify-center gap-0.5 rounded-[14px] bg-glass border border-glass-border p-1">
                {navItems.map(({ key, link, text, icon }) => (
                    <button
                        key={key}
                        onClick={() => navigate(link)}
                        className={`flex items-center gap-1.5 rounded-[10px] px-4 py-2 text-[13px] font-semibold transition-all duration-200
                            ${router.asPath.includes(key === 'diary' ? '/consumed/' : `/${key}`)
                                ? 'bg-[rgba(144,202,249,0.1)] text-primary-dark shadow-[0_0_0_1px_rgba(144,202,249,0.15)]'
                                : 'text-[#7a7a7a] hover:text-[#aaa] hover:bg-glass-hover'
                            }`}
                    >
                        {icon}
                        {text}
                    </button>
                ))}
            </div>
            <button
                onClick={() => sessionData ? handleSignOut() : signIn()}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-[#7a7a7a] transition-all hover:bg-glass-hover hover:text-[#aaa]"
                aria-label={sessionData ? t('LOGOUT') : t('LOGIN')}
            >
                <LogOut size={18} />
            </button>
        </nav>
    )
}

export default TopNavbar
