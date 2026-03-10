import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined'
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm'
import { useState, useEffect } from 'react'
import ButtonPlusIcon from '@/components/ButtonPlusIcon/ButtonPlusIcon'
import { type WorkoutResultExerciseResultSchema } from '@/server/schema/workoutResult.schema'
import { range } from 'lodash'

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
    const [repsOptions, setRepsOptions] = useState(['0'])
    const [weightOptions, setWeightOptions] = useState(['0'])
    const [rirOptions, setRirOptions] = useState(['0'])
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
        setRirOptions(range(0, 10).map(i => i.toString()))
        setRepsOptions(range(0, 100).map(i => i.toString()))
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
                        className="flex flex-row border p-2 rounded items-center justify-center"
                        onClick={() => {
                            setOpen(false)
                            changeResult(buildResult({ open: false }))
                        }}
                    >
                        <div className="flex-1">Click to save</div>
                        <div className="flex-1 flex flex-col items-center text-xs opacity-60">
                            {mmss ? (
                                <>
                                    <span>{mmss}</span>
                                    {diff && <span>rest {diff}</span>}
                                </>
                            ) : (
                                <span>{`#${index + 1}`}</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <IconButton aria-label="arrow">
                                <ArrowRightAltOutlinedIcon
                                    sx={{ fontSize: 20 }}
                                />
                            </IconButton>
                        </div>
                        <div className="flex-1">
                            <IconButton aria-label="save">
                                <CircleOutlinedIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </div>
                    </div>
                    <Autocomplete
                        sx={{ marginTop: '8px' }}
                        disablePortal
                        value={weight}
                        options={weightOptions}
                        onChange={(_, value) =>
                            changeResult(buildResult({
                                weight: parseFloat(value || '0'),
                                open,
                            }))
                        }
                        onInputChange={(_, valueLocally) =>
                            loadWeight(valueLocally)
                        }
                        getOptionLabel={(option) => option.toString()}
                        renderInput={(params) => (
                            <TextField {...params} label="Weight" />
                        )}
                    />
                    <Autocomplete
                        sx={{ marginTop: '8px' }}
                        disablePortal
                        value={reps}
                        options={repsOptions}
                        onChange={(_, value) =>
                            changeResult(buildResult({
                                reps: parseInt(value || '0'),
                                open,
                            }))
                        }
                        onInputChange={(_, valueLocally) =>
                            setReps(valueLocally)
                        }
                        getOptionLabel={(option) => option.toString()}
                        renderInput={(params) => (
                            <TextField {...params} label="Reps" />
                        )}
                    />
                    <Autocomplete
                        sx={{ marginTop: '8px' }}
                        disablePortal
                        value={rir}
                        options={rirOptions}
                        onChange={(_, value) =>
                            changeResult(buildResult({
                                rir: parseInt(value || '0'),
                                open,
                            }))
                        }
                        onInputChange={(_, valueLocally) =>
                            setRir(valueLocally)
                        }
                        getOptionLabel={(option) => option.toString()}
                        renderInput={(params) => (
                            <TextField {...params} label="RIR" />
                        )}
                    />
                    {setAt && (
                        <TextField
                            sx={{ marginTop: '8px' }}
                            label="Finished at (mm:ss)"
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
                            fullWidth
                        />
                    )}
                </>
            ) : (
                <div onClick={() => setOpen(true)} className="flex flex-row border p-2 rounded items-center justify-center">
                    <div className="flex-1">
                        {isOwner && (
                            <DialogConfirm onConfirmed={deleteResult}>
                                <IconButton aria-label="delete">
                                    <DeleteIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </DialogConfirm>
                        )}
                    </div>
                    <div className="flex-1">{weight}kg</div>
                    <div className="flex-1 flex flex-col items-center text-xs">
                        <span className="font-semibold">#{index + 1}</span>
                        {mmss && <span className="opacity-60">{mmss}</span>}
                        {diff && <span className="opacity-60">rest {diff}</span>}
                    </div>
                    <div className="flex-1">{reps}r.</div>
                    <div className="flex-1">{rir} RIR</div>
                </div>
            )}
            {isOwner && isLast && (
                <ButtonPlusIcon
                    size="small"
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
