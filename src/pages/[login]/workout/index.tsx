import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import BoxWorkout from "@/containers/Workout/BoxWorkout/BoxWorkout"
import NoteAltIcon from '@mui/icons-material/NoteAlt'

const Workout = () => {
    const { t } = useTranslation('workout');
    const router: any = useRouter()

    return (
        <div className="flex flex-col gap-4">
            <BoxWorkout
                title={t('WORKOUT_RESULTS')}
                description={t('WORKOUT_RESULTS_DESCRIPTION')}
                route={`/${router.query.login}/workout/results`}
                icon={<FitnessCenterIcon />}
            />
            <BoxWorkout
                title={t('WORKOUT_PLANS')}
                description={t('WORKOUT_PLANS_DESCRIPTION')}
                route={`/${router.query.login}/workout/plans`}
                icon={<NoteAltIcon />}
            />
        </div>
    );
};

export default Workout;
