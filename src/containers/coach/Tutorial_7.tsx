import useTranslation from 'next-translate/useTranslation'
import { ArrowLeft } from 'lucide-react'
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'

interface Tutorial_7Props {
    setStep: (arg0: string) => void
    handlePreviousStep: () => void
}

const Tutorial_7 = ({ setStep, handlePreviousStep }: Tutorial_7Props) => {
    const { t } = useTranslation('coach')

    return (
        <div className="flex h-full flex-col gap-4">
            <div>
                <button
                    className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="back"
                    onClick={() => setStep('Tutorial_6')}
                >
                    <ArrowLeft />
                    <div />
                </button>
            </div>
            <NavbarOnlyTitle title="coach:THATS_ALL" />
            <div className="flex flex-1 items-center justify-center text-center">
                {t('TUTORIAL_7')}
            </div>
            <button
                className="rounded bg-primary-dark px-4 py-2 text-[#121212] hover:bg-[#64b5f6] disabled:opacity-50"
                onClick={handlePreviousStep}
            >
                {t('I_AM_READY')}
            </button>
        </div>
    )
}

export default Tutorial_7
