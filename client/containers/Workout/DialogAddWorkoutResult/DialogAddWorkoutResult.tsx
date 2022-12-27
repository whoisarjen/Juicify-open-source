import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import useTranslation from 'next-translate/useTranslation'
import { useCreateWorkoutResultMutation, useWorkoutPlansQuery } from '@/generated/graphql'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ButtonPlusIcon from '@/components/ButtonPlusIcon/ButtonPlusIcon'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TextField } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton'
import { v4 as uuidv4 } from 'uuid';
import { useSession } from 'next-auth/react'
import { type Exercise } from '@prisma/client'

const DialogAddWorkoutResult = () => {
    const { t } = useTranslation('workout')
    const router: any = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const { data: sessionData } = useSession()
    const [when, setWhen] = useState(new Date())
    const [choosenWorkoutPlan, setChoosenWorkoutPlan] = useState('')
    const [{ data, fetching }, getWorkoutPlans] = useWorkoutPlansQuery({
        variables: {
            username: router.query.login as string,
        },
        pause: true,
    })
    const [{ fetching: fetchingCreate }, createWorkoutResult] = useCreateWorkoutResultMutation()

    const DialogAddWorkoutResult = async () => {
        const workoutPlan = data?.workoutPlans?.find(workoutPlan => workoutPlan?.id === choosenWorkoutPlan)
        if (workoutPlan) {
            const newResult = await createWorkoutResult({
                id: uuidv4(),
                name: workoutPlan.name,
                when: new Date(when).toISOString().slice(0, 10),
                burnedCalories: workoutPlan.burnedCalories || 0,
                workoutPlan: workoutPlan.id,
                exercises: JSON.stringify(JSON.parse(workoutPlan.exercises || '[]').map((exercise: Exercise) => ({
                    ...exercise,
                    results: []
                })))
            })
            if (newResult?.data?.createWorkoutResult?.workoutResult?.id) {
                router.push(`/${sessionData?.user?.username}/workout/results/${newResult?.data?.createWorkoutResult?.workoutResult?.id}`)
            }
        }
    }

    useEffect(() => {
        if (router.query.login) {
            getWorkoutPlans()
        }
    }, [router.query.login])

    useEffect(() => {
        if (data?.workoutPlans?.[0]?.id) {
            setChoosenWorkoutPlan(data.workoutPlans[0].id)
        }
    }, [data?.workoutPlans, fetching])

    return (
        <>
            <ButtonPlusIcon click={() => setIsOpen(true)} />
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogTitle>{t('CREATE_RESULT')}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ marginBottom: '12px' }}>{t('CREATE_RESULT_DESCRIPTION')}</DialogContentText>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileDatePicker
                            value={when}
                            onChange={value => value && setWhen(value)}
                            label={t("Date")}
                            inputFormat="dd.MM.yyyy"
                            renderInput={(params: any) =>
                                <TextField
                                    sx={{ width: '100%' }}
                                    {...params}
                                />
                            }
                        />
                    </LocalizationProvider>

                    <FormControl fullWidth sx={{ marginTop: '12px' }}>
                        <InputLabel>{t('Workout plan')}</InputLabel>
                        <Select
                            value={choosenWorkoutPlan || data?.workoutPlans?.[0]?.id}
                            label={t('WORKOUT_PLAN')}
                            onChange={event => setChoosenWorkoutPlan(event.target.value)}
                        >
                            {data?.workoutPlans?.map(workoutPlan =>
                                workoutPlan &&
                                <MenuItem
                                    value={workoutPlan.id}
                                    key={workoutPlan.id}
                                >{workoutPlan.name}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsOpen(false)}>{t('Cancel')}</Button>
                    <LoadingButton
                        loading={fetchingCreate}
                        disabled={!choosenWorkoutPlan || !when}
                        onClick={DialogAddWorkoutResult}
                    >{t('Submit')}</LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DialogAddWorkoutResult;