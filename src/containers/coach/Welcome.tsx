import Button from '@mui/material/Button'
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
            <Button
                variant="contained"
                onClick={() => setStep('CheckingTodayData')}
            >
                {t('WELCOME_BUTTON')}
            </Button>
        </div>
    )
}

export default Welcome
