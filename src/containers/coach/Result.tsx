import Button from '@mui/material/Button'
import useTranslation from 'next-translate/useTranslation'
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'
import { type GetMacronutrientsReturn } from '@/utils/coach.utils'

interface Result {
    setStep: (step: string) => void
    data: GetMacronutrientsReturn | null
}

const Result = ({ setStep, data }: Result) => {
    const { t } = useTranslation('coach')

    return (
        <div className="flex h-full flex-col gap-4">
            <NavbarOnlyTitle title="coach:RESULT_TITLE" />
            <div className="flex flex-1 items-center justify-center text-center">
                <table className="flex-1">
                    <tr>
                        <td>{data?.proteins}g</td>
                        <td>{data?.carbs}g</td>
                        <td>{data?.fats}g</td>
                    </tr>
                    <tr>
                        <td>{t('PROTEINS')}</td>
                        <td>{t('CARBS')}</td>
                        <td>{t('FATS')}</td>
                    </tr>
                </table>
            </div>
            <div className="flex flex-1 items-center justify-center text-center">
                {t('RESULT_TITLE_DESCIPRION')}
            </div>
            <Button
                variant="contained"
                color="error"
                onClick={() => setStep('Tutorial_1')}
            >
                {t('DONT_GET_IT')}
            </Button>
            <Button variant="contained" onClick={() => setStep('Standard')}>
                {t('GOT_IT')}
            </Button>
        </div>
    )
}

export default Result
