import { PieChart } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

const SectionDiaryManaging = () => {
    const router = useRouter()
    const { t } = useTranslation('nutrition-diary')

    return (
        <div className="flex">
            <button
                className="flex flex-1 items-center justify-center gap-2 rounded border border-gray-300 px-4 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                onClick={() => router.push('/macronutrients')}
                aria-label="macronutrients"
            >
                <PieChart size={20} />
                {t('Macronutrients')}
            </button>
        </div>
    )
}

export default SectionDiaryManaging;