import useTranslation from "next-translate/useTranslation";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Image from 'next/image'
import styled from "styled-components";

interface Tutorial_2Props {
    setStep: (arg0: string) => void
}

const Box = styled.div`
    width: 100%;
    height: calc(100vh - var(--BothNavHeightAndPadding));
    display: grid;
    grid-template-rows: 44px auto auto 44px;
    grid-gap: 5px;
    text-align: center;
    ${this} div {
        margin: auto;
    }
`

const ArrowBack = styled.div`
    margin: auto 0;
    width: 100%;
    display: grid;
    grid-template-columns: 40px 1fr;
`

const Tutorial_2 = ({ setStep }: Tutorial_2Props) => {
    const { t } = useTranslation('coach')

    return (
        <Box>
            <ArrowBack>
                <IconButton aria-label="back" onClick={() => setStep('Tutorial_1')}>
                    <KeyboardBackspaceIcon />
                    <div />
                </IconButton>
            </ArrowBack>
            <Image
                src="/images/tutorial_2.jpg"
                alt="Coach tutorial 2"
                width="970"
                height="728"
            />
            <div>{t('TUTORIAL_2')}</div>
            <Button variant="contained" onClick={() => setStep('Tutorial_3')}>{t('NEXT_STEP')}</Button>
        </Box>
    )
}

export default Tutorial_2;