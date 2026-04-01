import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { trpc } from '@/utils/trpc.utils'
import moment from 'moment'
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts'
import { DialogMeasurement } from '@/containers/DialogMeasurement'
import ButtonPlusIcon from '@/components/ButtonPlusIcon/ButtonPlusIcon'

const fmt = (d: Date | string) => moment(d).format('MMM D')
const fmtTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const tooltipStyle = {
    background: '#18181b',
    border: '1px solid #27272a',
    borderRadius: 8,
    fontSize: 12,
}

const Stat = ({
    label,
    value,
    unit,
    sub,
}: {
    label: string
    value: string | number
    unit?: string
    sub?: string
}) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-[11px] uppercase tracking-wider text-zinc-500">
            {label}
        </span>
        <span className="text-xl font-semibold text-zinc-100 tabular-nums">
            {value}
            {unit && (
                <span className="ml-0.5 text-xs font-normal text-zinc-500">
                    {unit}
                </span>
            )}
        </span>
        {sub && (
            <span className="text-[11px] text-zinc-600">{sub}</span>
        )}
    </div>
)

const SectionHeader = ({
    title,
    right,
}: {
    title: string
    right?: React.ReactNode
}) => (
    <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-400">
            {title}
        </h2>
        {right}
    </div>
)

const Card = ({
    children,
    className = '',
}: {
    children: React.ReactNode
    className?: string
}) => (
    <div
        className={`rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4 ${className}`}
    >
        {children}
    </div>
)

const RANGE_OPTIONS = [
    { label: '7d', value: 7 },
    { label: '14d', value: 14 },
    { label: '30d', value: 30 },
]

const SkeletonCard = ({ rows = 0 }: { rows?: number }) => (
    <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
        <div className="mb-3 h-4 w-16 animate-pulse rounded bg-zinc-800" />
        <div className="h-36 animate-pulse rounded bg-zinc-800/40" />
        {rows > 0 && (
            <div className="mt-3 flex gap-3 border-t border-zinc-800/60 pt-3">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex-1">
                        <div className="mb-1 h-3 w-10 animate-pulse rounded bg-zinc-800" />
                        <div className="h-5 w-14 animate-pulse rounded bg-zinc-800" />
                    </div>
                ))}
            </div>
        )}
    </div>
)

