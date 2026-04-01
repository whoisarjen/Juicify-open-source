import { Trash2, ArrowRight, Circle } from 'lucide-react'
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
        const choosenWeightLocally = parseFloat(choosenWeight)
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

    return (
        <>
            {open && isOwner ? (
                <>
                    <div
                        className="flex flex-row win2k-sunken p-1 items-center justify-center cursor-pointer"
                        onClick={() => {
                            setOpen(false)
                            changeResult(buildResult({ open: false }))
                        }}
                    >
                        <div className="flex-1 text-[11px] font-bold text-black">Click to save</div>
                        <div className="flex-1 flex flex-col items-center text-[10px] text-[#444444]">
                            {mmss ? (
                                <>
                                    <span>{mmss}</span>
                                    {diff && <span>rest {diff}</span>}
                                </>
                            ) : (
                                <span>{`#${index + 1}`}</span>
                            )}
                        </div>
                        <div className="flex-1 flex justify-center">
                            <button className="win2k-btn flex items-center gap-1" aria-label="arrow">
                                <ArrowRight size={11} />
                            </button>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <button className="win2k-btn flex items-center gap-1" aria-label="save">
                                <Circle size={11} />
                            </button>
                        </div>
                    </div>
                    <div className="mt-1">
                        <label className="mb-px block text-[10px] text-[#444444] text-left">Weight</label>
                        <div className="flex items-center win2k-sunken">
                            <input
                                className="flex-1 bg-white px-2 py-1 text-[11px] text-black outline-none"
                                list="weight-options"
                                value={weight}
                                onChange={(e) => {
                                    loadWeight(e.target.value)
                                    changeResult(buildResult({
                                        weight: parseFloat(e.target.value || '0'),
                                        open,
                                    }))
                                }}
                            />
                        </div>
                        <datalist id="weight-options">
                            {weightOptions.map((opt, idx) => (
                                <option key={idx} value={opt} />
                            ))}
                        </datalist>
                    </div>
                    <div className="mt-1">
                        <label className="mb-px block text-[10px] text-[#444444] text-left">Reps</label>
                        <select
                            className="w-full win2k-sunken bg-white px-2 py-1 text-[11px] text-black outline-none"
                            value={reps}
                            onChange={(e) => {
                                setReps(e.target.value)
                                changeResult(buildResult({
                                    reps: parseInt(e.target.value || '0'),
                                    open,
                                }))
                            }}
                        >
                            {repsOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-1">
                        <label className="mb-px block text-[10px] text-[#444444] text-left">RIR</label>
                        <select
                            className="w-full win2k-sunken bg-white px-2 py-1 text-[11px] text-black outline-none"
                            value={rir}
                            onChange={(e) => {
                                setRir(e.target.value)
                                changeResult(buildResult({
                                    rir: parseInt(e.target.value || '0'),
                                    open,
                                }))
                            }}
                        >
                            {rirOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                    {setAt && (
                        <div className="mt-1">
                            <label className="mb-px block text-[10px] text-[#444444] text-left">Finished at (mm:ss)</label>
                            <input
                                className="w-full win2k-sunken bg-white px-2 py-1 text-[11px] text-black outline-none"
                                placeholder="MM:SS"
                                value={localTimeDisplay}
                                onChange={(e) => setLocalTimeDisplay(e.target.value)}
                                onBlur={(e) => {
                                    const val = e.target.value.trim()
                                    if (!val || !val.includes(':')) return
                                    const newISO = fromLocalMMSS(val, setAt, timezone)
                                    setSetAt(newISO)
                                    setLocalTimeDisplay(toLocalMMSS(newISO, timezone))
                                    changeResult(buildResult({ setAt: newISO, open }))
                                }}
                            />
                        </div>
                    )}
                </>
            ) : (
                <div onClick={() => setOpen(true)} className="flex flex-row win2k-raised p-1 items-center justify-center cursor-pointer hover:bg-[#c8c4b8]">
                    <div className="flex-1">
                        {isOwner && (
                            <DialogConfirm onConfirmed={deleteResult}>
                                <button className="win2k-btn !px-1 !py-0 !min-h-0 h-[18px] w-[20px] text-[10px] flex items-center justify-center" aria-label="delete">
                                    <Trash2 size={11} />
                                </button>
                            </DialogConfirm>
                        )}
                    </div>
                    <div className="flex-1 text-[11px] text-black font-semibold">{weight}kg</div>
                    <div className="flex-1 flex flex-col items-center text-[10px]">
                        <span className="font-bold text-black">#{index + 1}</span>
                        {mmss && <span className="text-[#444444]">{mmss}</span>}
                        {diff && <span className="text-[#444444]">rest {diff}</span>}
                    </div>
                    <div className="flex-1 text-[11px] text-black">{reps}r.</div>
                    <div className="flex-1 text-[11px] text-black">{rir} RIR</div>
                </div>
            )}
            {isOwner && isLast && (
                <ButtonPlusIcon
                    size="small"
                    variant="inline"
                    onClick={() =>
                        openNewResult({
                            reps: parseInt(reps),
                            weight: parseFloat(weight),
                            rir: parseInt(rir),
                        })
                    }
                />
            )}
        </>
    )
}

export default BoxResult
