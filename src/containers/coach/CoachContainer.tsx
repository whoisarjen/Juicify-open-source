import { type ReactNode } from 'react'
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'

interface CoachContainerProps {
    title?: string
    description?: string
    children: ReactNode
}

const CoachContainer = ({
    title,
    description,
    children,
}: CoachContainerProps) => {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-4">
            {!!title && (
                <div className="flex">
                    <NavbarOnlyTitle title={title} />
                </div>
            )}
            {!!description && (
                <div className="flex-1 items-center justify-center text-center">
                    {description}
                </div>
            )}
            {children}
        </div>
    )
}

export default CoachContainer
