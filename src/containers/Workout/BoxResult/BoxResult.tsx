import { Trash2 } from 'lucide-react'
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm'
import { useState, useEffect } from 'react'
import ButtonPlusIcon from '@/components/ButtonPlusIcon/ButtonPlusIcon'
import { type WorkoutResultExerciseResultSchema } from '@/server/schema/workoutResult.schema'
import { range } from 'lodash-es'

interface BoxResultProps {
    value: WorkoutResultExerciseResultSchema
    index: number
    changeResult: (result: WorkoutResultExerciseResultSchema) => void
    deleteResult: () => void
    isOwner: boolean
    isLast: boolean
    openNewResult: (lastResult: { reps: number; weight: number, rir: number }) => void
    previousSetAt?: string
}

/** Format elapsed ms as a human rest-time string: "45s", "3m 42s", or "3m" */
const formatDiff = (diffMs: number): string => {
    const totalSec = Math.round(diffMs / 1000)
    if (totalSec <= 0) return ''
    const m = Math.floor(totalSec / 60)
    const s = totalSec % 60
    if (m === 0) return `${s}s`
    if (s === 0) return `${m}m`
    return `${m}m ${s}s`
}

/** Format UTC ISO string as "MM:SS" for the closed-view badge */
const toLocalMMSS = (isoStr: string, tz: string): string => {
    try {
        const full = new Date(isoStr).toLocaleTimeString('en-GB', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }) // "HH:MM:SS"
        const parts = full.split(':')
        return `${parts[1]}:${parts[2]}`
    } catch {
        return ''
    }
}

/**
 * Convert a local "MM:SS" string back to a UTC ISO string.
 * Keeps the original date and hour, only changes minutes and seconds.
 */
