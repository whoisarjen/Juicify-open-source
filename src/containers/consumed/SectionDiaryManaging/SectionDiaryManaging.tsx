import { PieChart, Pill } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

const SectionDiaryManaging = () => {
    const router = useRouter()
    const { t } = useTranslation('nutrition-diary')
    const { t: tHome } = useTranslation('home')

    return (
        <div className="flex gap-2">
            <button
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[rgba(144,202,249,0.06)] border border-[rgba(144,202,249,0.12)] px-4 py-3 text-sm font-bold text-primary-dark transition-all duration-300 hover:bg-[rgba(144,202,249,0.10)] hover:border-[rgba(144,202,249,0.25)] cursor-pointer"
                onClick={() => router.push('/macronutrients')}
                aria-label="macronutrients"
            >
                <PieChart size={16} />
                {t('Macronutrients')}
            </button>
            <button
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[rgba(144,202,249,0.06)] border border-[rgba(144,202,249,0.12)] px-4 py-3 text-sm font-bold text-primary-dark transition-all duration-300 hover:bg-[rgba(144,202,249,0.10)] hover:border-[rgba(144,202,249,0.25)] cursor-pointer"
                onClick={() => router.push('/supplements')}
                aria-label="supplements"
            >
                <Pill size={16} />
                {tHome('Supplements')}
            </button>
        </div>
    )
}

export default SectionDiaryManaging;
