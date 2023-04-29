import SelectLanguage from '@/containers/settings/SelectLanguage/SelectLanguage'
import { type UserSchema, userSchema } from '@/server/schema/user.schema'
import { reloadSession } from '@/utils/global.utils'
import { trpc } from '@/utils/trpc.utils'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { DatePicker } from '@/components/DatePicker'
import { handleSignOut } from '@/utils/user.utils'

const SettingsPage = () => {
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
        formState: { errors, isDirty },
        handleSubmit,
        reset,
        setValue,
        getValues,
    } = useForm<UserSchema>({ resolver: zodResolver(userSchema) })

    useEffect(() => {
        if (!sessionData?.user) {
            return
        }

        reset(sessionData.user)
    }, [reset, sessionData?.user])

    return (
        <form
            onSubmit={handleSubmit(changeSettings)}
            className="flex flex-col gap-3 flex-1"
        >
            <div>{t('Preferences')}</div>
            <SelectLanguage />
            <div>{t('Diary')}</div>
            <TextField
                variant="outlined"
                label={t('Number of meals')}
                type="number"
                {...register('numberOfMeals')}
                error={
                    typeof errors.numberOfMeals === 'undefined' ? false : true
                }
                helperText={errors.numberOfMeals?.message}
            />
            <TextField
                label={t('Fiber')}
                type="number"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">
                            g / 1000 kcal
                        </InputAdornment>
                    ),
                }}
                {...register('fiber')}
                error={typeof errors.fiber === 'undefined' ? false : true}
                helperText={errors.fiber?.message}
            />
            <TextField
                label={t('Sugar')}
                type="number"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">
                            % / {t('Carbs')}
                        </InputAdornment>
                    ),
                }}
                {...register('carbsPercentAsSugar')}
                error={
                    typeof errors.carbsPercentAsSugar === 'undefined'
                        ? false
                        : true
                }
                helperText={errors.carbsPercentAsSugar?.message}
            />
            <div>{t('Profile')}</div>
            <TextField
                label={t('Height')}
                type="number"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">cm</InputAdornment>
                    ),
                }}
                {...register('height')}
                error={typeof errors.height === 'undefined' ? false : true}
                helperText={errors.height?.message}
            />

            <DatePicker
                defaultDate={getValues().birth}
                onChange={(newBirth) =>
                    setValue('birth', newBirth, { shouldDirty: true })
                }
                register={register('birth')}
            />

            <TextField
                label={t('Description')}
                variant="outlined"
                type="text"
                {...register('description')}
                error={typeof errors.description === 'undefined' ? false : true}
                helperText={errors.description?.message}
            />
            <TextField
                label={t('Website')}
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            https://
                        </InputAdornment>
                    ),
                }}
                type="text"
                {...register('website')}
                error={typeof errors.website === 'undefined' ? false : true}
                helperText={errors.website?.message}
            />
            <TextField
                label="Facebook"
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            https://facebook.com/
                        </InputAdornment>
                    ),
                }}
                type="text"
                {...register('facebook')}
                error={typeof errors.facebook === 'undefined' ? false : true}
                helperText={errors.facebook?.message}
            />
            <TextField
                label="Instagram"
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            https://instagram.com/
                        </InputAdornment>
                    ),
                }}
                type="text"
                {...register('instagram')}
                error={typeof errors.instagram === 'undefined' ? false : true}
                helperText={errors.instagram?.message}
            />
            <TextField
                label="Twitter"
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            https://twitter.com/
                        </InputAdornment>
                    ),
                }}
                type="text"
                {...register('twitter')}
                error={typeof errors.twitter === 'undefined' ? false : true}
                helperText={errors.twitter?.message}
            />
            <Button color="error" onClick={() => handleSignOut()}>
                {t('LOGOUT')}
            </Button>
            {isDirty && (
                <button onClick={() => handleSubmit(changeSettings)}>
                    Submit
                </button>
            )}
        </form>
    )
}

export default SettingsPage
