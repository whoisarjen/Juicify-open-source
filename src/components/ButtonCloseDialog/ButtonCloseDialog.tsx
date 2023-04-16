import Button from '@mui/material/Button'
import useTranslation from 'next-translate/useTranslation'

const ButtonCloseDialog = ({ clicked }: { clicked: () => void }) => {
    const { t } = useTranslation('home')

    return (
        <>
            <div className="h-14 w-full" />
            <div
                onClick={clicked}
                className="bg-black fixed bottom-0 left-0 z-10 flex w-full items-center justify-center p-2"
            >
                <Button className="flex-1" variant="contained">
                    {t('Close')}
                </Button>
            </div>
        </>
    )
}

export default ButtonCloseDialog
