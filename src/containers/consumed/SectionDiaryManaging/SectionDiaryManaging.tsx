import { PieChart } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

const SectionDiaryManaging = () => {
    const router = useRouter()
    const { t } = useTranslation('nutrition-diary')

    return (
        <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[rgba(144,202,249,0.06)] border border-[rgba(144,202,249,0.12)] px-4 py-3 text-sm font-bold text-primary-dark transition-all duration-300 hover:bg-[rgba(144,202,249,0.10)] hover:border-[rgba(144,202,249,0.25)]"
            onClick={() => router.push('/macronutrients')}
            aria-label="macronutrients"
        >
            <PieChart size={16} />
            {t('Macronutrients')}
        </button>
    )
}

export default SectionDiaryManaging;
