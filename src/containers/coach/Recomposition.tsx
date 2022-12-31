import { useState } from "react";
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import useTranslation from "next-translate/useTranslation";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import IconButton from '@mui/material/IconButton';
import styled from "styled-components";
import NavbarOnlyTitle from "@/components/NavbarOnlyTitle/NavbarOnlyTitle"
import { DIET_ACTIVITY, DIET_KIND } from "./constants";
import type { PrepareObject } from "pages/coach";

interface RecompositionProps {
    prepareCreate: (arg0: PrepareObject) => void,
    handlePreviousStep: (arg0: string) => void
}

const Grid = styled.div`
    width: 100%;
    height: calc(100vh - var(--BothNavHeightAndPadding));
    display: grid;
    grid-template-rows: 44px 2fr 2fr 1fr 1fr auto;
    grid-gap: 5px;
    text-align: center;
`

const ArrowBack = styled.div`
    margin: auto 0;
    width: 100%;
    display: grid;
    grid-template-columns: 40px 1fr;
`

const Recomposition = ({ prepareCreate, handlePreviousStep }: RecompositionProps) => {
    const { t } = useTranslation('coach')
    const [kindOfDiet, setKindOfDiet] = useState(DIET_KIND[0].value)
    const [activityLevel, setActivityLevel] = useState(DIET_ACTIVITY[0].value)

    const handleNextStep = () => {
        prepareCreate({
            goal: 0,
            kindOfDiet,
            isSportActive: true,
            activityLevel,
        })
    }

    return (
        <Grid>
            <ArrowBack>
                <IconButton aria-label="back" onClick={() => handlePreviousStep('ChooseDiet')}>
                    <KeyboardBackspaceIcon />
                    <div />
                </IconButton>
            </ArrowBack>
            <NavbarOnlyTitle title="coach:RECOMPOSITION" />
            <div>{t('RECOMPOSITION_DESCRIPTION')}</div>
            <Box>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">{t('DIET_ACTIVITY_TITLE')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={activityLevel}
                        label={t('DIET_ACTIVITY_TITLE')}
                        onChange={e => setActivityLevel(parseFloat(e.target.value.toString()))}
                    >
                        {DIET_ACTIVITY.map(x =>
                            <MenuItem key={x.value} value={x.value}>{t(x.name)}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Box>
            <Box>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">{t('DIET_KIND_TITLE')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={kindOfDiet}
                        label={t('DIET_KIND_TITLE')}
                        onChange={e => setKindOfDiet(parseInt(e.target.value.toString()))}
                    >
                        {DIET_KIND.map(x =>
                            <MenuItem key={x.value} value={x.value}>{t(x.name)}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Box>
            <Button variant="contained" onClick={handleNextStep}>{t('COUNT_DIET')}</Button>
        </Grid>
    )
}

export default Recomposition;