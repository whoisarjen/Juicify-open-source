import ButtonPlusIcon from '@/components/ButtonPlusIcon/ButtonPlusIcon'
import { useRouter } from 'next/router'
import NoteAltIcon from '@mui/icons-material/NoteAlt'
import BoxWorkout from '@/containers/Workout/BoxWorkout/BoxWorkout'
import NavbarProfile from '@/containers/profile/NavbarProfile/NavbarProfile'
import { useSession } from 'next-auth/react'
import { trpc } from '@/utils/trpc.utils'
import { orderBy } from 'lodash'
import { BoxWorkoutLoader } from '@/containers/Workout/BoxWorkoutLoader'
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'

const WorkoutPlansPage = () => {
    const router: any = useRouter()
    const { data: sessionData } = useSession()

    const username = router.query.login || ''

    const utils = trpc.useContext()

    const { data: workoutPlans = [], isFetching } =
        trpc.workoutPlan.getAll.useQuery({ username }, { enabled: !!username })

    const createWorkoutPlan = trpc.workoutPlan.create.useMutation({
        onSuccess: (data) => {
            utils.workoutPlan.getAll.setData({ username }, (currentData) =>
                orderBy(
                    [...(currentData || []), data as unknown as WorkoutPlan],
                    ['name'],
                    ['desc']
                )
            )

            router.push(`/${username}/workout/plans/${data.id}`)
        },
    })

    const handleCreateWorkoutPlan = async () => {
        await createWorkoutPlan.mutateAsync({ name: 'ABC' })
    }

    const isOwner = router.query.login == sessionData?.user?.username

    return (
        <div className="flex flex-1 flex-col gap-4">
            {isOwner && <NavbarOnlyTitle title="workout:WORKOUT_PLANS" />}
            {isOwner && <ButtonPlusIcon onClick={handleCreateWorkoutPlan} />}
            {!isOwner && <NavbarProfile tab={3} />}
            <BoxWorkoutLoader isLoading={isFetching}>
                <>
                    {workoutPlans?.map((workoutPlan) => (
                        <BoxWorkout
                            title={workoutPlan.name || ''}
                            description={workoutPlan.description || ''}
                            route={`/${router.query.login}/workout/plans/${workoutPlan.id}`}
                            icon={<NoteAltIcon />}
                            key={workoutPlan?.id}
                        />
                    ))}
                </>
            </BoxWorkoutLoader>
        </div>
    )
}

export default WorkoutPlansPage
