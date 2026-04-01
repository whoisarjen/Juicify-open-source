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
            className="glass-interactive flex w-full p-4 cursor-pointer"
        >
            <div className="flex flex-1 flex-col gap-1 min-w-0">
                <h2 className="text-sm font-bold text-zinc-200 truncate">{title}</h2>
                {description && (
                    <p className="text-xs text-[#7a7a7a] line-clamp-2">{description}</p>
                )}
                {whenAdded && (
                    <div className="text-[11px] text-[#7a7a7a] mt-auto pt-2">
                        {moment(whenAdded).format('DD.MM.YYYY')}
                    </div>
                )}
            </div>
            <div className="flex w-10 items-center justify-center shrink-0 text-[#7a7a7a]">
                {icon}
            </div>
        </Link>
    )
}

export default BoxWorkout
