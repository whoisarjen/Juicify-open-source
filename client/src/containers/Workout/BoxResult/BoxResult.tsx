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
}

const BoxResult = ({
    value,
    index,
    changeResult,
    deleteResult,
    isOwner,
    isLast,
    openNewResult,
}: BoxResultProps) => {
    const [reps, setReps] = useState(value.reps.toString())
    const [weight, setWeight] = useState(value.weight.toString())
    const [rir, setRir] = useState((value.rir || 0).toString())
    const [open, setOpen] = useState(value.open || false)
    const [repsOptions, setRepsOptions] = useState(['0'])
    const [weightOptions, setWeightOptions] = useState(['0'])
    const [rirOptions, setRirOptions] = useState(['0'])

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

    return (
        <>
            {open && isOwner ? (
                <>
                    <div
                        className="flex flex-row border p-2 rounded items-center justify-center"
                        onClick={() => {
                            setOpen(false)
                            changeResult({
                                reps: parseInt(reps),
                                weight: parseFloat(weight),
                                rir: parseInt(rir),
                                open: false,
                            })
                        }}
                    >
                        <div className="flex-1">Click to save</div>
                        <div className="flex-1">#{index + 1}</div>
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
                            changeResult({
                                reps: parseInt(reps),
                                weight: parseFloat(value || '0'),
                                rir: parseInt(rir),
                                open,
                            })
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
                            changeResult({
                                reps: parseInt(value || '0'),
                                weight: parseFloat(weight),
                                rir: parseInt(rir),
                                open,
                            })
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
                            changeResult({
                                reps: parseFloat(reps),
                                weight: parseFloat(weight),
                                rir: parseInt(value || '0'),
                                open,
                            })
                        }
                        onInputChange={(_, valueLocally) =>
                            setRir(valueLocally)
                        }
                        getOptionLabel={(option) => option.toString()}
                        renderInput={(params) => (
                            <TextField {...params} label="RIR" />
                        )}
                    />
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
                    <div className="flex-1">#{index + 1}</div>
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
