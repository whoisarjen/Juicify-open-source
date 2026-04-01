import { ReactNode } from 'react';

interface ButtonPlusIconProps {
    onClick?: () => void
    size?: "small" | "medium" | "large"
    icon?: ReactNode
    variant?: "floating" | "inline"
}

const ButtonPlusIcon = ({
    onClick,
    icon,
    size = 'medium',
    variant = 'floating',
}: ButtonPlusIconProps) => {
    if (variant === 'inline') {
        return (
            <div className="flex w-full items-center justify-center py-2">
                <button
                    type="button"
                    onClick={onClick}
                    className="win2k-btn flex items-center gap-1 px-4"
                    aria-label="add"
                >
                    {icon || (
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    )}
                    <span className="text-[11px]">Add Set</span>
                </button>
            </div>
        )
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className="win2k-btn fixed bottom-8 right-8 z-40 flex items-center gap-1 px-4"
            aria-label="add"
        >
            {icon || (
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            )}
            <span className="text-[11px]">Add</span>
        </button>
    )
}

export default ButtonPlusIcon;
