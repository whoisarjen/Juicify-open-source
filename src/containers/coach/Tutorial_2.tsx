import useTranslation from 'next-translate/useTranslation'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Image from 'next/image'

interface Tutorial_2Props {
    setStep: (arg0: string) => void
}

const Tutorial_2 = ({ setStep }: Tutorial_2Props) => {
    const { t } = useTranslation('coach')

    return (
        <div className="flex h-full flex-col gap-4">
            <div>
                <IconButton
                    aria-label="back"
                    onClick={() => setStep('Tutorial_1')}
                >
                    <KeyboardBackspaceIcon />
                    <div />
                </IconButton>
            </div>
            <Image
                src="/images/tutorial_2.jpg"
                alt="Coach tutorial 2"
                width="970"
                height="728"
            />
            <div className="flex flex-1 items-center justify-center text-center">
                {t('TUTORIAL_2')}
            </div>
            <Button variant="contained" onClick={() => setStep('Tutorial_3')}>
                {t('NEXT_STEP')}
            </Button>
        </div>
    )
}

export default Tutorial_2
