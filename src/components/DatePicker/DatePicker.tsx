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
    defaultDate?: Date
    onChange: (newDate: Date) => void
    focused?: boolean
    maxDateTime?: Date
    minDateTime?: Date
}

const format = "YYYY/MM/DD hh:mm"

export const DatePicker = ({
    sx,
    register,
    defaultDate = moment().toDate(),
    onChange,
    focused = false,
    maxDateTime = moment().add(-12, 'years').toDate(),
    minDateTime = moment().add(-100, 'years').toDate(),
}: DatePickerProps) => {
    const { t } = useTranslation('home')
    const [date, setDate] = useState(moment(defaultDate).format(format))

    const handleOnChange = (newDate: Date) => {
        onChange(newDate)
        setDate(moment(newDate).format(format))
    }

    useEffect(() => {
        setDate(moment(defaultDate).format(format))
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
                maxDateTime={moment(maxDateTime)}
                minDateTime={moment(minDateTime)}
                inputFormat={format}
            />
        </LocalizationProvider>
    )
}