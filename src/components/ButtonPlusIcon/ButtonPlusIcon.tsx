import { ReactNode } from 'react';

interface ButtonPlusIconProps {
    onClick?: () => void
    size?: "small" | "medium" | "large"
    icon?: ReactNode
}

const sizeClasses = {
    small: 'h-10 w-10',
    medium: 'h-14 w-14',
    large: 'h-16 w-16',
}

const ButtonPlusIcon = ({
    onClick,
    icon,
    size = 'medium',
}: ButtonPlusIconProps) => {
    return (
        <div className="flex w-full items-center justify-center" onClick={onClick}>
            <button
                type="button"
                className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 active:shadow-lg`}
                aria-label="add"
            >
                {icon || (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                )}
            </button>
        </div>
    );
}

export default ButtonPlusIcon;
