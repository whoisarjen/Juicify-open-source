import SelectLanguage from '@/containers/settings/SelectLanguage/SelectLanguage'
import { type UserSchema, userSchema } from '@/server/schema/user.schema'
import { reloadSession } from '@/utils/global.utils'
import { updateMacronutrientsInUser, updateMinMacronutrientsInUser } from '@/utils/coach.utils'
import { trpc } from '@/utils/trpc.utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DatePicker } from '@/components/DatePicker'
import { handleSignOut } from '@/utils/user.utils'
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'
import { LogOut, Copy, Check, RefreshCw } from 'lucide-react'

const ApiTokenCard = () => {
    const { t } = useTranslation('settings')
    const { data: sessionData } = useSession()
    const [copied, setCopied] = useState(false)

    const regenerate = trpc.user.regenerateApiToken.useMutation({
        onSuccess() {
            reloadSession()
        },
    })

    const apiToken = (sessionData?.user as Record<string, unknown> | undefined)?.apiToken as string | undefined

    const snapshotUrl = apiToken
        ? `${window.location.origin}/api/user-snapshot?token=${apiToken}`
        : ''

    const handleCopy = async () => {
        await navigator.clipboard.writeText(snapshotUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleRegenerate = () => {
        if (window.confirm(t('REGENERATE_CONFIRM'))) {
            regenerate.mutate()
        }
    }

    return (
        <div className="glass p-4">
            <div className="text-[11px] font-bold uppercase tracking-wide text-[#7a7a7a] mb-3">
                {t('AI_DATA_LINK')}
            </div>
            <p className="text-[12px] text-[#9ca3af] mb-3 leading-relaxed">
                {t('AI_DATA_LINK_DESC')}
            </p>
            {apiToken ? (
                <>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0 rounded-lg bg-[rgba(255,255,255,0.03)] border border-glass-border px-3 py-2 text-[11px] font-mono text-zinc-400 truncate">
                            {snapshotUrl}
                        </div>
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="flex-shrink-0 flex items-center gap-1.5 rounded-lg bg-[rgba(144,202,249,0.10)] border border-[rgba(144,202,249,0.25)] px-3 py-2 text-[11px] font-bold text-primary-dark hover:bg-[rgba(144,202,249,0.18)] transition-all duration-300"
                        >
                            {copied ? <Check size={12} /> : <Copy size={12} />}
                            {copied ? t('COPIED') : t('COPY')}
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={handleRegenerate}
                        disabled={regenerate.isPending}
                        className="mt-2 flex items-center gap-1.5 text-[11px] text-[#7a7a7a] hover:text-zinc-300 transition-colors duration-200 disabled:opacity-50"
                    >
                        <RefreshCw size={11} className={regenerate.isPending ? 'animate-spin' : ''} />
                        {t('REGENERATE')}
                    </button>
                </>
            ) : (
                <div className="h-8 rounded-lg bg-[rgba(255,255,255,0.03)] animate-pulse" />
            )}
        </div>
    )
}

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
        const expandedMin = updateMinMacronutrientsInUser(
            newUserSettings.minProteinsDay0 ?? 0,
            newUserSettings.minCarbsDay0 ?? 0,
            newUserSettings.minFatsDay0 ?? 0,
        )
        await updateUser.mutateAsync({ ...newUserSettings, ...expanded, ...expandedMin })
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

    const minProteins = watch('minProteinsDay0') ?? 0
    const minCarbs = watch('minCarbsDay0') ?? 0
    const minFats = watch('minFatsDay0') ?? 0
    const minTotalKcal = minProteins * 4 + minCarbs * 4 + minFats * 9

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

                {/* Target row */}
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#555] mb-1.5">{t('Target')}</div>
                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="mb-1 block text-[11px] font-semibold text-macro-protein">{t('Proteins')}</label>
                        <div className="flex items-center rounded-lg bg-[rgba(255,255,255,0.03)] border border-glass-border focus-within:border-glass-border-accent transition-all duration-300">
                            <input
                                className="flex-1 min-w-0 bg-transparent px-3 py-2 outline-none text-sm font-bold text-zinc-200"
                                type="text"
                                inputMode="decimal"
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
                                type="text"
                                inputMode="decimal"
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
                                type="text"
                                inputMode="decimal"
                                {...register('fatsDay0')}
                            />
                            <span className="pr-3 text-[11px] text-[#7a7a7a]">g</span>
                        </div>
                        {errors.fatsDay0 && <p className="mt-1 text-[10px] text-red-400">{errors.fatsDay0.message}</p>}
                    </div>
                </div>
                <div className="mt-2 text-center text-sm font-bold text-macro-kcal">
                    {totalKcal} kcal
                </div>

                {/* Min row */}
                <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.04)]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#555] mb-1.5">{t('Minimum')}</div>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="mb-1 block text-[11px] font-semibold text-macro-protein/60">{t('Proteins')}</label>
                            <div className="flex items-center rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] focus-within:border-glass-border-accent transition-all duration-300">
                                <input
                                    className="flex-1 min-w-0 bg-transparent px-3 py-1.5 outline-none text-xs font-bold text-zinc-400"
                                    type="text"
                                    inputMode="decimal"
                                    {...register('minProteinsDay0')}
                                />
                                <span className="pr-3 text-[10px] text-[#555]">g</span>
                            </div>
                            {errors.minProteinsDay0 && <p className="mt-1 text-[10px] text-red-400">{errors.minProteinsDay0.message}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-[11px] font-semibold text-macro-carbs/60">{t('Carbs')}</label>
                            <div className="flex items-center rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] focus-within:border-glass-border-accent transition-all duration-300">
                                <input
                                    className="flex-1 min-w-0 bg-transparent px-3 py-1.5 outline-none text-xs font-bold text-zinc-400"
                                    type="text"
                                    inputMode="decimal"
                                    {...register('minCarbsDay0')}
                                />
                                <span className="pr-3 text-[10px] text-[#555]">g</span>
                            </div>
                            {errors.minCarbsDay0 && <p className="mt-1 text-[10px] text-red-400">{errors.minCarbsDay0.message}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-[11px] font-semibold text-macro-fat/60">{t('Fats')}</label>
                            <div className="flex items-center rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] focus-within:border-glass-border-accent transition-all duration-300">
                                <input
                                    className="flex-1 min-w-0 bg-transparent px-3 py-1.5 outline-none text-xs font-bold text-zinc-400"
                                    type="text"
                                    inputMode="decimal"
                                    {...register('minFatsDay0')}
                                />
                                <span className="pr-3 text-[10px] text-[#555]">g</span>
                            </div>
                            {errors.minFatsDay0 && <p className="mt-1 text-[10px] text-red-400">{errors.minFatsDay0.message}</p>}
                        </div>
                    </div>
                    {(minProteins > 0 || minCarbs > 0 || minFats > 0) && (
                        <div className="mt-2 text-center text-xs font-bold text-macro-kcal/50">
                            {minTotalKcal} kcal min
                        </div>
                    )}
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
                            type="text"
                            inputMode="numeric"
                            {...register('numberOfMeals')}
                        />
                        {errors.numberOfMeals && <p className="mt-1 text-[10px] text-red-400">{errors.numberOfMeals.message}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-[11px] font-semibold text-[#9ca3af]">{t('Fiber')}</label>
                        <div className="flex items-center rounded-lg bg-[rgba(255,255,255,0.03)] border border-glass-border focus-within:border-glass-border-accent transition-all duration-300">
                            <input
                                className="flex-1 min-w-0 bg-transparent px-3 py-2 outline-none text-sm text-zinc-200"
                                type="text"
                                inputMode="decimal"
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
                                type="text"
                                inputMode="decimal"
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
                                type="text"
                                inputMode="decimal"
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
                    />

                </div>
            </div>

            {/* AI Data Link */}
            <ApiTokenCard />

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
