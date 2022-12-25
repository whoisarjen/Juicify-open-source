import LoadingButton from '@mui/lab/LoadingButton';
import useTranslation from 'next-translate/useTranslation';
import styled from 'styled-components'

const Button = styled.div`
    width: 100%;
    position: fixed;
    bottom: 56px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 2;
`

const Placeholder = styled.div`
    width: 100%;
    height: 44px;
`

interface ButtonSubmitItemsProps {
    clicked: () => void,
    isShowNumber?: boolean,
    showNumber?: number,
    text?: string
}

const ButtonSubmitItems = ({ clicked, text = 'Submit', isShowNumber = true, showNumber = 0 }: ButtonSubmitItemsProps) => {
    const { t } = useTranslation('home')

    if (isShowNumber && !showNumber) {
        return <></>
    }

    return (
        <>
            <Placeholder />
            <Button>
                <LoadingButton
                    data-testid="ButtonSubmitItems"
                    onClick={clicked}
                    variant="contained"
                    type="submit"
                >
                    {t(text)}{showNumber > 0 && ` (${showNumber})`}
                </LoadingButton>
            </Button>
        </>
    )
}

export default ButtonSubmitItems;