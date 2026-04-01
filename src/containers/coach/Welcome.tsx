import useTranslation from 'next-translate/useTranslation'
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'

const Welcome = ({ setStep }: { setStep: (arg0: string) => void }) => {
    const { t } = useTranslation('coach')

    return (
        <div className="flex h-full flex-col gap-4">
            <NavbarOnlyTitle title="coach:WELCOME_TITLE" />
            <div className="flex flex-1 items-center justify-center text-center">
                {t('WELCOME_DESCRIPTION')}
            </div>
            <button
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                onClick={() => setStep('CheckingTodayData')}
            >
                {t('WELCOME_BUTTON')}
            </button>
        </div>
    )
}

export default Welcome
