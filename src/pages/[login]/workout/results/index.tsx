import { useRouter } from 'next/router'
import DialogAddWorkoutResult from '@/containers/Workout/DialogAddWorkoutResult/DialogAddWorkoutResult'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import BoxWorkout from '@/containers/Workout/BoxWorkout/BoxWorkout'
import NavbarProfile from '@/containers/profile/NavbarProfile/NavbarProfile'
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'
import { useSession } from 'next-auth/react'
import { trpc } from '@/utils/trpc.utils'
import { BoxWorkoutLoader } from '@/containers/Workout/BoxWorkoutLoader'

const WorkoutResultsPage = () => {
    const router: any = useRouter()
    const { data: sessionData } = useSession()

    const username = router.query.login || ''

    const {
        data: workoutResults = [],
        isFetching,
    } = trpc
        .workoutResult
        .getAll
        .useQuery({ username }, { enabled: !!username })

    const isOwner = sessionData?.user?.username == username

    return (
        <div>
            {isOwner
                ? <>
                    <NavbarOnlyTitle title="workout:WORKOUT_RESULTS" />
                    <DialogAddWorkoutResult />
                </>
                : <NavbarProfile tab={2} />
            }
            <BoxWorkoutLoader isLoading={isFetching}>
                <div>
                    {workoutResults?.map(workoutResult =>
                        <BoxWorkout
                            whenAdded={workoutResult.whenAdded}
                            title={workoutResult.name}
                            description={workoutResult.note || ''}
                            route={`/${username}/workout/results/${workoutResult.id}`}
                            icon={<FitnessCenterIcon />}
                            key={workoutResult.id}
                        />
                    )}
                </div>
            </BoxWorkoutLoader>
        </div>
    )
}

export default WorkoutResultsPage;
