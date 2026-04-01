import useTranslation from 'next-translate/useTranslation'
import { ArrowLeft } from 'lucide-react'
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'

interface Tutorial_1Props {
    setStep: (arg0: string) => void
    handlePreviousStep: () => void
}

const Tutorial_1 = ({ setStep, handlePreviousStep }: Tutorial_1Props) => {
    const { t } = useTranslation('coach')

    return (
        <div className="flex h-full flex-col gap-4">
            <div>
                <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="back" onClick={handlePreviousStep}>
                    <ArrowLeft />
                    <div />
                </button>
            </div>
            <NavbarOnlyTitle title="coach:HOW_DOES_IT_WORK" />
            <div className="flex flex-1 items-center justify-center text-center">
                {t('TUTORIAL_1')}
            </div>
            <button
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                onClick={() => setStep('Tutorial_2')}
            >
                {t('NEXT_STEP')}
            </button>
        </div>
    )
}

export default Tutorial_1
