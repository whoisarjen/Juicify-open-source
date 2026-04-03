import { useRouter } from 'next/router'
import { trpc } from '@/utils/trpc.utils'
import { useState } from 'react'
import moment from 'moment'
import {
    Activity, Moon, Heart, Utensils, Dumbbell,
    Flame, CalendarOff, ChevronDown, Gauge, Waves,
} from 'lucide-react'

// ─── Level → muted colors (UX research: desaturated colors reduce anxiety) ───

const LEVEL_CONFIG = {
    fresh: { color: '#34d399', bg: 'rgba(52, 211, 153, 0.08)', border: 'rgba(52, 211, 153, 0.18)' },
    good: { color: '#34d399', bg: 'rgba(52, 211, 153, 0.05)', border: 'rgba(52, 211, 153, 0.12)' },
    moderate: { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.06)', border: 'rgba(251, 191, 36, 0.14)' },
    fatigued: { color: '#fb923c', bg: 'rgba(251, 146, 60, 0.06)', border: 'rgba(251, 146, 60, 0.14)' },
    critical: { color: '#f87171', bg: 'rgba(248, 113, 113, 0.06)', border: 'rgba(248, 113, 113, 0.14)' },
} as const

const STATUS_DOT = {
    green: 'bg-[#34d399]',
    amber: 'bg-[#fbbf24]',
    red: 'bg-[#f87171]',
} as const

const SIGNAL_ICON: Record<string, typeof Activity> = {
    'Sleep quality': Moon,
    'Sleep duration': Moon,
    'Sleep efficiency': Moon,
    'Resting HR': Heart,
    'HR variability': Waves,
    'Energy deficit': Flame,
    'Energy balance': Flame,
    'Protein': Utensils,
    'Training load': Dumbbell,
    'Training variety': Gauge,
    'Rest days': CalendarOff,
}

const CONFIDENCE_LABEL = {
    high: '',
    moderate: 'Based on partial data',
    low: 'Limited data — accuracy improves over time',
} as const

const BoxFatigue = () => {
    const router = useRouter()
    const date = (router.query.date as string) || moment().format('YYYY-MM-DD')
    const [expanded, setExpanded] = useState(false)

    const { data, isLoading } = trpc.fatigue.getScore.useQuery(
        { date },
        { enabled: !!date }
    )

    if (isLoading || !data) return null
    if (data.dataPoints === 0) return null

    const config = LEVEL_CONFIG[data.level]
    const circumference = 2 * Math.PI * 18

    return (
        <div className="glass p-4">
            {/* Header */}
            <div className="text-[11px] font-bold uppercase tracking-wide text-[#7a7a7a] mb-3">
                Recovery status
            </div>

            {/* Score badge */}
            <div
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 mb-3"
                style={{ background: config.bg, border: `1px solid ${config.border}` }}
            >
                {/* Mini ring */}
                <div className="w-[44px] h-[44px] shrink-0">
                    <svg viewBox="0 0 44 44" className="w-full h-full">
                        <circle cx="22" cy="22" r="18" fill="none"
                            stroke="rgba(255,255,255,0.06)" strokeWidth="3.5" />
                        <circle cx="22" cy="22" r="18" fill="none"
                            stroke={config.color} strokeWidth="3.5" strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference * (1 - data.score / 100)}
                            transform="rotate(-90 22 22)"
                            style={{ transition: 'stroke-dashoffset 0.6s ease-in-out' }}
                        />
                        <text x="22" y="22" textAnchor="middle" dominantBaseline="central"
                            fill={config.color} fontSize="11" fontWeight="700"
                            fontFamily="Quicksand, sans-serif">
                            {data.score}
                        </text>
                    </svg>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold" style={{ color: config.color }}>
                        {data.title}
                    </div>
                    <div className="text-[11px] text-[#9ca3af] leading-snug mt-0.5">
                        {data.description}
                    </div>
                </div>
            </div>

            {/* Suggestion */}
            <div className="text-[11px] text-[#7a7a7a] leading-relaxed mb-2 px-0.5">
                {data.suggestion}
            </div>

            {/* Confidence note */}
            {data.confidence !== 'high' && (
                <div className="text-[9px] text-[#555] mb-2 px-0.5">
                    {CONFIDENCE_LABEL[data.confidence]}
                </div>
            )}

            {/* Expandable signals */}
            {data.signals.length > 0 && (
                <>
                    <button
                        className="flex items-center gap-1.5 text-[10px] font-semibold text-[#7a7a7a] hover:text-[#9ca3af] transition-colors cursor-pointer mb-1"
                        onClick={() => setExpanded(!expanded)}
                    >
                        <ChevronDown
                            size={12}
                            className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                        />
                        {data.signals.length} signals analyzed
                    </button>

                    <div
                        className="overflow-hidden transition-all duration-400"
                        style={{
                            maxHeight: expanded ? `${data.signals.length * 28 + 8}px` : '0px',
                            opacity: expanded ? 1 : 0,
                        }}
                    >
                        <div className="flex flex-col gap-1 pt-1">
                            {data.signals.map(({ name, status, detail }) => {
                                const Icon = SIGNAL_ICON[name] ?? Activity
                                return (
                                    <div key={name} className="flex items-center gap-2 py-0.5">
                                        <div className={`w-[5px] h-[5px] rounded-full shrink-0 ${STATUS_DOT[status]}`} />
                                        <Icon size={12} className="text-[#7a7a7a] shrink-0" />
                                        <span className="text-[10px] font-semibold text-[#9ca3af] shrink-0">
                                            {name}
                                        </span>
                                        <span className="text-[10px] text-[#7a7a7a] truncate ml-auto text-right">
                                            {detail}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default BoxFatigue
