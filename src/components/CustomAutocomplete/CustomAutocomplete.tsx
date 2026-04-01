import useTranslation from 'next-translate/useTranslation';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react'

interface CustomAutocompleteProps {
    find: string | null,
    setFind: (arg0: string) => void,
    isLoading: boolean,
    searchCache?: string[]
    debounceDuration?: number
}

const CustomAutocomplete = ({
    find,
    setFind,
    isLoading,
    searchCache = [],
    debounceDuration = 1000,
}: CustomAutocompleteProps) => {
    const { t } = useTranslation()
    const [localValue, setLocalValue] = useState(find || '')

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleSetFind = useCallback(debounce(newFind => setFind(newFind), debounceDuration), []);

    const handleInputChange = (value: string) => {
        setLocalValue(value)
        handleSetFind(value)
    }

    return (
        <div className="relative mb-2.5">
            <label className="mb-1 block text-sm text-gray-500">{t('Search')}</label>
            <div className="flex items-center rounded border border-gray-300 focus-within:border-blue-500 dark:border-gray-600">
                <input
                    className="flex-1 bg-transparent px-3 py-2 outline-none"
                    value={localValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                />
                {isLoading && (
                    <span className="px-3">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    </span>
                )}
            </div>
        </div>
    )
}

export default CustomAutocomplete;
