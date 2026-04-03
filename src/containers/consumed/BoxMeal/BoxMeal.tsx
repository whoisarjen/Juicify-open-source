import { Plus, ChevronDown, MoreHorizontal, Copy, ClipboardPaste } from 'lucide-react'
import useTranslation from 'next-translate/useTranslation'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import BoxMealItem from '@/containers/consumed/BoxMeal/BoxMealItem/BoxMealItem'
import { sumMacroFromConsumed } from '@/utils/consumed.utils'
import DialogAddProducts from './DialogAddProducts/DialogAddProducts'
import { trpc } from '@/utils/trpc.utils'
import { useRouter } from 'next/router'
import moment from 'moment'

const CLIPBOARD_KEY = 'juicify_meal_clipboard'

interface ClipboardItem {
    productId: number
    howMany: number
}

interface BoxMealProps {
    index: number
    meal: Consumed[]
    isOwner: boolean
}

const BoxMeal = ({ index, meal, isOwner }: BoxMealProps) => {
    const { t } = useTranslation('nutrition-diary')
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(meal.length > 0)
    const [menuOpen, setMenuOpen] = useState(false)

    const { proteins, carbs, fats, calories } = useMemo(
        () => sumMacroFromConsumed(meal),
        [meal]
    )

    // Auto-open when meal gets items (e.g. after adding food)
    useEffect(() => {
        if (meal.length > 0) setIsOpen(true)
    }, [meal.length])

    const [hasClipboard, setHasClipboard] = useState(false)

    // Check clipboard when menu opens
    useEffect(() => {
        if (menuOpen) {
            setHasClipboard(!!localStorage.getItem(CLIPBOARD_KEY))
        }
    }, [menuOpen])

    const utils = trpc.useUtils()
    const createConsumed = trpc.consumed.create.useMutation({
        onSuccess() {
            utils.consumed.getPeriod.refetch()
        },
    })

    const handleCopy = useCallback(() => {
        const items: ClipboardItem[] = meal.map((c) => ({
            productId: c.productId,
            howMany: Number(c.howMany),
        }))
        localStorage.setItem(CLIPBOARD_KEY, JSON.stringify(items))
        setMenuOpen(false)
    }, [meal])

    const handlePaste = useCallback(async () => {
        const raw = localStorage.getItem(CLIPBOARD_KEY)
        if (!raw) return
        const items: ClipboardItem[] = JSON.parse(raw)
        const whenAdded = moment(router.query.date as string)
            .hour(moment().hour())
            .minute(moment().minute())
            .second(moment().second())
            .toDate()

        await Promise.all(
            items.map((item) =>
                createConsumed.mutateAsync({
                    productId: item.productId,
                    howMany: item.howMany,
                    meal: index,
                    whenAdded,
                })
            )
        )
        setMenuOpen(false)
    }, [createConsumed, index, router.query.date])

    const hasMeal = meal.length > 0

    // Macro calorie split for progress bar
    const proteinCals = proteins * 4
    const carbsCals = carbs * 4
    const fatCals = fats * 9
    const totalMacroCals = proteinCals + carbsCals + fatCals
    const pPct = totalMacroCals > 0 ? (proteinCals / totalMacroCals) * 100 : 0
    const cPct = totalMacroCals > 0 ? (carbsCals / totalMacroCals) * 100 : 0
    const fPct = totalMacroCals > 0 ? (fatCals / totalMacroCals) * 100 : 0

    return (
        <div className="glass">
            {/* Header */}
            <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.02)]"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-sm font-bold whitespace-nowrap">
                    {t('Meal')} {index + 1}
                </span>

                {/* Stacked progress bar — desktop */}
                <div className="hidden flex-1 h-[5px] rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
                    {hasMeal && (
                        <>
                            <div
                                className="h-full bg-macro-protein transition-all duration-500"
                                style={{ width: `${pPct}%`, borderRadius: pPct > 0 ? '3px 0 0 3px' : '' }}
                            />
                            <div
                                className="h-full bg-macro-carbs transition-all duration-500"
                                style={{ width: `${cPct}%` }}
                            />
                            <div
                                className="h-full bg-macro-fat transition-all duration-500"
                                style={{ width: `${fPct}%`, borderRadius: fPct > 0 ? '0 3px 3px 0' : '' }}
                            />
                        </>
                    )}
                </div>

                {/* Text macros — mobile */}
                <div className="flex flex-1 text-[11px] text-[#7a7a7a] justify-end gap-1 flex-wrap">
                    <span>{proteins.toFixed(1)}{t('P')}</span>
                    <span>{carbs.toFixed(1)}{t('C')}</span>
                    <span>{fats.toFixed(1)}{t('F')}</span>
                </div>

                <span className={`text-xs font-bold whitespace-nowrap ${hasMeal ? 'text-macro-kcal' : 'text-[#7a7a7a]'}`}>
                    {calories.toFixed(0)}Kcal
                </span>

                {isOwner && (
                    <>
                        <div onClick={(e) => e.stopPropagation()}>
                            <DialogAddProducts mealToAdd={index}>
                                <button
                                    className="w-[28px] h-[28px] rounded-lg border border-glass-border bg-glass flex items-center justify-center text-[#7a7a7a] hover:border-glass-border-accent hover:text-primary-dark transition-all duration-300 shrink-0 cursor-pointer"
                                    aria-label="Add"
                                >
                                    <Plus size={14} />
                                </button>
                            </DialogAddProducts>
                        </div>
                        <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button
                                className="w-[28px] h-[28px] rounded-lg border border-glass-border bg-glass flex items-center justify-center text-[#7a7a7a] hover:border-glass-border-accent hover:text-primary-dark transition-all duration-300 cursor-pointer"
                                aria-label="More options"
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                <MoreHorizontal size={14} />
                            </button>
                            {menuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                                    <div className="absolute right-0 bottom-full mb-1 z-50 min-w-[160px] rounded-lg border border-glass-border bg-[#1a1a1a] shadow-xl overflow-hidden">
                                        <button
                                            className="flex w-full items-center gap-3 px-4 py-3 text-xs text-zinc-300 hover:bg-[rgba(255,255,255,0.06)] transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                                            onClick={handleCopy}
                                            disabled={!hasMeal}
                                        >
                                            <Copy size={14} />
                                            {t('Copy meal')}
                                        </button>
                                        <button
                                            className="flex w-full items-center gap-3 px-4 py-3 text-xs text-zinc-300 hover:bg-[rgba(255,255,255,0.06)] transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                                            onClick={handlePaste}
                                            disabled={!hasClipboard}
                                        >
                                            <ClipboardPaste size={14} />
                                            {t('Paste meal')}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}

                <ChevronDown
                    size={14}
                    className={`text-[#7a7a7a] transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                />
            </div>

            {/* Body — collapsible */}
            <div
                className="overflow-hidden transition-all duration-400"
                style={{
                    maxHeight: isOpen ? '1000px' : '0px',
                    opacity: isOpen ? 1 : 0,
                }}
            >
                <div className="px-4 pb-3">
                    {meal.map((consumed) => (
                        <Fragment key={consumed.id}>
                            <div className="h-px w-full bg-glass-border" />
                            <BoxMealItem
                                consumed={consumed}
                                isOwner={isOwner}
                            />
                        </Fragment>
                    ))}

                    {/* Macro summary — desktop only */}
                    {hasMeal && (
                        <div className="hidden gap-3 pt-2 mt-1 border-t border-glass-border text-[11px] text-[#7a7a7a]">
                            <span className="flex items-center gap-1">
                                <span className="w-[5px] h-[5px] rounded-full bg-macro-protein" />
                                P: {proteins.toFixed(1)}g
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-[5px] h-[5px] rounded-full bg-macro-carbs" />
                                C: {carbs.toFixed(1)}g
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-[5px] h-[5px] rounded-full bg-macro-fat" />
                                F: {fats.toFixed(1)}g
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BoxMeal
