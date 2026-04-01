import useTranslation from 'next-translate/useTranslation'
import { ArrowLeft } from 'lucide-react'
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'

const Tutorial_6 = ({ setStep }: { setStep: (arg0: string) => void }) => {
    const { t } = useTranslation('coach')

    return (
        <div className="flex h-full flex-col gap-4">
            <div>
                <button
                    className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="back"
                    onClick={() => setStep('Tutorial_5')}
                >
                    <ArrowLeft />
                    <div />
                </button>
            </div>
            <NavbarOnlyTitle title="coach:EXTRA_ACTIVITY" />
            <div className="flex flex-1 items-center justify-center text-center">
                {t('TUTORIAL_6')}
            </div>
            <button
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                onClick={() => setStep('Tutorial_7')}
            >
                {t('NEXT_STEP')}
            </button>
        </div>
    )
}

export default Tutorial_6
