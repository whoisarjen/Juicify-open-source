import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { reloadSession } from '@/utils/global.utils';
import { trpc } from '@/utils/trpc.utils';
import { type UserSchema, userSchema } from '@/server/schema/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { useForm } from 'react-hook-form';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@/components/DatePicker'
import LoadingButton from '@mui/lab/LoadingButton';

export const DialogMissingSettings = () => {
    const { t } = useTranslation()
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
            <DialogTitle>{t('home:MISSING_SETTINGS')}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('home:MISSING_SETTINGS_DESCRIPTION')}
                </DialogContentText>
                <TextField
                    label={t("HEIGHT")}
                    type="number"
                    InputProps={{
                        endAdornment: <InputAdornment position="start">cm</InputAdornment>
                    }}
                    {...register('height')}
                    sx={{ width: '100%', margin: '12px 0' }}
                    error={typeof errors.height === 'undefined' ? false : true}
                    helperText={errors.height?.message}
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
                >{t('home:SAVE_AND_CLOSE')}</LoadingButton>
            </DialogActions>
        </Dialog>
    );
}
