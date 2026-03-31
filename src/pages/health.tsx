import { useState } from 'react'
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
} from 'recharts'

const fmt = (d: Date | string) => moment(d).format('MMM D')
const fmtTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return h > 0 ? `${h}h ${m}m` : `${m}m`
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
    { label: '30d', value: 30 },
    { label: '60d', value: 60 },
]

export default function HealthDashboard() {
    const [days, setDays] = useState(30)

    const { data, isLoading } = trpc.withings.dashboard.useQuery({ days })

    if (isLoading) {
        return (
            <div className="mx-auto w-full max-w-3xl space-y-5 px-2 py-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="h-6 w-16 animate-pulse rounded bg-zinc-800" />
                    <div className="h-8 w-28 animate-pulse rounded-md bg-zinc-800/60" />
                </div>
                {/* Key metrics */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
                            <div className="mb-2 h-3 w-12 animate-pulse rounded bg-zinc-800" />
                            <div className="h-6 w-20 animate-pulse rounded bg-zinc-800" />
                        </div>
                    ))}
                </div>
                {/* Activity chart */}
                <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
                    <div className="mb-3 h-4 w-16 animate-pulse rounded bg-zinc-800" />
                    <div className="h-36 animate-pulse rounded bg-zinc-800/40" />
                    <div className="mt-3 grid grid-cols-3 gap-3 border-t border-zinc-800/60 pt-3">
                        {[0, 1, 2].map((i) => (
                            <div key={i}>
                                <div className="mb-1 h-3 w-12 animate-pulse rounded bg-zinc-800" />
                                <div className="h-5 w-16 animate-pulse rounded bg-zinc-800" />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Sleep chart */}
                <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
                    <div className="mb-3 h-4 w-12 animate-pulse rounded bg-zinc-800" />
                    <div className="h-36 animate-pulse rounded bg-zinc-800/40" />
                    <div className="mt-3 grid grid-cols-4 gap-3 border-t border-zinc-800/60 pt-3">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i}>
                                <div className="mb-1 h-3 w-10 animate-pulse rounded bg-zinc-800" />
                                <div className="h-5 w-14 animate-pulse rounded bg-zinc-800" />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Body chart */}
                <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
                    <div className="mb-3 h-4 w-10 animate-pulse rounded bg-zinc-800" />
                    <div className="h-36 animate-pulse rounded bg-zinc-800/40" />
                </div>
                {/* Workouts */}
                <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
                    <div className="mb-3 h-4 w-20 animate-pulse rounded bg-zinc-800" />
                    <div className="space-y-1.5">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-11 animate-pulse rounded-md bg-zinc-800/40" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (!data) return null

    const { activities, sleepRecords, workouts, measurements } = data

    const latest = activities[activities.length - 1]
    const latestSleep = sleepRecords[sleepRecords.length - 1]
    const latestMeasurement = measurements[measurements.length - 1]

    const avgSteps = activities.length
        ? Math.round(
              activities.reduce((s, a) => s + a.steps, 0) /
                  activities.length
          )
        : 0

    const avgSleepTime = sleepRecords.length
        ? Math.round(
              sleepRecords.reduce(
                  (s, r) => s + (r.totalSleepTime || 0),
                  0
              ) / sleepRecords.length
          )
        : 0

    const stepsData = activities.map((a) => ({
        date: fmt(a.date),
        steps: a.steps,
        cal: Math.round(Number(a.activeCalories)),
    }))

    const sleepData = sleepRecords.map((s) => ({
        date: fmt(s.date),
        deep: Math.round((s.deepSleepDuration || 0) / 60),
        light: Math.round((s.lightSleepDuration || 0) / 60),
        rem: Math.round((s.remSleepDuration || 0) / 60),
        awake: Math.round((s.wakeupDuration || 0) / 60),
        total: Math.round(
            ((s.deepSleepDuration || 0) +
                (s.lightSleepDuration || 0) +
                (s.remSleepDuration || 0)) /
                60
        ),
    }))

    const weightData = measurements.map((m) => ({
        date: fmt(m.whenAdded),
        weight: Number(m.weight),
        fat: m.fatRatio ? Number(m.fatRatio) : null,
        muscle: m.muscleMass ? Number(m.muscleMass) : null,
    }))

    return (
        <div className="mx-auto w-full max-w-3xl space-y-5 px-2 py-4">
            {/* Range picker */}
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold text-zinc-200">
                    Health
                </h1>
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
            </div>

            {/* Key metrics row */}
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
                        label="Calories"
                        value={
                            latest
                                ? Math.round(
                                      Number(latest.activeCalories)
                                  ).toLocaleString()
                                : '—'
                        }
                        unit="kcal"
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
                        sub={
                            avgSleepTime
                                ? `avg ${fmtTime(avgSleepTime)}`
                                : undefined
                        }
                    />
                </Card>
                <Card>
                    <Stat
                        label="Weight"
                        value={
                            latestMeasurement
                                ? Number(latestMeasurement.weight).toFixed(
                                      1
                                  )
                                : '—'
                        }
                        unit="kg"
                        sub={
                            latestMeasurement
                                ? fmt(latestMeasurement.whenAdded)
                                : undefined
                        }
                    />
                </Card>
            </div>

            {/* Activity chart */}
            <Card>
                <SectionHeader title="Activity" />
                <div className="h-36">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stepsData} barCategoryGap="20%">
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 10, fill: '#52525b' }}
                                axisLine={false}
                                tickLine={false}
                                interval="preserveStartEnd"
                            />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{
                                    background: '#18181b',
                                    border: '1px solid #27272a',
                                    borderRadius: 8,
                                    fontSize: 12,
                                }}
                                labelStyle={{ color: '#a1a1aa' }}
                                itemStyle={{ color: '#e4e4e7' }}
                            />
                            <Bar
                                dataKey="steps"
                                fill="#38bdf8"
                                radius={[3, 3, 0, 0]}
                                name="Steps"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {latest && (
                    <div className="mt-3 grid grid-cols-3 gap-3 border-t border-zinc-800/60 pt-3">
                        <Stat
                            label="Distance"
                            value={(
                                Number(latest.distance) / 1000
                            ).toFixed(1)}
                            unit="km"
                        />
                        <Stat
                            label="Elevation"
                            value={Math.round(Number(latest.elevation))}
                            unit="m"
                        />
                        <Stat
                            label="Active"
                            value={fmtTime(
                                (latest.moderateDuration || 0) +
                                    (latest.intenseDuration || 0)
                            )}
                        />
                    </div>
                )}
            </Card>

            {/* Sleep chart */}
            <Card>
                <SectionHeader title="Sleep" />
                {sleepData.some((d) => d.total > 0) ? (
                    <>
                        <div className="h-36">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <BarChart
                                    data={sleepData}
                                    barCategoryGap="20%"
                                >
                                    <XAxis
                                        dataKey="date"
                                        tick={{
                                            fontSize: 10,
                                            fill: '#52525b',
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#18181b',
                                            border: '1px solid #27272a',
                                            borderRadius: 8,
                                            fontSize: 12,
                                        }}
                                        labelStyle={{ color: '#a1a1aa' }}
                                        formatter={(v) =>
                                            `${v} min`
                                        }
                                    />
                                    <Bar
                                        dataKey="deep"
                                        stackId="sleep"
                                        fill="#6366f1"
                                        name="Deep"
                                        radius={[0, 0, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="light"
                                        stackId="sleep"
                                        fill="#818cf8"
                                        name="Light"
                                    />
                                    <Bar
                                        dataKey="rem"
                                        stackId="sleep"
                                        fill="#a78bfa"
                                        name="REM"
                                        radius={[3, 3, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        {latestSleep && latestSleep.totalSleepTime > 0 && (
                            <div className="mt-3 grid grid-cols-4 gap-3 border-t border-zinc-800/60 pt-3">
                                <Stat
                                    label="Deep"
                                    value={fmtTime(
                                        latestSleep.deepSleepDuration || 0
                                    )}
                                />
                                <Stat
                                    label="Light"
                                    value={fmtTime(
                                        latestSleep.lightSleepDuration || 0
                                    )}
                                />
                                <Stat
                                    label="REM"
                                    value={fmtTime(
                                        latestSleep.remSleepDuration || 0
                                    )}
                                />
                                <Stat
                                    label="Score"
                                    value={
                                        latestSleep.sleepScore ?? '—'
                                    }
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <p className="py-6 text-center text-xs text-zinc-600">
                        Sleep stage data requires a tracking device
                        (ScanWatch / Sleep Analyzer)
                    </p>
                )}
            </Card>

            {/* Weight & body comp */}
            {weightData.length > 0 && (
                <Card>
                    <SectionHeader title="Body" />
                    <div className="h-36">
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <AreaChart data={weightData}>
                                <defs>
                                    <linearGradient
                                        id="weightGrad"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="#38bdf8"
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="#38bdf8"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    tick={{
                                        fontSize: 10,
                                        fill: '#52525b',
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    domain={['dataMin - 1', 'dataMax + 1']}
                                    hide
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: '#18181b',
                                        border: '1px solid #27272a',
                                        borderRadius: 8,
                                        fontSize: 12,
                                    }}
                                    labelStyle={{ color: '#a1a1aa' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#38bdf8"
                                    strokeWidth={2}
                                    fill="url(#weightGrad)"
                                    name="Weight (kg)"
                                    dot={{ r: 3, fill: '#38bdf8' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    {latestMeasurement && (
                        <div className="mt-3 grid grid-cols-4 gap-3 border-t border-zinc-800/60 pt-3">
                            <Stat
                                label="Weight"
                                value={Number(
                                    latestMeasurement.weight
                                ).toFixed(1)}
                                unit="kg"
                            />
                            <Stat
                                label="Fat"
                                value={
                                    latestMeasurement.fatRatio
                                        ? Number(
                                              latestMeasurement.fatRatio
                                          ).toFixed(1)
                                        : '—'
                                }
                                unit="%"
                            />
                            <Stat
                                label="Muscle"
                                value={
                                    latestMeasurement.muscleMass
                                        ? Number(
                                              latestMeasurement.muscleMass
                                          ).toFixed(1)
                                        : '—'
                                }
                                unit="kg"
                            />
                            <Stat
                                label="Water"
                                value={
                                    latestMeasurement.waterMass
                                        ? Number(
                                              latestMeasurement.waterMass
                                          ).toFixed(1)
                                        : '—'
                                }
                                unit="kg"
                            />
                        </div>
                    )}
                </Card>
            )}

            {/* Workouts */}
            <Card>
                <SectionHeader
                    title="Workouts"
                    right={
                        <span className="text-xs tabular-nums text-zinc-600">
                            {workouts.length} total
                        </span>
                    }
                />
                {workouts.length > 0 ? (
                    <div className="space-y-1.5">
                        {workouts.slice(0, 10).map((w) => (
                            <div
                                key={w.id}
                                className="flex items-center justify-between rounded-md bg-zinc-800/40 px-3 py-2"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-xs">
                                        {w.categoryName === 'Walk'
                                            ? '🚶'
                                            : w.categoryName === 'Run'
                                              ? '🏃'
                                              : w.categoryName ===
                                                  'Bicycling' ||
                                                  w.categoryName ===
                                                      'Indoor Cycling' ||
                                                  w.categoryName ===
                                                      'Outdoor Cycling'
                                                ? '🚴'
                                                : w.categoryName ===
                                                    'Swimming'
                                                  ? '🏊'
                                                  : '💪'}
                                    </span>
                                    <div>
                                        <span className="text-sm text-zinc-200">
                                            {w.categoryName}
                                        </span>
                                        <span className="ml-2 text-[11px] text-zinc-600">
                                            {fmt(w.startDate)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-4 text-right">
                                    {Number(w.distance) > 0 && (
                                        <span className="text-xs tabular-nums text-zinc-400">
                                            {(
                                                Number(w.distance) / 1000
                                            ).toFixed(1)}{' '}
                                            km
                                        </span>
                                    )}
                                    <span className="text-xs tabular-nums text-zinc-400">
                                        {fmtTime(
                                            (new Date(
                                                w.endDate
                                            ).getTime() -
                                                new Date(
                                                    w.startDate
                                                ).getTime()) /
                                                1000
                                        )}
                                    </span>
                                    <span className="w-14 text-xs tabular-nums text-zinc-500">
                                        {Math.round(
                                            Number(w.calories)
                                        )}{' '}
                                        kcal
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="py-6 text-center text-xs text-zinc-600">
                        No workouts in this period
                    </p>
                )}
            </Card>
        </div>
    )
}