const fromLocalMMSS = (mmss: string, originalISO: string, tz: string): string => {
    try {
        const [m, s] = mmss.split(':').map(Number)
        if (isNaN(m) || isNaN(s) || m < 0 || m > 59 || s < 0 || s > 59) return originalISO

        const original = new Date(originalISO)

        // Get the full local HH:MM:SS in the target timezone
        const full = original.toLocaleTimeString('en-GB', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }) // "HH:MM:SS"
        const hour = full.split(':')[0]
        const localDate = original.toLocaleDateString('en-CA', { timeZone: tz }) // "YYYY-MM-DD"

        // Build full local time with the edited MM:SS
        const newTimeStr = `${hour}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        const approxUTC = new Date(`${localDate}T${newTimeStr}Z`)

        // Find the UTC offset via Intl
        const tzParts = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).formatToParts(approxUTC)

        const tzHour = parseInt(tzParts.find((p) => p.type === 'hour')!.value)
        const tzMinute = parseInt(tzParts.find((p) => p.type === 'minute')!.value)
        const inputH = parseInt(hour)

        let hourDiff = tzHour - inputH
        if (hourDiff > 12) hourDiff -= 24
        if (hourDiff < -12) hourDiff += 24
        const offsetMs = (hourDiff * 60 + (tzMinute - m)) * 60 * 1000

        return new Date(approxUTC.getTime() - offsetMs).toISOString()
    } catch {
        return originalISO
    }
}

const BoxResult = ({
    value,
    index,
    changeResult,
    deleteResult,
    isOwner,
    isLast,
    openNewResult,
    previousSetAt,
}: BoxResultProps) => {
    const [reps, setReps] = useState(value.reps.toString())
    const [weight, setWeight] = useState(value.weight.toString())
    const [rir, setRir] = useState((value.rir || 0).toString())
    const [open, setOpen] = useState(value.open || false)
    const [repsOptions] = useState(() => range(0, 100).map(i => i.toString()))
    const [weightOptions, setWeightOptions] = useState(['0'])
    const [rirOptions] = useState(() => range(0, 10).map(i => i.toString()))
    const [setAt, setSetAt] = useState(value.setAt || '')
    const [timezone] = useState(value.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone)
    const [localTimeDisplay, setLocalTimeDisplay] = useState(() =>
        value.setAt ? toLocalMMSS(value.setAt, value.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone) : ''
    )

    const loadWeight = (choosenWeight: string) => {
        const choosenWeightLocally = parseFloat(choosenWeight.replace(',', '.'))
        const weights = [value.weight.toString()]
        if (choosenWeightLocally) {
            if (choosenWeight != value.weight.toString()) {
                weights.push(choosenWeight)
            }
            for (let i = 1; i <= 4; i++) {
                weights.push((choosenWeightLocally + i / 4).toString())
            }
        } else {
            for (let i = 1; i <= 40; i++) {
                weights.push((i / 4).toString())
            }
        }
        setWeight(choosenWeight.toString())
        setWeightOptions(weights)
    }

    useEffect(() => {
        loadWeight(value.weight.toString())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const buildResult = (overrides: Partial<WorkoutResultExerciseResultSchema> = {}): WorkoutResultExerciseResultSchema => ({
        reps: parseInt(reps),
        weight: parseFloat(weight),
        rir: parseInt(rir),
        setAt,
        timezone,
        ...overrides,
    })

    const mmss = setAt ? toLocalMMSS(setAt, timezone) : ''
    const diff = setAt && previousSetAt
        ? formatDiff(new Date(setAt).getTime() - new Date(previousSetAt).getTime())
        : ''

    const handleSave = () => {
        const val = weight.replace(',', '.')
        setOpen(false)
        changeResult(buildResult({
            weight: parseFloat(val || '0'),
            open: false,
        }))
    }

    return (
        <>
            <div
                onClick={() => isOwner && setOpen(true)}
                className="flex flex-row border p-2 rounded items-center justify-center overflow-hidden"
            >
                <div className="min-w-0 flex-1 truncate">{weight}kg</div>
                <div className="min-w-0 flex-1 flex flex-col items-center text-xs">
                    <span className="font-semibold">#{index + 1}</span>
                    {mmss && <span className="truncate opacity-60">{mmss}</span>}
                    {diff && <span className="truncate opacity-60">rest {diff}</span>}
                </div>
                <div className="min-w-0 flex-1 truncate">{reps}r.</div>
                <div className="min-w-0 flex-1 truncate">{rir} RIR</div>
            </div>

            {open && isOwner && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" onClick={handleSave} />
                    <div className="relative z-50 w-full max-w-lg rounded-t-2xl sm:rounded-lg bg-white p-4 shadow-xl dark:bg-gray-900 sm:mx-4">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-base font-semibold">Set #{index + 1}</span>
                                <DialogConfirm onConfirmed={() => { setOpen(false); deleteResult() }}>
                                    <button
                                        className="rounded-full p-2 text-red-500 hover:bg-red-500/10"
                                        aria-label="delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </DialogConfirm>
                            </div>
                            <button
                                className="rounded bg-primary-dark px-4 py-2 text-base text-[#121212] hover:bg-[#64b5f6]"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                        <div className="mt-2">
                            <label className="mb-1 block text-sm text-gray-500">Weight</label>
                            <div className="flex items-center rounded border border-gray-300 focus-within:border-primary-dark dark:border-gray-600">
                                <input
                                    className="flex-1 bg-transparent px-3 py-2 text-base outline-none"
                                    inputMode="decimal"
                                    list={`weight-options-${index}`}
                                    value={weight}
                                    onChange={(e) => loadWeight(e.target.value)}
                                />
                            </div>
                            <datalist id={`weight-options-${index}`}>
                                {weightOptions.map((opt, idx) => (
                                    <option key={idx} value={opt} />
                                ))}
                            </datalist>
                        </div>
                        <div className="mt-3">
                            <label className="mb-1 block text-sm text-gray-500">Reps</label>
                            <select
                                className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 text-base outline-none focus:border-primary-dark dark:border-gray-600"
                                value={reps}
                                onChange={(e) => {
                                    setReps(e.target.value)
                                }}
                            >
                                {repsOptions.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-3">
                            <label className="mb-1 block text-sm text-gray-500">RIR</label>
                            <select
                                className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 text-base outline-none focus:border-primary-dark dark:border-gray-600"
                                value={rir}
                                onChange={(e) => {
                                    setRir(e.target.value)
                                }}
                            >
                                {rirOptions.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        {setAt && (
                            <div className="mt-3">
                                <label className="mb-1 block text-sm text-gray-500">Finished at (mm:ss)</label>
                                <input
                                    className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 text-base outline-none focus:border-primary-dark dark:border-gray-600"
                                    placeholder="MM:SS"
                                    value={localTimeDisplay}
                                    onChange={(e) => setLocalTimeDisplay(e.target.value)}
                                    onBlur={(e) => {
                                        const val = e.target.value.trim()
                                        if (!val || !val.includes(':')) return
                                        const newISO = fromLocalMMSS(val, setAt, timezone)
                                        setSetAt(newISO)
                                        setLocalTimeDisplay(toLocalMMSS(newISO, timezone))
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isOwner && isLast && (
                <ButtonPlusIcon
                    size="small"
                    variant="inline"
                    onClick={() =>
                        openNewResult({
                            reps: parseInt(reps),
                            weight: parseFloat(weight.replace(',', '.')),
                            rir: parseInt(rir),
                        })
                    }
                />
            )}
        </>
    )
}

export default BoxResult
