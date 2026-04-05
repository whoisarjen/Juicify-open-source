import { Dumbbell, BookOpen, FileText } from 'lucide-react'
import { useRouter } from 'next/router';
import moment from 'moment';

const ProfileTabs = ({ tab }: { tab: number }) => {
    const router: any = useRouter()

    const tabs = [
        { testId: 'target_nutrition_diary', icon: <BookOpen />, onClick: () => router.push(`/${router.query.login}/consumed/${moment().format('YYYY-MM-DD')}`) },
        { testId: 'target_workout_results', icon: <Dumbbell />, onClick: () => router.push(`/${router.query.login}/workout/results`) },
        { testId: 'target_workout_plans', icon: <FileText />, onClick: () => router.push(`/${router.query.login}/workout/plans`) },
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
                            ? 'border-b-2 border-primary-dark text-primary-dark'
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