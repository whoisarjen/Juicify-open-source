import { range } from 'lodash-es';
import { type ReactElement } from 'react';

interface BoxWorkoutLoaderProps {
    isLoading: boolean
    numberOfLoaders?: number
    children: ReactElement
}

export const BoxWorkoutLoader = ({
    isLoading,
    numberOfLoaders = 3,
    children,
}: BoxWorkoutLoaderProps) => {
    if (isLoading) {
        return (
            <div className="flex flex-col gap-3">
                {range(0, numberOfLoaders).map(index => (
                    <div
                        key={index}
                        className="glass h-[72px] animate-pulse"
                    />
                ))}
            </div>
        )
    }

    return children
}
