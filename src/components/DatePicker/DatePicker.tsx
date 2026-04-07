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
    label?: string
}

export const DatePicker = ({
    sx,
    register,
    defaultDate = moment().toDate(),
    onChange,
    focused = false,
    maxDateTime = moment().add(-12, 'years').toDate(),
    minDateTime = moment().add(-100, 'years').toDate(),
    label,
}: DatePickerProps) => {
    const { t } = useTranslation('home')
    const [date, setDate] = useState(moment(defaultDate).format('YYYY-MM-DDTHH:mm'))

    const handleOnChange = (value: string) => {
        const newDate = moment(value).toDate()
        onChange(newDate)
        setDate(value)
    }

    useEffect(() => {
        setDate(moment(defaultDate).format('YYYY-MM-DDTHH:mm'))
    }, [defaultDate])

    return (
        <div style={sx}>
            <label className="mb-1 block text-sm text-gray-500">{label ?? t("DATE")}</label>
            <input
                type="datetime-local"
                className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-blue-500 dark:border-gray-600"
                value={date}
                onChange={(e) => handleOnChange(e.target.value)}
                max={moment(maxDateTime).format('YYYY-MM-DDTHH:mm')}
                min={moment(minDateTime).format('YYYY-MM-DDTHH:mm')}
                {...register}
            />
        </div>
    )
}
