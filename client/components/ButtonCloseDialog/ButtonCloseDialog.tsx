import Button from '@mui/material/Button';
import useTranslation from 'next-translate/useTranslation';
import styled from 'styled-components';

const Close = styled.div`
    display: grid;
    width: calc(100% - 10px);
    padding: 3.75px 5px;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background: var(--theme-background);
    z-index: 2;
`

const CloseButtonPlaceholder = styled.div`
    width: 100%;
    height: 44px;
`

const ButtonCloseDialog = ({ clicked }: { clicked: () => void }) => {
    const { t } = useTranslation('home')

    return (
        <>
            <CloseButtonPlaceholder />
            <Close onClick={clicked} data-testid="ButtonCloseDialog">
                <Button variant="contained">
                    {t('Close')}
                </Button>
            </Close>
        </>
    )
}

export default ButtonCloseDialog;