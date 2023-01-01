import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TextField } from "@mui/material"
import useTranslation from 'next-translate/useTranslation'
import moment from 'moment'

interface DatePickerProps {
    sx?: object
    register: object
    when: Date
    onChange: (when: Date) => void
}

export const DatePicker = ({
    sx,
    register,
    when,
    onChange,
}: DatePickerProps) => {
    const { t } = useTranslation('home')

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <MobileDateTimePicker
                value={when}
                onChange={newWhen => onChange(moment(newWhen).toDate())}
                label={t("DATE")}
                renderInput={params =>
                    <TextField
                        sx={sx}
                        fullWidth
                        {...params}
                        {...register}
                    />
                }
            />
        </LocalizationProvider>
    )
}