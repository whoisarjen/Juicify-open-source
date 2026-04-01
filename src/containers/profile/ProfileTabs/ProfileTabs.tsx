import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import BookIcon from "@mui/icons-material/Book";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NoteAltIcon from '@mui/icons-material/NoteAlt'
import { useRouter } from 'next/router';
import moment from 'moment';

const ProfileTabs = ({ tab }: { tab: number }) => {
    const router: any = useRouter()

    const tabs = [
        { testId: 'target_profile', icon: <AccountCircleIcon />, onClick: () => router.push(`/${router.query.login}`) },
        { testId: 'target_nutrition_diary', icon: <BookIcon />, onClick: () => router.push(`/${router.query.login}/consumed/${moment().format('YYYY-MM-DD')}`) },
        { testId: 'target_workout_results', icon: <FitnessCenterIcon />, onClick: () => router.push(`/${router.query.login}/workout/results`) },
        { testId: 'target_workout_plans', icon: <NoteAltIcon />, onClick: () => router.push(`/${router.query.login}/workout/plans`) },
    ]

    return (
        <div className="mb-2.5 flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((item, index) => (
                <button
                    key={index}
                    data-testid={item.testId}
                    onClick={item.onClick}
                    className={`flex flex-1 items-center justify-center px-4 py-2 ${
                        tab === index
                            ? 'border-b-2 border-blue-500 text-blue-500'
                            : 'text-gray-500'
                    }`}
                >
                    {item.icon}
                </button>
            ))}
        </div>
    )
}

export default ProfileTabs;