export default function MeasurementsPage() {
    const [days, setDays] = useState(7)
    const [selectedMeasurement, setSelectedMeasurement] =
        useState<Measurement | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const { data: sessionData } = useSession()
    const username = sessionData?.user?.username || ''

    const { data: measurements = [] } = trpc.measurement.getAll.useQuery(
        { username },
        { enabled: !!username }
    )

    const isAdmin = (sessionData?.user as any)?.permissions?.some(
        (p: any) => p.name === 'Administration'
    )

    const { data: healthData, isLoading: healthLoading } =
        trpc.withings.dashboard.useQuery(
            { days },
            { enabled: !!isAdmin && !!sessionData?.user, trpc: { ssr: false } }
        )

    const showHealth = isAdmin && !!healthData

    const activities = healthData?.activities ?? []
    const sleepRecords = healthData?.sleepRecords ?? []
    const lastSyncedAt = healthData?.lastSyncedAt ?? null

    const latest = activities[activities.length - 1]
    const latestSleep = sleepRecords[sleepRecords.length - 1]

    const avgSteps = activities.length
        ? Math.round(
              activities.reduce((s, a) => s + a.steps, 0) / activities.length
          )
        : 0

    const avgSleepTime = sleepRecords.length
        ? Math.round(
              sleepRecords.reduce((s, r) => s + (r.totalSleepTime || 0), 0) /
                  sleepRecords.length
          )
        : 0

    const stepsData = activities.map((a) => ({
        date: fmt(a.date),
        steps: a.steps,
    }))

    const tdeeData = activities.map((a) => ({
        date: fmt(a.date),
        bmr: Math.round(Number(a.totalCalories) - Number(a.activeCalories)),
        active: Math.round(Number(a.activeCalories)),
        total: Math.round(Number(a.totalCalories)),
    }))

    const avgTdee = tdeeData.length
        ? Math.round(tdeeData.reduce((s, d) => s + d.total, 0) / tdeeData.length)
        : 0

    const sleepData = sleepRecords.map((s) => ({
        date: fmt(s.date),
        deep: Math.round((s.deepSleepDuration || 0) / 60),
        light: Math.round((s.lightSleepDuration || 0) / 60),
        rem: Math.round((s.remSleepDuration || 0) / 60),
        total: Math.round(
            ((s.deepSleepDuration || 0) +
                (s.lightSleepDuration || 0) +
                (s.remSleepDuration || 0)) /
                60
        ),
    }))

    const hrData = sleepRecords
        .filter((s) => s.hrAverage)
        .map((s) => ({
            date: fmt(s.date),
            avg: s.hrAverage,
            min: s.hrMin,
            max: s.hrMax,
        }))

    const latestHr = hrData[hrData.length - 1]
    const avgHr = hrData.length
        ? Math.round(hrData.reduce((s, h) => s + (h.avg || 0), 0) / hrData.length)
        : 0

    const bodyMeasData = [...measurements]
        .filter((m) => m.waist || m.hips)
        .reverse()
        .map((m) => ({
            date: fmt(m.whenAdded),
            waist: m.waist ? Number(m.waist) : null,
            hips: m.hips ? Number(m.hips) : null,
            ratio:
                m.waist && m.hips
                    ? Math.round((Number(m.waist) / Number(m.hips)) * 100) / 100
                    : null,
        }))

    return (
        <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col space-y-5 px-2 py-4 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold text-zinc-200">
                    Measurements
                </h1>
                {isAdmin && (
                    <div className="flex gap-1 rounded-md bg-zinc-800/60 p-0.5">
                        {RANGE_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setDays(opt.value)}
                                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                                    days === opt.value
                                        ? 'bg-sky-500/20 text-sky-400'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Skeleton loading */}
            {isAdmin && healthLoading && (
                <>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
                                <div className="mb-2 h-3 w-12 animate-pulse rounded bg-zinc-800" />
                                <div className="h-6 w-20 animate-pulse rounded bg-zinc-800" />
                            </div>
                        ))}
                    </div>
                    <SkeletonCard rows={3} />
                    <SkeletonCard rows={3} />
                    <SkeletonCard rows={4} />
                    <SkeletonCard rows={4} />
                </>
            )}

            {showHealth && (
                <>
                    {lastSyncedAt && (
                        <p className="text-right text-[11px] text-zinc-600">
                            Last synced: {new Date(lastSyncedAt).toLocaleString()}
                        </p>
                    )}
                    {/* Key metrics */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <Card>
                            <Stat
                                label="Steps"
                                value={latest?.steps?.toLocaleString() ?? '—'}
                                sub={`avg ${avgSteps.toLocaleString()}`}
                            />
                        </Card>
                        <Card>
                            <Stat
                                label="TDEE"
                                value={
                                    latest
                                        ? Math.round(Number(latest.totalCalories)).toLocaleString()
                                        : '—'
                                }
                                unit="kcal"
                                sub={
                                    latest
                                        ? `${Math.round(Number(latest.totalCalories) - Number(latest.activeCalories))} + ${Math.round(Number(latest.activeCalories))} active`
                                        : undefined
                                }
                            />
                        </Card>
                        <Card>
                            <Stat
                                label="Sleep"
                                value={
                                    latestSleep?.totalSleepTime
                                        ? fmtTime(latestSleep.totalSleepTime)
                                        : '—'
                                }
                                sub={avgSleepTime ? `avg ${fmtTime(avgSleepTime)}` : undefined}
                            />
                        </Card>
                        <Card>
                            <Stat
                                label="Weight"
                                value={
                                    measurements[0]
                                        ? Number(measurements[0].weight).toFixed(1)
                                        : '—'
                                }
                                unit="kg"
                                sub={
                                    measurements[0]
                                        ? fmt(measurements[0].whenAdded)
                                        : undefined
                                }
                            />
                        </Card>
                    </div>

                    {/* TDEE */}
                    <Card>
                        <SectionHeader
                            title="TDEE"
                            right={
                                <span className="text-xs tabular-nums text-zinc-600">
                                    avg {avgTdee.toLocaleString()} kcal
                                </span>
                            }
                        />
                        <div className="h-36">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={tdeeData} barCategoryGap="20%">
                                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#52525b' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                                    <YAxis hide />
                                    <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#a1a1aa' }} formatter={(v: any) => `${Number(v).toLocaleString()} kcal`} />
                                    <Bar dataKey="bmr" stackId="tdee" fill="#f97316" fillOpacity={0.5} name="BMR" />
                                    <Bar dataKey="active" stackId="tdee" fill="#f97316" name="Active" radius={[3, 3, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        {latest && (
                            <div className="mt-3 grid grid-cols-3 gap-3 border-t border-zinc-800/60 pt-3">
                                <Stat label="Total" value={Math.round(Number(latest.totalCalories)).toLocaleString()} unit="kcal" />
                                <Stat label="BMR" value={Math.round(Number(latest.totalCalories) - Number(latest.activeCalories)).toLocaleString()} unit="kcal" />
                                <Stat label="Active" value={Math.round(Number(latest.activeCalories)).toLocaleString()} unit="kcal" />
                            </div>
                        )}
                    </Card>

                    {/* Activity */}
                    <Card>
                        <SectionHeader title="Activity" />
                        <div className="h-36">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stepsData} barCategoryGap="20%">
                                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#52525b' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                                    <YAxis hide />
                                    <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#a1a1aa' }} itemStyle={{ color: '#e4e4e7' }} />
                                    <Bar dataKey="steps" fill="#38bdf8" radius={[3, 3, 0, 0]} name="Steps" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        {latest && (
                            <div className="mt-3 grid grid-cols-3 gap-3 border-t border-zinc-800/60 pt-3">
                                <Stat label="Distance" value={(Number(latest.distance) / 1000).toFixed(1)} unit="km" />
                                <Stat label="Elevation" value={Math.round(Number(latest.elevation))} unit="m" />
                                <Stat label="Active" value={fmtTime((latest.moderateDuration || 0) + (latest.intenseDuration || 0))} />
                            </div>
                        )}
                    </Card>

                    {/* Sleep */}
                    <Card>
                        <SectionHeader title="Sleep" />
                        {sleepData.some((d) => d.total > 0) ? (
                            <>
                                <div className="h-36">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={sleepData} barCategoryGap="20%">
                                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#52525b' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                                            <YAxis hide />
                                            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#a1a1aa' }} formatter={(v) => `${v} min`} />
                                            <Bar dataKey="deep" stackId="sleep" fill="#6366f1" name="Deep" />
                                            <Bar dataKey="light" stackId="sleep" fill="#818cf8" name="Light" />
                                            <Bar dataKey="rem" stackId="sleep" fill="#a78bfa" name="REM" radius={[3, 3, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                {latestSleep && latestSleep.totalSleepTime > 0 && (
                                    <div className="mt-3 grid grid-cols-4 gap-3 border-t border-zinc-800/60 pt-3">
                                        <Stat label="Deep" value={fmtTime(latestSleep.deepSleepDuration || 0)} />
                                        <Stat label="Light" value={fmtTime(latestSleep.lightSleepDuration || 0)} />
                                        <Stat label="REM" value={fmtTime(latestSleep.remSleepDuration || 0)} />
                                        <Stat label="Score" value={latestSleep.sleepScore ?? '—'} />
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="py-6 text-center text-xs text-zinc-600">
                                Sleep stage data requires a tracking device
                            </p>
                        )}
                    </Card>

                    {/* Heart Rate */}
                    {hrData.length > 0 && (
                        <Card>
                            <SectionHeader title="Heart Rate" right={<span className="text-[11px] text-zinc-600">during sleep</span>} />
                            <div className="h-36">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={hrData}>
                                        <defs>
                                            <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} />
                                                <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="hrBandGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.08} />
                                                <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.02} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#52525b' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                                        <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                                        <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#a1a1aa' }} formatter={(v: any) => `${v} bpm`} />
                                        <Area type="monotone" dataKey="max" stroke="none" fill="url(#hrBandGrad)" name="Max" />
                                        <Area type="monotone" dataKey="avg" stroke="#f43f5e" strokeWidth={2} fill="url(#hrGrad)" name="Avg" dot={{ r: 2, fill: '#f43f5e' }} />
                                        <Area type="monotone" dataKey="min" stroke="#f43f5e" strokeWidth={1} strokeDasharray="3 3" strokeOpacity={0.4} fill="none" name="Min" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-3 grid grid-cols-4 gap-3 border-t border-zinc-800/60 pt-3">
                                <Stat label="Resting" value={latestHr?.avg ?? '—'} unit="bpm" />
                                <Stat label="Min" value={latestHr?.min ?? '—'} unit="bpm" />
                                <Stat label="Max" value={latestHr?.max ?? '—'} unit="bpm" />
                                <Stat label="Avg" value={avgHr || '—'} unit="bpm" sub={`${hrData.length}d avg`} />
                            </div>
                            {latestSleep?.rrAverage && (
                                <div className="mt-3 grid grid-cols-3 gap-3 border-t border-zinc-800/60 pt-3">
                                    <Stat label="Breathing" value={latestSleep.rrAverage} unit="br/min" />
                                    <Stat label="Min" value={latestSleep.rrMin ?? '—'} unit="br/min" />
                                    <Stat label="Max" value={latestSleep.rrMax ?? '—'} unit="br/min" />
                                </div>
                            )}
                        </Card>
                    )}

                </>
            )}

            {/* Body measurements chart (waist/hips) */}
            {bodyMeasData.length > 1 && (
                <Card>
                    <SectionHeader title="Body Measurements" />
                    <div className="h-36">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={bodyMeasData}>
                                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#52525b' }} axisLine={false} tickLine={false} />
                                <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
                                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#a1a1aa' }} />
                                <Line type="monotone" dataKey="waist" stroke="#fb923c" strokeWidth={2} name="Waist (cm)" dot={{ r: 3, fill: '#fb923c' }} connectNulls />
                                <Line type="monotone" dataKey="hips" stroke="#a78bfa" strokeWidth={2} name="Hips (cm)" dot={{ r: 3, fill: '#a78bfa' }} connectNulls />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            )}

            {/* Weight trend chart */}
            {measurements.length > 1 && (
                <Card>
                    <SectionHeader title="Weight" />
                    <div className="h-36">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={[...measurements]
                                    .reverse()
                                    .map((m) => ({
                                        date: fmt(m.whenAdded),
                                        weight: Number(m.weight) || null,
                                        waist: m.waist ? Number(m.waist) : null,
                                        hips: m.hips ? Number(m.hips) : null,
                                    }))}
                            >
                                <defs>
                                    <linearGradient id="manualWeightGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#52525b' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                                <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
                                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#a1a1aa' }} />
                                <Area type="monotone" dataKey="weight" stroke="#38bdf8" strokeWidth={2} fill="url(#manualWeightGrad)" name="Weight (kg)" dot={{ r: 3, fill: '#38bdf8' }} connectNulls />
                                <Area type="monotone" dataKey="waist" stroke="#fb923c" strokeWidth={1.5} fill="none" name="Waist (cm)" dot={{ r: 2, fill: '#fb923c' }} connectNulls />
                                <Area type="monotone" dataKey="hips" stroke="#a78bfa" strokeWidth={1.5} fill="none" name="Hips (cm)" dot={{ r: 2, fill: '#a78bfa' }} connectNulls />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            )}

            {/* Weight entries */}
            <Card>
                <SectionHeader
                    title="Entries"
                    right={
                        <span className="text-xs tabular-nums text-zinc-600">
                            {measurements.length} total
                        </span>
                    }
                />
                <div className="space-y-1">
                    {measurements.slice(0, 7).map((m) => (
                        <div
                            key={m.id}
                            onClick={() => {
                                setSelectedMeasurement(m)
                                setDialogOpen(true)
                            }}
                            className="flex cursor-pointer items-center justify-between rounded-md bg-zinc-800/40 px-3 py-2.5 transition-colors hover:bg-zinc-800/70"
                        >
                            <span className="text-xs text-zinc-500">
                                {moment(m.whenAdded).format('DD.MM.YYYY')}
                            </span>
                            <div className="flex items-center gap-4">
                                {Number(m.weight) > 0 && (
                                    <span className="text-sm font-semibold tabular-nums text-zinc-200">
                                        {(Math.round(Number(m.weight) * 10) / 10)}
                                        <span className="ml-0.5 text-xs font-normal text-zinc-500">kg</span>
                                    </span>
                                )}
                                {m.waist && (
                                    <span className="text-xs tabular-nums text-orange-400/80">
                                        {Number(m.waist).toFixed(1)} cm
                                    </span>
                                )}
                                {m.hips && (
                                    <span className="text-xs tabular-nums text-violet-400/80">
                                        {Number(m.hips).toFixed(1)} cm
                                    </span>
                                )}
                                {m.waist && m.hips && (
                                    <span className="text-[11px] tabular-nums text-zinc-600">
                                        {(Number(m.waist) / Number(m.hips)).toFixed(2)}
                                    </span>
                                )}
                                {m.source === 'withings' && (
                                    <span className="text-[10px] text-sky-600">W</span>
                                )}
                            </div>
                        </div>
                    ))}
                    {measurements.length === 0 && (
                        <p className="py-6 text-center text-xs text-zinc-600">
                            No entries yet — tap + to add your first
                        </p>
                    )}
                </div>
            </Card>

            {/* Dialog */}
            <DialogMeasurement
                measurement={selectedMeasurement}
                defaultWeight={Number(measurements[0]?.weight)}
                externalOpen={dialogOpen}
                onClose={() => {
                    setDialogOpen(false)
                    setSelectedMeasurement(null)
                }}
                hideButton
            />

            {/* Floating add button */}
            <ButtonPlusIcon
                onClick={() => {
                    setSelectedMeasurement(null)
                    setDialogOpen(true)
                }}
            />
        </div>
    )
}
