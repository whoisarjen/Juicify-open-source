import useTranslation from 'next-translate/useTranslation'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
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
                <IconButton
                    aria-label="back"
                    onClick={() => setStep('Tutorial_6')}
                >
                    <KeyboardBackspaceIcon />
                    <div />
                </IconButton>
            </div>
            <NavbarOnlyTitle title="coach:THATS_ALL" />
            <div className="flex flex-1 items-center justify-center text-center">
                {t('TUTORIAL_7')}
            </div>
            <Button variant="contained" onClick={handlePreviousStep}>
                {t('I_AM_READY')}
            </Button>
        </div>
    )
}

export default Tutorial_7
