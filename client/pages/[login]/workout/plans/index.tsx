import ButtonPlusIcon from '@/components/ButtonPlusIcon/ButtonPlusIcon';
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle';
import { useCreateWorkoutPlanMutation, useWorkoutPlansQuery } from '@/generated/graphql';
import { useAppSelector } from '@/hooks/useRedux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import NoteAltIcon from '@mui/icons-material/NoteAlt'
import BoxWorkout from '@/containers/Workout/BoxWorkout/BoxWorkout';
import useTranslation from 'next-translate/useTranslation';
import NavbarProfile from '@/containers/profile/NavbarProfile/NavbarProfile';
import { v4 as uuidv4 } from 'uuid';
import { useSession } from 'next-auth/react';

const WorkoutPlansPage = () => {
    const router = useRouter()
    const { data: sessionData } = useSession()
    const { t } = useTranslation('workout')
    const [{ data }, getWorkoutPlans] = useWorkoutPlansQuery({
        variables: {
            username: router.query.login as string,
        },
        pause: true,
    })
    const [, createWorkoutPlan] = useCreateWorkoutPlanMutation()

    useEffect(() => {
        if (router.query.login) {
            getWorkoutPlans()
        }
    }, [router.query.login])

    const handleCreateWorkoutPlan = async () => {
        const newWorkoutPlan = await createWorkoutPlan({
            name: t('WORKOUT_PLANS'),
            id: uuidv4(),
        })

        newWorkoutPlan?.data?.createWorkoutPlan?.workoutPlan?.id
            && router.push(`/${router.query.login}/workout/plans/${newWorkoutPlan.data.createWorkoutPlan.workoutPlan.id}`)
    }

    const isOwner = router.query.login == sessionData?.user?.username

    return (
        <div>
            {isOwner && <NavbarOnlyTitle title="workout:WORKOUT_PLANS" />}
            {isOwner && <ButtonPlusIcon click={handleCreateWorkoutPlan} />}
            {!isOwner && <NavbarProfile tab={3} />}
            {data?.workoutPlans?.map(workoutPlan =>
                <BoxWorkout
                    title={workoutPlan?.name || ''}
                    description={workoutPlan?.description || ''}
                    route={`/${router.query.login}/workout/plans/${workoutPlan?.id}`}
                    icon={<NoteAltIcon />}
                    key={workoutPlan?.id}
                />
            )}
        </div>
    );
}

export default WorkoutPlansPage;