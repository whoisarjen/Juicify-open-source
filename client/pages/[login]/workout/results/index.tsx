import { useAppSelector } from '@/hooks/useRedux'
import { useRouter } from 'next/router'
import { useWorkoutResultsQuery } from '@/generated/graphql'
import { useEffect } from 'react'
import DialogAddWorkoutResult from '@/containers/Workout/DialogAddWorkoutResult/DialogAddWorkoutResult'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import BoxWorkout from '@/containers/Workout/BoxWorkout/BoxWorkout'
import NavbarProfile from '@/containers/profile/NavbarProfile/NavbarProfile'
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'

const WorkoutResultsPage = () => {
    const router = useRouter()
    const { data: sessionData } = useSession()
    const [{ data }, getWorkoutResults] = useWorkoutResultsQuery({
        variables: {
            username: router.query.login as string,
        },
        pause: true,
    })

    useEffect(() => {
        if (router.query.login) {
            getWorkoutResults()
        }
    }, [router.query.login])

    return (
        <div>
            {sessionData?.user?.username == router.query.login
                ? <>
                    <NavbarOnlyTitle title="workout:WORKOUT_RESULTS" />
                    <DialogAddWorkoutResult />
                </>
                : <NavbarProfile tab={2} />
            }
            {data?.workoutResults?.map((result: any) =>
                result &&
                <BoxWorkout
                    whenAdded={result.when}
                    title={result.name}
                    description={result.note || ''}
                    route={`/${router.query.login}/workout/results/${result.id}`}
                    icon={<FitnessCenterIcon />}
                    key={result.id}
                />
            )}
        </div>
    )
}

export default WorkoutResultsPage;
