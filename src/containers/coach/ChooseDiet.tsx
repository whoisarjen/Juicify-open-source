import Button from '@mui/material/Button'
import useTranslation from 'next-translate/useTranslation'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import IconButton from '@mui/material/IconButton'
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
                <IconButton
                    aria-label="back"
                    onClick={() => handlePreviousStep()}
                >
                    <KeyboardBackspaceIcon />
                    <div />
                </IconButton>
            </div>
            <NavbarOnlyTitle title="coach:CHOOSE_DIET_TITLE" />
            <div className="flex flex-1 items-center justify-center text-center">
                {t('CHOOSE_DIET_DESCRIPTION')}
            </div>
            <Button
                variant="contained"
                onClick={() => setStep('MuscleBuilding')}
            >
                {t('MUSCLE_BUILDING')}
            </Button>
            <Button
                variant="contained"
                onClick={() => setStep('Recomposition')}
            >
                {t('RECOMPOSITION')}
            </Button>
            <Button variant="contained" onClick={() => setStep('LosingWeight')}>
                {t('LOSING_WEIGHT')}
            </Button>
        </div>
    )
}

export default ChooseDiet
