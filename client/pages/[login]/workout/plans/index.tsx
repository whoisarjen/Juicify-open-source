import ButtonPlusIcon from '@/components/ButtonPlusIcon/ButtonPlusIcon';
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle';
import { useRouter } from 'next/router';
import NoteAltIcon from '@mui/icons-material/NoteAlt'
import BoxWorkout from '@/containers/Workout/BoxWorkout/BoxWorkout';
import NavbarProfile from '@/containers/profile/NavbarProfile/NavbarProfile';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';

const WorkoutPlansPage = () => {
    const router: any = useRouter()
    const { data: sessionData } = useSession()
    const { data: workoutPlans } = trpc.workoutPlan.getAll.useQuery({ username: router.query.login }, { enabled: !!router.query.login })
    const createWorkoutPlan = trpc.workoutPlan.create.useMutation()

    const handleCreateWorkoutPlan = async () => {
        await createWorkoutPlan.mutate({
            name: '',
        }, {
            onSuccess: (data) => {
                router.push(`/${router.query.login}/workout/plans/${data.id}`)
            }
        })
    }

    const isOwner = router.query.login == sessionData?.user?.username

    return (
        <div>
            {isOwner && <NavbarOnlyTitle title="workout:WORKOUT_PLANS" />}
            {isOwner && <ButtonPlusIcon click={handleCreateWorkoutPlan} />}
            {!isOwner && <NavbarProfile tab={3} />}
            {workoutPlans?.map(workoutPlan =>
                <BoxWorkout
                    title={workoutPlan.name || ''}
                    description={workoutPlan.description || ''}
                    route={`/${router.query.login}/workout/plans/${workoutPlan.id}`}
                    icon={<NoteAltIcon />}
                    key={workoutPlan?.id}
                />
            )}
        </div>
    );
}

export default WorkoutPlansPage;