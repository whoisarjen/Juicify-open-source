import LoadingButton from '@mui/lab/LoadingButton'
import useTranslation from 'next-translate/useTranslation'

interface ButtonSubmitItemsProps {
    clicked: () => void
    isShowNumber?: boolean
    showNumber?: number
    text?: string
}

const ButtonSubmitItems = ({
    clicked,
    text = 'Submit',
    isShowNumber = true,
    showNumber = 0,
}: ButtonSubmitItemsProps) => {
    const { t } = useTranslation('home')

    if (isShowNumber && !showNumber) {
        return <></>
    }

    return (
        <>
            <div className="h-11 w-full" />
            <div className="fixed bottom-14 left-0 z-10 flex w-full items-center justify-center">
                <LoadingButton
                    data-testid="ButtonSubmitItems"
                    onClick={clicked}
                    variant="contained"
                    type="submit"
                >
                    {t(text)}
                    {showNumber > 0 && ` (${showNumber})`}
                </LoadingButton>
            </div>
        </>
    )
}

export default ButtonSubmitItems
