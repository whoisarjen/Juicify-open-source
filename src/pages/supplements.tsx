import useTranslation from "next-translate/useTranslation"
import { useState } from 'react'
import { trpc } from "@/utils/trpc.utils"
import { DialogSupplement } from "@/containers/DialogSupplement/DialogSupplement"
import type { SupplementSchema, IngredientSchema } from "@/server/schema/supplement.schema"
import NavbarOnlyTitle from "@/components/NavbarOnlyTitle/NavbarOnlyTitle"

const TIME_LABELS: Record<string, string> = {
    morning: 'morning',
    preworkout: 'preworkout',
    evening: 'evening',
    bedtime: 'bedtime',
}

const Supplements = () => {
    const { t } = useTranslation('supplements')
    const [selectedSupplement, setSelectedSupplement] = useState<SupplementSchema | null>(null)
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

    const { data: supplements = [] } = trpc.supplement.getAll.useQuery()
    const utils = trpc.useUtils()

    const toggleActive = trpc.supplement.toggleActive.useMutation({
        onSuccess(data) {
            utils.supplement.getAll.setData(undefined, currentData =>
                (currentData || []).map(s => s.id === data.id ? data : s)
            )
        },
    })

    const toggleExpanded = (id: number) => {
        setExpandedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const handleEdit = (supplement: typeof supplements[number]) => {
        setSelectedSupplement({
            ...supplement,
            ingredients: supplement.ingredients as IngredientSchema[],
        } as SupplementSchema)
    }

    const handleCloseDialog = () => setSelectedSupplement(null)

    return (
        <div className="flex flex-1 flex-col gap-4 min-w-0">
            <NavbarOnlyTitle title="supplements:title" />

            {supplements.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center px-8">
                    <p className="text-lg font-semibold text-zinc-300">{t('No supplements yet')}</p>
                    <p className="text-sm text-[#7a7a7a]">{t('No supplements description')}</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {supplements.map(supplement => {
                        const ingredients = supplement.ingredients as IngredientSchema[]
                        const isExpanded = expandedIds.has(supplement.id)

                        return (
                            <div key={supplement.id}>
                                <div
                                    className={`glass-interactive flex w-full cursor-pointer items-center gap-3 p-4 ${
                                        !supplement.isActive ? 'opacity-50' : ''
                                    }`}
                                    onClick={() => toggleExpanded(supplement.id)}
                                >
                                    <div className="flex flex-1 flex-col gap-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-bold text-zinc-200 truncate">
                                                {supplement.name}
                                            </h3>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            <span className="rounded bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 text-[11px] font-semibold text-[#7a7a7a]">
                                                {t(TIME_LABELS[supplement.timeOfDay] || supplement.timeOfDay)}
                                            </span>
                                            <span className="rounded bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 text-[11px] font-semibold text-[#7a7a7a]">
                                                {supplement.frequency === 1
                                                    ? t('Every day')
                                                    : t('Every X days', { count: supplement.frequency })}
                                            </span>
                                            <span className="rounded bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 text-[11px] font-semibold text-[#7a7a7a]">
                                                {ingredients.length === 1
                                                    ? t('ingredient', { count: 1 })
                                                    : t('ingredients', { count: ingredients.length })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {/* Edit button */}
                                        <button
                                            className="rounded-lg p-2 text-[#7a7a7a] hover:bg-[rgba(255,255,255,0.06)] cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleEdit(supplement)
                                            }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                            </svg>
                                        </button>

                                        {/* Toggle */}
                                        <button
                                            className={`relative h-6 w-10 rounded-full transition-colors cursor-pointer ${
                                                supplement.isActive ? 'bg-[#34d399]' : 'bg-[rgba(255,255,255,0.12)]'
                                            }`}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleActive.mutate({ id: supplement.id, isActive: !supplement.isActive })
                                            }}
                                        >
                                            <span
                                                className={`absolute top-[2px] h-5 w-5 rounded-full bg-white transition-transform ${
                                                    supplement.isActive ? 'right-[2px]' : 'left-[2px]'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded ingredients */}
                                {isExpanded && ingredients.length > 0 && (
                                    <div className="mx-4 -mt-1 rounded-b-lg border border-t-0 border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-4 py-3">
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                            {ingredients.map((ing, i) => (
                                                <div key={i} className="flex justify-between text-[12px]">
                                                    <span className="text-[#7a7a7a] truncate mr-2">{ing.name}</span>
                                                    <span className="text-[#555] font-semibold shrink-0">
                                                        {ing.amount} {ing.unit}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            <DialogSupplement
                supplement={selectedSupplement}
                externalOpen={!!selectedSupplement}
                onClose={handleCloseDialog}
            />
            <DialogSupplement
                supplement={null}
                hideButton={false}
            />
        </div>
    )
}

export default Supplements
