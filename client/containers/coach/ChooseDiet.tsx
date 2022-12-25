import Button from '@mui/material/Button';
import useTranslation from "next-translate/useTranslation";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import IconButton from '@mui/material/IconButton';
import styled from "styled-components";
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle';

interface ChooseDietProps {
    setStep: (arg0: string) => void,
    handlePreviousStep: () => void
}

const Grid = styled.div`
    width: 100%;
    height: calc(100vh - var(--BothNavHeightAndPadding));
    display: grid;
    grid-template-rows: 44px 1fr 1fr auto auto auto;
    grid-gap: 5px;
    text-align: center;
`

const ArrowBack = styled.div`
    margin: auto 0;
    width: 100%;
    display: grid;
    grid-template-columns: 40px 1fr;
`

const ChooseDiet = ({ setStep, handlePreviousStep }: ChooseDietProps) => {
    const { t } = useTranslation('coach')

    return (
        <Grid>
            <ArrowBack>
                <IconButton aria-label="back" onClick={() => handlePreviousStep()}>
                    <KeyboardBackspaceIcon />
                    <div />
                </IconButton>
            </ArrowBack>
            <NavbarOnlyTitle title="coach:CHOOSE_DIET_TITLE" />
            <div>{t('CHOOSE_DIET_DESCRIPTION')}</div>
            <Button variant="contained" onClick={() => setStep('MuscleBuilding')}>{t('MUSCLE_BUILDING')}</Button>
            <Button variant="contained" onClick={() => setStep('Recomposition')}>{t('RECOMPOSITION')}</Button>
            <Button variant="contained" onClick={() => setStep('LosingWeight')}>{t('LOSING_WEIGHT')}</Button>
        </Grid>
    )
}

export default ChooseDiet;