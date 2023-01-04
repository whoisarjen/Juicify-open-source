import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TextField } from "@mui/material"
import useTranslation from 'next-translate/useTranslation'
import moment from 'moment'
import { useEffect, useState } from 'react'

interface DatePickerProps {
    sx?: object
    register: object
    defaultDate: Date
    onChange: (newDate: Date) => void
    focused?: boolean
}

export const DatePicker = ({
    sx,
    register,
    defaultDate,
    onChange,
    focused = false,
}: DatePickerProps) => {
    const { t } = useTranslation('home')
    const [date, setDate] = useState(defaultDate)

    const handleOnChange = (newDate: Date) => {
        onChange(newDate)
        setDate(newDate)
    }

    useEffect(() => {
        setDate(defaultDate)
    }, [defaultDate])

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <MobileDateTimePicker
                value={date}
                onChange={newDate => handleOnChange(moment(newDate).toDate())}
                label={t("DATE")}
                renderInput={params =>
                    <TextField
                        sx={sx}
                        fullWidth
                        focused={focused}
                        {...params}
                        {...register}
                    />
                }
            />
        </LocalizationProvider>
    )
}