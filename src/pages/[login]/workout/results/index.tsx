import { useRouter } from 'next/router'
import DialogAddWorkoutResult from '@/containers/Workout/DialogAddWorkoutResult/DialogAddWorkoutResult'
import { Dumbbell } from 'lucide-react'
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

    const { data, isFetching } =
        trpc.workoutResult.getAll.useQuery(
            { username },
            { enabled: !!username }
        )

    const workoutResults = data?.items ?? []

    const isOwner = sessionData?.user?.username == username

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-4">
            {isOwner ? (
                <NavbarOnlyTitle title="home:WORKOUT_RESULTS">
                    <DialogAddWorkoutResult />
                </NavbarOnlyTitle>
            ) : (
                <NavbarProfile tab={2} />
            )}
            <BoxWorkoutLoader isLoading={isFetching}>
                <>
                    {workoutResults?.map((workoutResult) => (
                        <BoxWorkout
                            whenAdded={workoutResult.whenAdded}
                            title={workoutResult.name}
                            description={workoutResult.note || ''}
                            route={`/${username}/workout/results/${workoutResult.id}`}
                            icon={<Dumbbell />}
                            key={workoutResult.id}
                        />
                    ))}
                </>
            </BoxWorkoutLoader>
        </div>
    )
}

export default WorkoutResultsPage
