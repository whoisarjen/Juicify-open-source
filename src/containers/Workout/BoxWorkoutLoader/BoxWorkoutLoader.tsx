import Skeleton from '@mui/material/Skeleton';
import { range } from 'lodash';
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
                    <Skeleton
                        key={index}
                        height={160}
                        variant="rounded"
                    />
                ))}
            </div>
        )
    }

    return children
}
