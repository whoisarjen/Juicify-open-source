import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import useTranslation from 'next-translate/useTranslation';
import { debounce } from 'lodash';
import { useCallback } from 'react'

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleSetFind = useCallback(debounce(newFind => setFind(newFind), debounceDuration), []);

    return (
        <Autocomplete
            sx={{ marginBottom: '10px' }}
            open={false}
            value={find}
            isOptionEqualToValue={(option, value) => option === value}
            getOptionLabel={option => option ? option : ''}
            options={searchCache}
            loading={isLoading}
            onInputChange={(e, value) => handleSetFind(value)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={t('Search')}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    )
}

export default CustomAutocomplete;