import useTranslation from 'next-translate/useTranslation'
import { ArrowLeft } from 'lucide-react'
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'

interface ChooseDietProps {
    setStep: (arg0: string) => void
    handlePreviousStep: () => void
}

const ChooseDiet = ({ setStep, handlePreviousStep }: ChooseDietProps) => {
    const { t } = useTranslation('coach')

    return (
        <div className="flex h-full flex-col gap-4">
            <div>
                <button
                    className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="back"
                    onClick={() => handlePreviousStep()}
                >
                    <ArrowLeft />
                    <div />
                </button>
            </div>
            <NavbarOnlyTitle title="coach:CHOOSE_DIET_TITLE" />
            <div className="flex flex-1 items-center justify-center text-center">
                {t('CHOOSE_DIET_DESCRIPTION')}
            </div>
            <button
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                onClick={() => setStep('MuscleBuilding')}
            >
                {t('MUSCLE_BUILDING')}
            </button>
            <button
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                onClick={() => setStep('Recomposition')}
            >
                {t('RECOMPOSITION')}
            </button>
            <button
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                onClick={() => setStep('LosingWeight')}
            >
                {t('LOSING_WEIGHT')}
            </button>
        </div>
    )
}

export default ChooseDiet
