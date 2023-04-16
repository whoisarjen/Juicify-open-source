import { useState } from 'react'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import useTranslation from 'next-translate/useTranslation'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import IconButton from '@mui/material/IconButton'
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'
import {
    DIET_ACTIVITY,
    DIET_EXTRA_PROTEINS,
    DIET_GOALS_DEFICIT,
    DIET_KIND,
} from './constants'
import { type CoachSchema } from '@/server/schema/coach.schema'
import { activityLevels, kindOfDiets } from '@prisma/client'

interface LosingWeightProps {
    prepareCreate: (coach: CoachSchema) => void
    handlePreviousStep: (step: string) => void
}

const LosingWeight = ({
    prepareCreate,
    handlePreviousStep,
}: LosingWeightProps) => {
    const { t } = useTranslation('coach')
    const [goal, setGoal] = useState(DIET_GOALS_DEFICIT[0].value)
    const [kindOfDiet, setKindOfDiet] = useState(DIET_KIND[0].value)
    const [isSportActive, setIsSportActive] = useState(true)
    const [activityLevel, setActivityLevel] = useState(DIET_ACTIVITY[0].value)

    const handleNextStep = () => {
        prepareCreate({
            goal,
            kindOfDiet,
            isSportActive,
            activityLevel,
        })
    }

    return (
        <div className="flex h-full flex-col gap-4">
            <div>
                <IconButton
                    aria-label="back"
                    onClick={() => handlePreviousStep('ChooseDiet')}
                >
                    <KeyboardBackspaceIcon />
                    <div />
                </IconButton>
            </div>
            <NavbarOnlyTitle title="coach:LOSING_WEIGHT" />
            <div className="flex flex-1 items-center justify-center text-center">
                {t('LOSING_WEIGHT_DESCRIPTION')}
            </div>
            <Box>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                        {t('DIET_GOAL_TITLE')}
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={goal}
                        label={t('DIET_GOAL_TITLE')}
                        onChange={(e) =>
                            setGoal(e.target.value as unknown as any)
                        }
                    >
                        {DIET_GOALS_DEFICIT.map((x) => (
                            <MenuItem key={x.value} value={x.value}>
                                {t(x.name)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                        {t('DIET_ACTIVITY_TITLE')}
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={activityLevel}
                        label={t('DIET_ACTIVITY_TITLE')}
                        onChange={(e) =>
                            setActivityLevel(
                                e.target
                                    .value as unknown as keyof typeof activityLevels
                            )
                        }
                    >
                        {DIET_ACTIVITY.map((x) => (
                            <MenuItem key={x.value} value={x.value}>
                                {t(x.name)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                        {t('DIET_KIND_TITLE')}
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={kindOfDiet}
                        label={t('DIET_KIND_TITLE')}
                        onChange={(e) =>
                            setKindOfDiet(
                                e.target
                                    .value as unknown as keyof typeof kindOfDiets
                            )
                        }
                    >
                        {DIET_KIND.map((x) => (
                            <MenuItem key={x.value} value={x.value}>
                                {t(x.name)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                        {t('DIET_EXTRA_PROTEINS_TITLE')}
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={isSportActive}
                        label={t('DIET_EXTRA_PROTEINS_TITLE')}
                        onChange={() => setIsSportActive((state) => !state)}
                    >
                        {DIET_EXTRA_PROTEINS.map((x) => (
                            <MenuItem key={x.value} value={x.value}>
                                {t(x.name)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Button variant="contained" onClick={handleNextStep}>
                {t('COUNT_DIET')}
            </Button>
        </div>
    )
}

export default LosingWeight
