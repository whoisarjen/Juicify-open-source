import { useEffect, useState } from 'react'

interface CustomTextFieldProps {
    defaultValue?: string
    onChange: (state: string) => void
    label?: string
    multiline?: boolean
    disabled?: boolean
    type?: string
    className?: string
    sx?: object
    [key: string]: any
}

export const CustomTextField = ({
    defaultValue = '',
    onChange,
    label,
    multiline = false,
    disabled = false,
    type = 'text',
    className,
    sx,
    ...props
}: CustomTextFieldProps) => {
    const [state, setState] = useState(defaultValue)

    const handleOnChange = (newState: string) => {
        setState(newState)
        onChange(newState.slice(0, 255))
    }

    useEffect(() => {
        setState(defaultValue)
    }, [defaultValue])

    const inputClassName = 'w-full rounded border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-blue-500 dark:border-gray-600'

    return (
        <div className={className} style={sx}>
            {label && <label className="mb-1 block text-sm text-gray-500">{label}</label>}
            {multiline ? (
                <textarea
                    className={inputClassName}
                    value={state}
                    onChange={event => handleOnChange(event.target.value)}
                    disabled={disabled}
                    {...props}
                />
            ) : (
                <input
                    className={inputClassName}
                    value={state}
                    onChange={event => handleOnChange(event.target.value)}
                    disabled={disabled}
                    type={type}
                    {...props}
                />
            )}
        </div>
    )
}
