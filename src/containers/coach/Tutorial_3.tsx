import useTranslation from 'next-translate/useTranslation'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface Tutorial_3Props {
    setStep: (arg0: string) => void
}

const Tutorial_3 = ({ setStep }: Tutorial_3Props) => {
    const { t } = useTranslation('coach')

    return (
        <div className="flex h-full flex-col gap-4">
            <div>
                <button
                    className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="back"
                    onClick={() => setStep('Tutorial_2')}
                >
                    <ArrowLeft />
                    <div />
                </button>
            </div>
            <Image
                src="/images/tutorial_3.jpg"
                alt="Coach tutorial 3"
                width="970"
                height="728"
            />
            <div className="flex flex-1 items-center justify-center text-center">
                {t('TUTORIAL_3')}
            </div>
            <button
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                onClick={() => setStep('Tutorial_4')}
            >
                {t('NEXT_STEP')}
            </button>
        </div>
    )
}

export default Tutorial_3
