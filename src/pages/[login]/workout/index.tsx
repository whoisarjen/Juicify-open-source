import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { Dumbbell, FileText, BarChart3 } from 'lucide-react'
import BoxWorkout from "@/containers/Workout/BoxWorkout/BoxWorkout"
import NavbarOnlyTitle from "@/components/NavbarOnlyTitle/NavbarOnlyTitle"

const Workout = () => {
    const { t } = useTranslation('workout');
    const router: any = useRouter()

    return (
        <div className="flex flex-1 flex-col gap-4">
            <NavbarOnlyTitle title="home:Workout" />
            <BoxWorkout
                title={t('WORKOUT_RESULTS')}
                description={t('WORKOUT_RESULTS_DESCRIPTION')}
                route={`/${router.query.login}/workout/results`}
                icon={<Dumbbell />}
            />
            <BoxWorkout
                title={t('WORKOUT_PLANS')}
                description={t('WORKOUT_PLANS_DESCRIPTION')}
                route={`/${router.query.login}/workout/plans`}
                icon={<FileText />}
            />
            <BoxWorkout
                title={t('WORKOUT_STATISTICS')}
                description={t('WORKOUT_STATISTICS_DESCRIPTION')}
                route={`/${router.query.login}/workout/statistics`}
                icon={<BarChart3 />}
            />
        </div>
    );
};

export default Workout;
