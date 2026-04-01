import SelectLanguage from '@/containers/settings/SelectLanguage/SelectLanguage'
import { type UserSchema, userSchema } from '@/server/schema/user.schema'
import { reloadSession } from '@/utils/global.utils'
import { trpc } from '@/utils/trpc.utils'
import { zodResolver } from '@hookform/resolvers/zod'
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
            <div>
                <label className="mb-1 block text-sm text-gray-500">{t('Number of meals')}</label>
                <input
                    className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-blue-500 dark:border-gray-600"
                    type="number"
                    {...register('numberOfMeals')}
                />
                {errors.numberOfMeals && <p className="mt-1 text-xs text-red-500">{errors.numberOfMeals.message}</p>}
            </div>
            <div>
                <label className="mb-1 block text-sm text-gray-500">{t('Fiber')}</label>
                <div className="flex items-center rounded border border-gray-300 focus-within:border-blue-500 dark:border-gray-600">
                    <input
                        className="flex-1 bg-transparent px-3 py-2 outline-none"
                        type="number"
                        {...register('fiber')}
                    />
                    <span className="px-3 text-sm text-gray-500">g / 1000 kcal</span>
                </div>
                {errors.fiber && <p className="mt-1 text-xs text-red-500">{errors.fiber.message}</p>}
            </div>
            <div>
                <label className="mb-1 block text-sm text-gray-500">{t('Sugar')}</label>
                <div className="flex items-center rounded border border-gray-300 focus-within:border-blue-500 dark:border-gray-600">
                    <input
                        className="flex-1 bg-transparent px-3 py-2 outline-none"
                        type="number"
                        {...register('carbsPercentAsSugar')}
                    />
                    <span className="px-3 text-sm text-gray-500">% / {t('Carbs')}</span>
                </div>
                {errors.carbsPercentAsSugar && <p className="mt-1 text-xs text-red-500">{errors.carbsPercentAsSugar.message}</p>}
            </div>
            <div>{t('Profile')}</div>
            <div>
                <label className="mb-1 block text-sm text-gray-500">{t('Height')}</label>
                <div className="flex items-center rounded border border-gray-300 focus-within:border-blue-500 dark:border-gray-600">
                    <input
                        className="flex-1 bg-transparent px-3 py-2 outline-none"
                        type="number"
                        {...register('height')}
                    />
                    <span className="px-3 text-sm text-gray-500">cm</span>
                </div>
                {errors.height && <p className="mt-1 text-xs text-red-500">{errors.height.message}</p>}
            </div>

            <DatePicker
                defaultDate={getValues().birth}
                onChange={(newBirth) =>
                    setValue('birth', newBirth, { shouldDirty: true })
                }
                register={register('birth')}
            />

            <div>
                <label className="mb-1 block text-sm text-gray-500">{t('Description')}</label>
                <input
                    className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-blue-500 dark:border-gray-600"
                    type="text"
                    {...register('description')}
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
            </div>
            <div>
                <label className="mb-1 block text-sm text-gray-500">{t('Website')}</label>
                <div className="flex items-center rounded border border-gray-300 focus-within:border-blue-500 dark:border-gray-600">
                    <span className="px-3 text-sm text-gray-500">https://</span>
                    <input
                        className="flex-1 bg-transparent px-3 py-2 outline-none"
                        type="text"
                        {...register('website')}
                    />
                </div>
                {errors.website && <p className="mt-1 text-xs text-red-500">{errors.website.message}</p>}
            </div>
            <div>
                <label className="mb-1 block text-sm text-gray-500">Facebook</label>
                <div className="flex items-center rounded border border-gray-300 focus-within:border-blue-500 dark:border-gray-600">
                    <span className="px-3 text-sm text-gray-500">https://facebook.com/</span>
                    <input
                        className="flex-1 bg-transparent px-3 py-2 outline-none"
                        type="text"
                        {...register('facebook')}
                    />
                </div>
                {errors.facebook && <p className="mt-1 text-xs text-red-500">{errors.facebook.message}</p>}
            </div>
            <div>
                <label className="mb-1 block text-sm text-gray-500">Instagram</label>
                <div className="flex items-center rounded border border-gray-300 focus-within:border-blue-500 dark:border-gray-600">
                    <span className="px-3 text-sm text-gray-500">https://instagram.com/</span>
                    <input
                        className="flex-1 bg-transparent px-3 py-2 outline-none"
                        type="text"
                        {...register('instagram')}
                    />
                </div>
                {errors.instagram && <p className="mt-1 text-xs text-red-500">{errors.instagram.message}</p>}
            </div>
            <div>
                <label className="mb-1 block text-sm text-gray-500">Twitter</label>
                <div className="flex items-center rounded border border-gray-300 focus-within:border-blue-500 dark:border-gray-600">
                    <span className="px-3 text-sm text-gray-500">https://twitter.com/</span>
                    <input
                        className="flex-1 bg-transparent px-3 py-2 outline-none"
                        type="text"
                        {...register('twitter')}
                    />
                </div>
                {errors.twitter && <p className="mt-1 text-xs text-red-500">{errors.twitter.message}</p>}
            </div>
            <button type="button" className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-800" onClick={() => handleSignOut()}>
                {t('LOGOUT')}
            </button>
            {isDirty && (
                <button onClick={() => handleSubmit(changeSettings)}>
                    Submit
                </button>
            )}
        </form>
    )
}

export default SettingsPage
