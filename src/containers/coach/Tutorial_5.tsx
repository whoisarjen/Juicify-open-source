import useTranslation from 'next-translate/useTranslation'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'

const Tutorial_5 = ({ setStep }: { setStep: (arg0: string) => void }) => {
    const { t } = useTranslation('coach')

    return (
        <div className="flex h-full flex-col gap-4">
            <div>
                <IconButton
                    aria-label="back"
                    onClick={() => setStep('Tutorial_4')}
                >
                    <KeyboardBackspaceIcon />
                    <div />
                </IconButton>
            </div>
            <NavbarOnlyTitle title="coach:WEIGHT_SELF" />
            <div className="flex flex-1 items-center justify-center text-center">
                {t('TUTORIAL_5')}
            </div>
            <Button variant="contained" onClick={() => setStep('Tutorial_6')}>
                {t('NEXT_STEP')}
            </Button>
        </div>
    )
}

export default Tutorial_5
