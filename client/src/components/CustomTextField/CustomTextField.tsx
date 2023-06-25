import TextField, { type TextFieldProps } from '@mui/material/TextField'
import { useEffect, useState } from 'react'

export const CustomTextField = ({
    defaultValue = '',
    onChange,
    ...props
}: Omit<TextFieldProps, 'onChange'> & { onChange: (state: string) => void }) => {
    const [state, setState] = useState(defaultValue)

    const handleOnChange = (newState: string) => {
        setState(newState)
        onChange(newState.slice(0, 255))
    }

    useEffect(() => {
        setState(defaultValue)
    }, [defaultValue])

    return (
        <TextField
            {...props}
            value={state}
            onChange={event => handleOnChange(event.target.value)}
        />
    )
}
