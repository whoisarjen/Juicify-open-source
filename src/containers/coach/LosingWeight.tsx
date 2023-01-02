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
import { DIET_ACTIVITY, DIET_EXTRA_PROTEINS, DIET_GOAL, DIET_KIND } from "./constants";
import type { PrepareObject } from "pages/coach";

interface LosingWeightProps {
    prepareCreate: (arg0: PrepareObject) => void,
    handlePreviousStep: (arg0: string) => void
}

const Grid = styled.div`
    width: 100%;
    height: calc(100vh - var(--BothNavHeightAndPadding));
    display: grid;
    grid-template-rows: 40px 2fr 2fr 1fr 1fr 1fr 1fr auto;
    grid-gap: 5px;
    text-align: center;
`

const ArrowBack = styled.div`
    margin: auto 0;
    width: 100%;
    display: grid;
    grid-template-columns: 40px 1fr;
`

const LosingWeight = ({ prepareCreate, handlePreviousStep }: LosingWeightProps) => {
    const { t } = useTranslation('coach')
    const [goal, setGoal] = useState(DIET_GOAL[0].value);
    const [kindOfDiet, setKindOfDiet] = useState(DIET_KIND[0].value)
    const [isSportActive, setIsSportActive] = useState(true)
    const [activityLevel, setActivityLevel] = useState(DIET_ACTIVITY[0].value)

    const handleNextStep = () => {
        prepareCreate({
            goal: -goal,
            kindOfDiet,
            isSportActive,
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
            <NavbarOnlyTitle title="coach:LOSING_WEIGHT" />
            <div>{t('LOSING_WEIGHT_DESCRIPTION')}</div>
            <Box>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">{t('DIET_GOAL_TITLE')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={goal}
                        label={t('DIET_GOAL_TITLE')}
                        onChange={e => setGoal(parseFloat(e.target.value.toString()))}
                    >
                        {DIET_GOAL.map(x =>
                            <MenuItem key={x.value} value={x.value}>{t(x.name)}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Box>
            <Box>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">{t('DIET_ACTIVITY_TITLE')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={activityLevel}
                        label={t('DIET_ACTIVITY_TITLE')}
                        onChange={e => setActivityLevel(parseInt(e.target.value.toString()))}
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
            <Box>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">{t('DIET_EXTRA_PROTEINS_TITLE')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={isSportActive}
                        label={t('DIET_EXTRA_PROTEINS_TITLE')}
                        onChange={() => setIsSportActive(state => !state)}
                    >
                        {DIET_EXTRA_PROTEINS.map(x =>
                            <MenuItem key={x.value} value={x.value}>{t(x.name)}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Box>
            <Button variant="contained" onClick={handleNextStep}>{t('COUNT_DIET')}</Button>
        </Grid>
    )
}

export default LosingWeight;