import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import styled from 'styled-components';
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm';
import { useState, useEffect } from 'react';
import { ExerciseResultSchemaProps } from '../workout.schema';
import ButtonPlusIcon from '@/components/ButtonPlusIcon/ButtonPlusIcon';

const Box = styled.div`
    min-height: 36px;
    width: 100%;
    padding: 8px 0;
    margin-top: 12px;
    border-radius: 4px;
    border: 1px solid #eee;
    font-size: 0.875rem;
    text-align: center;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    ${this} div {
        margin: auto;
    }
`

const Connected = styled.div`
    grid-column: 1 / 3;
`

interface BoxResultProps {
    value: ExerciseResultSchemaProps
    index: number
    changeResult: (result: ExerciseResultSchemaProps) => void
    deleteResult: () => void
    isOwner: boolean
    isLast: boolean
    openNewResult: (lastResult: { reps: number, weight: number }) => void
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
    const [open, setOpen] = useState(value.open || false)
    const [repsOptions, setRepsOptions] = useState(['0'])
    const [weightOptions, setWeightOptions] = useState(['0'])

    const loadWeight = (choosenWeight: string) => {
        const choosenWeightLocally = parseFloat(choosenWeight)
        const weights = [value.weight.toString()]
        if (choosenWeightLocally) {
            if (choosenWeight != value.weight.toString()) {
                weights.push(choosenWeight)
            }
            for (let i = 1; i <= 4; i++) {
                weights.push((choosenWeightLocally + (i / 4)).toString())
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
        let reps = []
        for (let i = 0; i <= 100; i++) {
            reps.push(i.toString())
        }
        setRepsOptions(reps)
        loadWeight(value.weight.toString())
    }, [])

    return (
        <>
            {open && isOwner
                ? <>
                    <Box
                        onClick={() => {
                            setOpen(false)
                            changeResult({ reps: parseInt(reps), weight: parseFloat(weight), open: false })
                        }}
                    >
                        <Connected><div>Click to save</div></Connected>
                        <div><div>#{index + 1}</div></div>
                        <div>
                            <IconButton aria-label="arrow">
                                <ArrowRightAltOutlinedIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </div>
                        <div>
                            <IconButton aria-label="save">
                                <CircleOutlinedIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </div>
                    </Box>
                    <Autocomplete
                        sx={{ marginTop: '8px' }}
                        disablePortal
                        value={weight}
                        options={weightOptions}
                        onChange={(_, value) => changeResult({ reps: parseInt(reps), weight: parseFloat(value || '0'), open })}
                        onInputChange={(_, valueLocally) => loadWeight(valueLocally)}
                        getOptionLabel={option => option ? option.toString() : ""}
                        renderInput={params => <TextField {...params} label="Weight" />}
                    />
                    <Autocomplete
                        sx={{ marginTop: '8px' }}
                        disablePortal
                        value={reps}
                        options={repsOptions}
                        onChange={(_, value) => changeResult({ reps: parseInt(value || '0'), weight: parseFloat(weight), open })}
                        onInputChange={(_, valueLocally) => setReps(valueLocally)}
                        getOptionLabel={option => option ? option.toString() : ""}
                        renderInput={params => <TextField {...params} label="Reps" />}
                    />
                </>
                : <Box onClick={() => setOpen(true)}>
                    <div>
                        {isOwner &&
                            <DialogConfirm confirmed={deleteResult}>
                                <IconButton aria-label="delete">
                                    <DeleteIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </DialogConfirm>
                        }
                    </div>
                    <div><div>{weight}kg</div></div>
                    <div><div>#{index + 1}</div></div>
                    <div><div>{reps}r.</div></div>
                    <div>
                        {isOwner &&
                            <IconButton aria-label="save">
                                <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        }
                    </div>
                </Box>
            }
            {isOwner && isLast && <ButtonPlusIcon size="small" onClick={() => openNewResult({ reps: parseInt(reps), weight: parseFloat(weight) })} />}
        </>
    );
}

export default BoxResult;