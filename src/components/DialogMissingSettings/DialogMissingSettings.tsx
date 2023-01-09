import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { reloadSession } from '@/utils/global.utils';
import { trpc } from '@/utils/trpc';
import { type UserSchema, userSchema } from '@/server/schema/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { useForm } from 'react-hook-form';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@/components/DatePicker'
import LoadingButton from '@mui/lab/LoadingButton';

export const DialogMissingSettings = () => {
    const { t } = useTranslation('settings')
    const { data: sessionData } = useSession()

    const updateUser = trpc.user.update.useMutation({
        onSuccess() {
            reloadSession()
        },
    })

    const changeSettings = async (newUserSettings: UserSchema) =>
        await updateUser.mutateAsync(newUserSettings)

    const {
        register,
        formState: {
            errors,
            isDirty,
        },
        handleSubmit,
        reset,
        setValue,
        getValues,
    } = useForm<UserSchema>({ resolver: zodResolver(userSchema) })

    React.useEffect(() => {
        if (!sessionData?.user) {
            return
        }

        reset(sessionData.user)
    }, [reset, sessionData?.user])

    return (
        <Dialog open={true}>
            <DialogTitle>Missing settings</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Juicify needs some extra data about you, to provide correct calculation of BMR and help you achieve expected results.
                </DialogContentText>
                <TextField
                    label={t("Height")}
                    type="number"
                    InputProps={{
                        endAdornment: <InputAdornment position="start">cm</InputAdornment>
                    }}
                    {...register('height')}
                    sx={{ width: '100%', margin: '12px 0' }}
                    error={typeof errors.height === 'undefined' ? false : true}
                    helperText={errors.height?.message && t(`notify:${errors.height.message || ''}`)}
                />

                <DatePicker
                    defaultDate={getValues().birth}
                    onChange={newBirth => setValue('birth', newBirth, { shouldDirty: true })}
                    register={register('birth')}
                />
            </DialogContent>
            <DialogActions>
                <LoadingButton
                    loading={updateUser.isLoading}
                    onClick={handleSubmit(changeSettings)}
                >Save and close</LoadingButton>
            </DialogActions>
        </Dialog>
    );
}