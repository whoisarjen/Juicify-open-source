import { range } from 'lodash-es';
import { type ReactElement } from 'react';

interface BoxWorkoutLoaderProps {
    isLoading: boolean
    numberOfLoaders?: number
    children: ReactElement
}

export const BoxWorkoutLoader = ({
    isLoading,
    numberOfLoaders = 1,
    children,
}: BoxWorkoutLoaderProps) => {
    if (isLoading) {
        return (
            <div>
                {range(0, numberOfLoaders).map(index => (
                    <div
                        key={index}
                        className="mb-2 h-[160px] animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
                    />
                ))}
            </div>
        )
    }

    return children
}
