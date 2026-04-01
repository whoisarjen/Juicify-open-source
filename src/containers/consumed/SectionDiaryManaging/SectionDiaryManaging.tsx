import Button from '@mui/material/Button';
import { PieChart } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

const SectionDiaryManaging = () => {
    const router = useRouter()
    const { t } = useTranslation('nutrition-diary')

    return (
        <div className="flex">
            <Button
                className="flex-1"
                onClick={() => router.push('/macronutrients')}
                color="primary"
                variant="outlined"
                aria-label="macronutrients"
                component="span"
                startIcon={<PieChart />}
            >
                {t('Macronutrients')}
            </Button>
        </div>
    )
}

export default SectionDiaryManaging;