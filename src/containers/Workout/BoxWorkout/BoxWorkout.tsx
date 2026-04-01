import { ReactNode } from 'react'
import moment from 'moment'
import Link from 'next/link'

interface BoxWorkoutProps {
    title?: string
    description?: string
    route: string
    icon: ReactNode
    whenAdded?: Date
}

const BoxWorkout = ({
    title,
    description,
    route,
    icon,
    whenAdded,
}: BoxWorkoutProps) => {
    return (
        <Link
            href={route}
            className="glass-interactive flex w-full p-2 cursor-pointer items-center gap-2"
        >
            {/* Win2k icon container */}
            <div className="flex w-8 h-8 items-center justify-center shrink-0 text-[#0a246a]">
                {icon}
            </div>
            <div className="flex flex-1 flex-col gap-0 min-w-0">
                <h2 className="text-xs font-bold text-black truncate">{title}</h2>
                {description && (
                    <p className="text-[10px] text-[#444444] line-clamp-1">{description}</p>
                )}
            </div>
            {whenAdded && (
                <div className="text-[10px] text-[#444444] shrink-0 pr-1">
                    {moment(whenAdded).format('DD.MM.YYYY')}
                </div>
            )}
        </Link>
    )
}

export default BoxWorkout
