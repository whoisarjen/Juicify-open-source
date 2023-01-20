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
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ButtonPlusIcon from '@/components/ButtonPlusIcon/ButtonPlusIcon'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TextField } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton'
import { useSession } from 'next-auth/react'
import { trpc } from '@/utils/trpc.utils'
import { orderBy } from 'lodash'

const DialogAddWorkoutResult = () => {
    const { t } = useTranslation('workout')
    const router: any = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const { data: sessionData } = useSession()
    const [whenAdded, setWhenAdded] = useState(new Date())
    const [choosenWorkoutPlan, setChoosenWorkoutPlan] = useState(0)

    const username = sessionData?.user?.username || ''

    const utils = trpc.useContext()

    const workoutResultCreate = trpc.workoutResult.create.useMutation({
        onSuccess: (data) => {
            utils
                .workoutResult
                .getAll
                .setData({ username }, currentData =>
                    orderBy(
                        [...(currentData || []), data as unknown as WorkoutResult],
                        ['whenAdded'],
                        ['desc'],
                    )
                )

            router.push(`/${username}/workout/results/${data.id}`)
        }
    })

    const {
        data: workoutPlans = [],
        isFetching,
    } = trpc
        .workoutPlan
        .getAll
        .useQuery({ username }, { enabled: !!username })

    const DialogAddWorkoutResult = () => {
        const workoutPlan = workoutPlans.find(workoutPlan => workoutPlan.id === choosenWorkoutPlan)

        if (!workoutPlan) return

        workoutResultCreate.mutate({ workoutPlanId: workoutPlan.id, whenAdded })
    }

    useEffect(() => {
        if (!workoutPlans?.[0]?.id) return

        setChoosenWorkoutPlan(workoutPlans[0].id)
    }, [isFetching, workoutPlans])

    return (
        <>
            <ButtonPlusIcon onClick={() => setIsOpen(true)} />
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogTitle>{t('CREATE_RESULT')}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ marginBottom: '12px' }}>{t('CREATE_RESULT_DESCRIPTION')}</DialogContentText>

                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <MobileDatePicker
                            value={whenAdded}
                            onChange={value => value && setWhenAdded(value)}
                            label={t("Date")}
                            inputFormat="DD.MM.YYYY"
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
                            value={choosenWorkoutPlan || workoutPlans?.[0]?.id}
                            label={t('WORKOUT_PLAN')}
                            onChange={event => setChoosenWorkoutPlan(parseInt(event.target.value.toString()))}
                        >
                            {workoutPlans?.map(workoutPlan =>
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
                        loading={workoutResultCreate.isLoading}
                        disabled={!choosenWorkoutPlan || !whenAdded}
                        onClick={DialogAddWorkoutResult}
                    >{t('Submit')}</LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DialogAddWorkoutResult;