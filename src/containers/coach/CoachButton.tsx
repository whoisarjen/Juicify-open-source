interface CoachButtonProps {
    onClick?: () => void
    children: string
    color?: 'error'
    disabled?: boolean
}

const CoachButton = ({ onClick, children, color, disabled }: CoachButtonProps) => {
    return (
        <div className="w-full max-w-sm">
            <button
                className={`w-full rounded px-4 py-2 text-white disabled:opacity-50 ${
                    color === 'error'
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-primary-dark hover:bg-[#64b5f6]'
                }`}
                onClick={onClick}
                disabled={disabled}
            >
                {children}
            </button>
        </div>
    )
}

export default CoachButton
