import { Fragment, useState } from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import useTranslation from 'next-translate/useTranslation';

interface AutocompleteProps {
    find: string | null,
    setFind: (arg0: string) => void,
    loading: boolean,
    searchCache: string[]
}

const CustomAutocomplete = ({ find, setFind, loading, searchCache }: AutocompleteProps) => {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)

    return (
        <Autocomplete
            sx={{ marginBottom: '10px' }}
            open={open}
            value={find}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            isOptionEqualToValue={(option, value) => option === value}
            getOptionLabel={option => option ? option : ''}
            options={searchCache}
            loading={loading}
            onInputChange={(e, value) => setFind(value.trim().toLowerCase())}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={t('Search')}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </Fragment>
                        ),
                    }}
                />
            )}
        />
    )
}

export default CustomAutocomplete;