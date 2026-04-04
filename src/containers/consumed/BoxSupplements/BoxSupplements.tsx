import { Pill } from 'lucide-react'
import useTranslation from 'next-translate/useTranslation'
import { trpc } from '@/utils/trpc.utils'

interface BoxSupplementsProps {
    whenAdded: string
}

const TIME_ORDER: Record<string, number> = {
    morning: 0,
    preworkout: 1,
    evening: 2,
    bedtime: 3,
}

const BoxSupplements = ({ whenAdded }: BoxSupplementsProps) => {
    const { t } = useTranslation('nutrition-diary')
    const { t: tSupp } = useTranslation('supplements')

    const { data: supplements = [] } = trpc.supplement.getDueForDate.useQuery(
        { date: new Date(whenAdded) },
        { enabled: !!whenAdded }
    )

    if (supplements.length === 0) return null

    const sorted = [...supplements].sort((a, b) =>
        (TIME_ORDER[a.timeOfDay] ?? 99) - (TIME_ORDER[b.timeOfDay] ?? 99)
    )

    return (
        <div className="glass p-4">
            <div className="flex items-center gap-2 mb-2">
                <Pill size={14} className="text-primary-dark" />
                <div className="text-[11px] font-bold uppercase tracking-wide text-[#7a7a7a]">
                    {t('Supplements today')}
                </div>
                <span className="text-[11px] font-semibold text-primary-dark ml-auto">
                    {supplements.length}
                </span>
            </div>
            <div className="flex flex-col gap-1">
                {sorted.map(s => (
                    <div key={s.id} className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-300 truncate mr-2">
                            {s.name}
                        </span>
                        <span className="shrink-0 rounded bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 text-[10px] font-semibold text-[#7a7a7a]">
                            {tSupp(s.timeOfDay)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BoxSupplements
