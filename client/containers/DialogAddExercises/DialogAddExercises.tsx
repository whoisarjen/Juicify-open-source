import Dialog from '@mui/material/Dialog';
import styled from 'styled-components'
import SlideUp from '../../transition/SlideUp';
import Autocomplete from '@mui/material/Autocomplete';
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle';
import { useState, ReactNode, Fragment, useMemo } from 'react';
import ButtonCloseDialog from '@/components/ButtonCloseDialog/ButtonCloseDialog';
import ButtonPlusIcon from '@/components/ButtonPlusIcon/ButtonPlusIcon';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { grey } from '@mui/material/colors';
import { TextField, CircularProgress } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import BoxExercise from '@/containers/DialogAddExercises/BoxExercise/BoxExercise';
import DialogCreateExercise from '@/containers/DialogAddExercises/DialogCreateExercise/DialogCreateExercise';
import TabsAddDialog from '@/components/TabsAddDialog/TabsAddDialog';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { addToChecked, cleanChecked, removeFromChecked } from '@/redux/features/dialogAddExercises.slice';
import ButtonSubmitItems from '@/components/ButtonSubmitItems/ButtonSubmitItems';
import { trpc } from '@/utils/trpc';
import { env } from '@/env/client.mjs';
import { type Exercise } from '@prisma/client';

const DialogContent = styled.div`
    width: 100%;
    margin: 0 auto;
    max-width: 702px;
    padding: 12px;
    display: grid;
    min-height: calc(100vh - var(--BothNavHeightAndPadding));
    ${this} {
        min-height: auto;
    }
    @media (max-width: 726px) {
        ${this} {
            width: calc(100% - 24px);
        }
    }
`

const ButtonHolder = styled.div`
    margin: auto;
    display: grid;
`

export interface DialogAddExercisesProps {
    children?: ReactNode,
    skipThoseIDS: (WorkoutPlanExercise | WorkoutResultExercise)[],
    addThoseExercises: (exercises: (WorkoutPlanExercise | WorkoutResultExercise)[]) => void,
}

const DialogAddExercises = ({
    children,
    skipThoseIDS,
    addThoseExercises
}: DialogAddExercisesProps) => {
    const { t } = useTranslation()
    const [tab, setTab] = useState(0)
    const { checked } = useAppSelector(state => state.dialogAddExercises)
    const dispatch = useAppDispatch()
    const [isDialog, setIsDialog] = useState(false)
    const [name, setName] = useState('')

    const enabled = name.length >= env.NEXT_PUBLIC_SEARCH_MIN_NAME_LENGTH && tab === 0

    const {
        data: loadedExercises,
        isLoading: fetching,
    } = trpc
        .exercise
        .getAll
        .useQuery({ name }, { enabled: name.length >= env.NEXT_PUBLIC_SEARCH_MIN_NAME_LENGTH })

    // Default isLoading is bugged, when enbaled = false
    const isLoading = fetching && enabled

    const addExercisesToWorkoutPlan = async () => {
        addThoseExercises(checked)
        setIsDialog(false)
        setName('')
        dispatch(cleanChecked())

    }

    const exercises = useMemo(() => {
        if (tab === 1) {
            return checked
        }

        if (!loadedExercises) {
            return []
        }

        return loadedExercises.filter(exercise => !skipThoseIDS.some(x => x.id === exercise?.id))
    }, [skipThoseIDS.length, isLoading, checked?.length, tab])

    return (
        <>
            <ButtonHolder onClick={() => setIsDialog(true)}>
                {children || <ButtonPlusIcon icon={<FitnessCenterIcon sx={{ color: grey[50] }} />} />}
            </ButtonHolder>

            <Dialog fullScreen scroll='body' open={isDialog} TransitionComponent={SlideUp}>
                <DialogContent>
                    <NavbarOnlyTitle title="workout:ADD_EXERCISES" />

                    <Autocomplete
                        value={name}
                        sx={{ marginBottom: '10px', width: '100%' }}
                        open={false}
                        isOptionEqualToValue={(option, value) => option === value}
                        getOptionLabel={option => option ? option : ''}
                        options={[]}
                        loading={isLoading}
                        onInputChange={(_e, value) => setName(value.trim().toLowerCase())}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t('Search')}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <Fragment>
                                            {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </Fragment>
                                    ),
                                }}
                            />
                        )}
                    />

                    <TabsAddDialog changeTab={(value: number) => setTab(value)} checkedLength={checked.length} />

                    {exercises.map(exercise =>
                        <BoxExercise
                            isChecked={checked.some(x => x.id === exercise.id)}
                            onCheck={state => state ? dispatch(addToChecked(exercise)) : dispatch(removeFromChecked(exercise))}
                            exercise={exercise}
                            key={exercise.id}
                        />
                    )}

                    <DialogCreateExercise onCreated={createdName => createdName == name ? setName('') : setName(createdName)} />

                    <ButtonSubmitItems showNumber={checked.length} clicked={addExercisesToWorkoutPlan} />

                    <ButtonCloseDialog clicked={() => setIsDialog(false)} />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default DialogAddExercises;