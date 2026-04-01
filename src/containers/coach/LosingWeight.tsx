import { useState } from 'react'
import Button from '@mui/material/Button'
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
            <div>
                <label className="mb-1 block text-sm text-gray-500">
                    {t('DIET_GOAL_TITLE')}
                </label>
                <select
                    className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-600"
                    value={goal}
                    onChange={(e) =>
                        setGoal(e.target.value as unknown as any)
                    }
                >
                    {DIET_GOALS_DEFICIT.map((x) => (
                        <option key={x.value} value={x.value}>
                            {t(x.name)}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="mb-1 block text-sm text-gray-500">
                    {t('DIET_ACTIVITY_TITLE')}
                </label>
                <select
                    className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-600"
                    value={activityLevel}
                    onChange={(e) =>
                        setActivityLevel(
                            e.target
                                .value as unknown as keyof typeof activityLevels
                        )
                    }
                >
                    {DIET_ACTIVITY.map((x) => (
                        <option key={x.value} value={x.value}>
                            {t(x.name)}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="mb-1 block text-sm text-gray-500">
                    {t('DIET_KIND_TITLE')}
                </label>
                <select
                    className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-600"
                    value={kindOfDiet}
                    onChange={(e) =>
                        setKindOfDiet(
                            e.target
                                .value as unknown as keyof typeof kindOfDiets
                        )
                    }
                >
                    {DIET_KIND.map((x) => (
                        <option key={x.value} value={x.value}>
                            {t(x.name)}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="mb-1 block text-sm text-gray-500">
                    {t('DIET_EXTRA_PROTEINS_TITLE')}
                </label>
                <select
                    className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-600"
                    value={isSportActive.toString()}
                    onChange={() => setIsSportActive((state) => !state)}
                >
                    {DIET_EXTRA_PROTEINS.map((x) => (
                        <option key={x.value.toString()} value={x.value.toString()}>
                            {t(x.name)}
                        </option>
                    ))}
                </select>
            </div>
            <Button variant="contained" onClick={handleNextStep}>
                {t('COUNT_DIET')}
            </Button>
        </div>
    )
}

export default LosingWeight
