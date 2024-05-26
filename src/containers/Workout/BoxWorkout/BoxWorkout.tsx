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
            className="flex h-44 w-full rounded bg-primary-dark p-3 text-white transition hover:scale-105 hover:text-white"
        >
            <div className="flex flex-1 flex-col p-3">
                <div className="flex-1">
                    <h1 className="text-xl font-bold">{title}</h1>
                    <div>{description}</div>
                </div>
                {whenAdded && (
                    <div>{moment(whenAdded).format('DD.MM.YYYY')}</div>
                )}
            </div>
            <div className="flex w-24 items-center justify-center">{icon}</div>
        </Link>
    )
}

export default BoxWorkout
