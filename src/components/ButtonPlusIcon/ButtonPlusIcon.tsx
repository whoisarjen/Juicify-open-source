import { ReactNode } from 'react';

interface ButtonPlusIconProps {
    onClick?: () => void
    size?: "small" | "medium" | "large"
    icon?: ReactNode
    variant?: "floating" | "inline"
}

const sizeClasses = {
    small: 'h-10 w-10',
    medium: 'h-12 w-12',
    large: 'h-14 w-14',
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
                    className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-primary-dark text-[#121212] shadow-md hover:bg-[#64b5f6] active:shadow-lg transition-all cursor-pointer`}
                    aria-label="add"
                >
                    {icon || (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    )}
                </button>
            </div>
        )
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className={`${sizeClasses[size]} fixed bottom-20 right-8 xl:bottom-8 z-40 flex items-center justify-center rounded-full bg-primary-dark text-[#121212] shadow-lg hover:bg-[#64b5f6] active:shadow-xl transition-all cursor-pointer`}
            aria-label="add"
        >
            {icon || (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            )}
        </button>
    )
}

export default ButtonPlusIcon;
