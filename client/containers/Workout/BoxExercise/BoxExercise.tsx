import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import styled from 'styled-components';
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm';
import { useState, useEffect } from 'react';
import { ExerciseSchemaProps, ExerciseResultSchemaProps } from '../workout.schema';
import BoxResult from '../BoxResult/BoxResult';
import ButtonPlusIcon from '@/components/ButtonPlusIcon/ButtonPlusIcon';
import { omit } from 'lodash';

const Name = styled.div`
    min-height: 36px;
    width: calc(100% - 30px);
    padding: 7px 15px;
    background: #333;
    color: #fff;
    margin-top: 12px;
    text-align: center;
    border-radius: 4px;
    display: grid;
    grid-template-columns: 44px auto 44px;
    ${this} div {
        margin: auto;
        display: grid;
    }
    ${this} div button {
        margin: auto;
    }
    ${this} div div {
        margin: auto;
    }
`

const Previous = styled.div`
    width: 100%;
    text-align: center;
    margin-top: 12px;
`

interface BoxExerciseProps {
    isOwner: boolean
    exercise: ExerciseSchemaProps
    previousExercise?: ExerciseSchemaProps
    setNewValues: (arg0: ExerciseResultSchemaProps[]) => void
    deleteExerciseWithIndex: () => void
}

const BaseBoxExercise = ({
    exercise,
    previousExercise,
    setNewValues,
    isOwner,
    deleteExerciseWithIndex,
}: BoxExerciseProps) => {
    const [values, setValues] = useState<ExerciseResultSchemaProps[]>(exercise.results as ExerciseResultSchemaProps[])

    const changeResult = (object: ExerciseResultSchemaProps, index: number) => {
        let array = [...values]
        array[index] = { ...object }
        setNewValues(array)
    }

    const deleteResult = (index: number) => {
        const array = values.filter((x, i) => i != index)
        setValues(array)
        setNewValues(array)
    }

    const openNewResult = (lastResult: { reps: number, weight: number } | null) => {
        if (lastResult) {
            const previousValues = values.map((value: ExerciseResultSchemaProps) => omit(value, ['open']))
            setNewValues([
                ...previousValues.slice(0, previousValues.length - 1),
                {
                    reps: lastResult.reps,
                    weight: lastResult.weight,
                },
                {
                    reps: lastResult.reps,
                    weight: lastResult.weight,
                    open: true
                },
            ])
        } else {
            setNewValues([
                {
                    reps: 0,
                    weight: 0,
                    open: true
                }
            ])
        }
    }

    useEffect(() => {
        setValues(exercise.results as ExerciseResultSchemaProps[])
    }, [exercise])

    return (
        <div>
            <Name>
                <div>
                    {isOwner &&
                        <DialogConfirm confirmed={deleteExerciseWithIndex}>
                            <IconButton color="primary" component="span">
                                <DeleteIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </DialogConfirm>
                    }
                </div>
                <div>{exercise.name}</div>
                <div />
            </Name>
            <Previous>
                {previousExercise?.results?.map((result, index) => result.weight + "x" + result.reps + (index + 1 === previousExercise.results?.length ? '' : ', '))}
            </Previous>
            {values.map((value: ExerciseResultSchemaProps, index: number) =>
                <BoxResult
                    key={index + ' ' + value.open}
                    value={value}
                    index={index}
                    deleteResult={() => deleteResult(index)}
                    changeResult={object => changeResult(object, index)}
                    isOwner={isOwner}
                    isLast={index + 1 === values.length}
                    openNewResult={openNewResult}
                />
            )}
            {isOwner && !values.length && <ButtonPlusIcon size="small" click={() => openNewResult(null)} />}
        </div>
    );
}

export default BaseBoxExercise;