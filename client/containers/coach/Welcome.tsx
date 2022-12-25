import Button from '@mui/material/Button';
import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle';

const Box = styled.div`
    width: 100%;
    height: calc(100vh - var(--BothNavHeightAndPadding));
    display: grid;
    text-align: center;
    grid-template-rows: 1fr 1fr auto;
`

const Description = styled.div`
    font-size: 0.9rem;
    margin: auto 0;
`

const Welcome = ({ setStep }: { setStep: (arg0: string) => void }) => {
    const { t } = useTranslation('coach')

    return (
        <Box>
            <NavbarOnlyTitle title="coach:WELCOME_TITLE" />
            <Description>{t('WELCOME_DESCRIPTION')}</Description>
            <Button variant="contained" onClick={() => setStep('CheckingTodayData')}>{t('WELCOME_BUTTON')}</Button>
        </Box>
    )
}

export default Welcome;