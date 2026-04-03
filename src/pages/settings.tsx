import SelectLanguage from '@/containers/settings/SelectLanguage/SelectLanguage'
import { type UserSchema, userSchema } from '@/server/schema/user.schema'
import { reloadSession } from '@/utils/global.utils'
import { updateMacronutrientsInUser } from '@/utils/coach.utils'
import { trpc } from '@/utils/trpc.utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { DatePicker } from '@/components/DatePicker'
import { handleSignOut } from '@/utils/user.utils'
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'
import { LogOut } from 'lucide-react'

const SettingsPage = () => {
    const { t } = useTranslation('settings')
    const { data: sessionData } = useSession()

    const updateUser = trpc.user.update.useMutation({
        onSuccess() {
            reloadSession()
        },
    })

    const changeSettings = async (newUserSettings: UserSchema) => {
        const expanded = updateMacronutrientsInUser(
            newUserSettings.proteinsDay0 ?? 0,
            newUserSettings.carbsDay0 ?? 0,
            newUserSettings.fatsDay0 ?? 0,
        )
        await updateUser.mutateAsync({ ...newUserSettings, ...expanded })
    }

    const {
        register,
        formState: { errors, isDirty },
        handleSubmit,
        reset,
        setValue,
        getValues,
        watch,
    } = useForm<UserSchema>({ resolver: zodResolver(userSchema) })

    const proteins = watch('proteinsDay0') ?? 0
    const carbs = watch('carbsDay0') ?? 0
    const fats = watch('fatsDay0') ?? 0
    const totalKcal = proteins * 4 + carbs * 4 + fats * 9

    useEffect(() => {
        if (!sessionData?.user) {
            return
        }

        reset(sessionData.user)
    }, [reset, sessionData?.user])

    return (
        <form
            onSubmit={handleSubmit(changeSettings)}
            className="flex flex-col gap-4 flex-1 min-w-0"
        >
            <NavbarOnlyTitle title="settings:Preferences" />

            {/* Macronutrients — hero card */}
            <div className="glass p-4">
                <div className="text-[11px] font-bold uppercase tracking-wide text-[#7a7a7a] mb-3">
                    {t('Macronutrients')}
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="mb-1 block text-[11px] font-semibold text-macro-protein">{t('Proteins')}</label>
                        <div className="flex items-center rounded-lg bg-[rgba(255,255,255,0.03)] border border-glass-border focus-within:border-glass-border-accent transition-all duration-300">
                            <input
                                className="flex-1 min-w-0 bg-transparent px-3 py-2 outline-none text-sm font-bold text-zinc-200"
                                type="number"
                                {...register('proteinsDay0')}
                            />
                            <span className="pr-3 text-[11px] text-[#7a7a7a]">g</span>
                        </div>
                        {errors.proteinsDay0 && <p className="mt-1 text-[10px] text-red-400">{errors.proteinsDay0.message}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-[11px] font-semibold text-macro-carbs">{t('Carbs')}</label>
                        <div className="flex items-center rounded-lg bg-[rgba(255,255,255,0.03)] border border-glass-border focus-within:border-glass-border-accent transition-all duration-300">
                            <input
                                className="flex-1 min-w-0 bg-transparent px-3 py-2 outline-none text-sm font-bold text-zinc-200"
                                type="number"
                                {...register('carbsDay0')}
                            />
                            <span className="pr-3 text-[11px] text-[#7a7a7a]">g</span>
                        </div>
                        {errors.carbsDay0 && <p className="mt-1 text-[10px] text-red-400">{errors.carbsDay0.message}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-[11px] font-semibold text-macro-fat">{t('Fats')}</label>
                        <div className="flex items-center rounded-lg bg-[rgba(255,255,255,0.03)] border border-glass-border focus-within:border-glass-border-accent transition-all duration-300">
                            <input
                                className="flex-1 min-w-0 bg-transparent px-3 py-2 outline-none text-sm font-bold text-zinc-200"
                                type="number"
                                {...register('fatsDay0')}
                            />
                            <span className="pr-3 text-[11px] text-[#7a7a7a]">g</span>
                        </div>
                        {errors.fatsDay0 && <p className="mt-1 text-[10px] text-red-400">{errors.fatsDay0.message}</p>}
                    </div>
                </div>
                <div className="mt-3 text-center text-sm font-bold text-macro-kcal">
                    {totalKcal} kcal
                </div>
            </div>

            {/* Diary settings */}
            <div className="glass p-4">
                <div className="text-[11px] font-bold uppercase tracking-wide text-[#7a7a7a] mb-3">
                    {t('Diary')}
                </div>
                <div className="flex flex-col gap-3">
                    <div>
                        <label className="mb-1 block text-[11px] font-semibold text-[#9ca3af]">{t('Number of meals')}</label>
                        <input
                            className="w-full rounded-lg bg-[rgba(255,255,255,0.03)] border border-glass-border px-3 py-2 outline-none text-sm text-zinc-200 focus:border-glass-border-accent transition-all duration-300"
                            type="number"
                            {...register('numberOfMeals')}
                        />
                        {errors.numberOfMeals && <p className="mt-1 text-[10px] text-red-400">{errors.numberOfMeals.message}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-[11px] font-semibold text-[#9ca3af]">{t('Fiber')}</label>
                        <div className="flex items-center rounded-lg bg-[rgba(255,255,255,0.03)] border border-glass-border focus-within:border-glass-border-accent transition-all duration-300">
                            <input
                                className="flex-1 min-w-0 bg-transparent px-3 py-2 outline-none text-sm text-zinc-200"
                                type="number"
                                {...register('fiber')}
                            />
                            <span className="pr-3 text-[11px] text-[#7a7a7a]">g / 1000 kcal</span>
                        </div>
                        {errors.fiber && <p className="mt-1 text-[10px] text-red-400">{errors.fiber.message}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-[11px] font-semibold text-[#9ca3af]">{t('Sugar')}</label>
                        <div className="flex items-center rounded-lg bg-[rgba(255,255,255,0.03)] border border-glass-border focus-within:border-glass-border-accent transition-all duration-300">
                            <input
                                className="flex-1 min-w-0 bg-transparent px-3 py-2 outline-none text-sm text-zinc-200"
                                type="number"
                                {...register('carbsPercentAsSugar')}
                            />
                            <span className="pr-3 text-[11px] text-[#7a7a7a]">% / {t('Carbs')}</span>
                        </div>
                        {errors.carbsPercentAsSugar && <p className="mt-1 text-[10px] text-red-400">{errors.carbsPercentAsSugar.message}</p>}
                    </div>
                </div>
            </div>

            {/* Language */}
            <div className="glass p-4">
                <div className="text-[11px] font-bold uppercase tracking-wide text-[#7a7a7a] mb-3">
                    {t('Preferences')}
                </div>
                <SelectLanguage />
            </div>

            {/* Profile */}
            <div className="glass p-4">
                <div className="text-[11px] font-bold uppercase tracking-wide text-[#7a7a7a] mb-3">
                    {t('Profile')}
                </div>
                <div className="flex flex-col gap-3">
                    <div>
                        <label className="mb-1 block text-[11px] font-semibold text-[#9ca3af]">{t('Height')}</label>
                        <div className="flex items-center rounded-lg bg-[rgba(255,255,255,0.03)] border border-glass-border focus-within:border-glass-border-accent transition-all duration-300">
                            <input
                                className="flex-1 min-w-0 bg-transparent px-3 py-2 outline-none text-sm text-zinc-200"
                                type="number"
                                {...register('height')}
                            />
                            <span className="pr-3 text-[11px] text-[#7a7a7a]">cm</span>
                        </div>
                        {errors.height && <p className="mt-1 text-[10px] text-red-400">{errors.height.message}</p>}
                    </div>

                    <DatePicker
                        defaultDate={getValues().birth}
                        onChange={(newBirth) =>
                            setValue('birth', newBirth, { shouldDirty: true })
                        }
                        register={register('birth')}
                    />

                    <div>
                        <label className="mb-1 block text-[11px] font-semibold text-[#9ca3af]">{t('Description')}</label>
                        <input
                            className="w-full rounded-lg bg-[rgba(255,255,255,0.03)] border border-glass-border px-3 py-2 outline-none text-sm text-zinc-200 focus:border-glass-border-accent transition-all duration-300"
                            type="text"
                            {...register('description')}
                        />
                        {errors.description && <p className="mt-1 text-[10px] text-red-400">{errors.description.message}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-[11px] font-semibold text-[#9ca3af]">{t('Website')}</label>
                        <div className="flex items-center rounded-lg bg-[rgba(255,255,255,0.03)] border border-glass-border focus-within:border-glass-border-accent transition-all duration-300">
                            <span className="pl-3 text-[11px] text-[#7a7a7a]">https://</span>
                            <input
                                className="flex-1 min-w-0 bg-transparent px-3 py-2 outline-none text-sm text-zinc-200"
                                type="text"
                                {...register('website')}
                            />
                        </div>
                        {errors.website && <p className="mt-1 text-[10px] text-red-400">{errors.website.message}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-[11px] font-semibold text-[#9ca3af]">Facebook</label>
                        <div className="flex items-center rounded-lg bg-[rgba(255,255,255,0.03)] border border-glass-border focus-within:border-glass-border-accent transition-all duration-300">
                            <span className="pl-3 text-[11px] text-[#7a7a7a]">facebook.com/</span>
                            <input
                                className="flex-1 min-w-0 bg-transparent px-3 py-2 outline-none text-sm text-zinc-200"
                                type="text"
                                {...register('facebook')}
                            />
                        </div>
                        {errors.facebook && <p className="mt-1 text-[10px] text-red-400">{errors.facebook.message}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-[11px] font-semibold text-[#9ca3af]">Instagram</label>
                        <div className="flex items-center rounded-lg bg-[rgba(255,255,255,0.03)] border border-glass-border focus-within:border-glass-border-accent transition-all duration-300">
                            <span className="pl-3 text-[11px] text-[#7a7a7a]">instagram.com/</span>
                            <input
                                className="flex-1 min-w-0 bg-transparent px-3 py-2 outline-none text-sm text-zinc-200"
                                type="text"
                                {...register('instagram')}
                            />
                        </div>
                        {errors.instagram && <p className="mt-1 text-[10px] text-red-400">{errors.instagram.message}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-[11px] font-semibold text-[#9ca3af]">Twitter</label>
                        <div className="flex items-center rounded-lg bg-[rgba(255,255,255,0.03)] border border-glass-border focus-within:border-glass-border-accent transition-all duration-300">
                            <span className="pl-3 text-[11px] text-[#7a7a7a]">twitter.com/</span>
                            <input
                                className="flex-1 min-w-0 bg-transparent px-3 py-2 outline-none text-sm text-zinc-200"
                                type="text"
                                {...register('twitter')}
                            />
                        </div>
                        {errors.twitter && <p className="mt-1 text-[10px] text-red-400">{errors.twitter.message}</p>}
                    </div>
                </div>
            </div>

            {/* Actions */}
            {isDirty && (
                <button
                    type="submit"
                    disabled={updateUser.isPending}
                    className="w-full rounded-xl bg-[rgba(144,202,249,0.10)] border border-[rgba(144,202,249,0.25)] px-4 py-3 text-sm font-bold text-primary-dark hover:bg-[rgba(144,202,249,0.18)] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
                >
                    {updateUser.isPending ? (
                        <span className="inline-block h-4 w-4 rounded-full border-2 border-primary-dark border-t-transparent animate-spin" />
                    ) : (
                        t('Save')
                    )}
                </button>
            )}

            <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl bg-[rgba(255,255,255,0.02)] border border-glass-border px-4 py-3 text-sm text-red-400 hover:bg-[rgba(239,68,68,0.06)] hover:border-[rgba(239,68,68,0.20)] transition-all duration-300"
                onClick={() => handleSignOut()}
            >
                <LogOut size={14} />
                {t('LOGOUT')}
            </button>
        </form>
    )
}

export default SettingsPage
