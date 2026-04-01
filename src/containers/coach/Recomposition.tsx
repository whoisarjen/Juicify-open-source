import { useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { ArrowLeft } from 'lucide-react'
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'
import { DIET_ACTIVITY, DIET_KIND } from './constants'
import { goals, activityLevels, kindOfDiets } from '@prisma/client'
import { type CoachSchema } from '@/server/schema/coach.schema'

interface RecompositionProps {
    prepareCreate: (coach: CoachSchema) => void
    handlePreviousStep: (step: string) => void
}

const Recomposition = ({
    prepareCreate,
    handlePreviousStep,
}: RecompositionProps) => {
    const { t } = useTranslation('coach')
    const [kindOfDiet, setKindOfDiet] = useState(DIET_KIND[0].value)
    const [activityLevel, setActivityLevel] = useState(DIET_ACTIVITY[0].value)

    const handleNextStep = () => {
        prepareCreate({
            goal: goals.ZERO,
            kindOfDiet,
            isSportActive: true,
            activityLevel,
        })
    }

    return (
        <div className="flex h-full flex-col gap-4">
            <div>
                <button
                    className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="back"
                    onClick={() => handlePreviousStep('ChooseDiet')}
                >
                    <ArrowLeft />
                    <div />
                </button>
            </div>
            <NavbarOnlyTitle title="coach:RECOMPOSITION" />
            <div className="flex flex-1 items-center justify-center text-center">
                {t('RECOMPOSITION_DESCRIPTION')}
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
            <button
                className="rounded bg-primary-dark px-4 py-2 text-[#121212] hover:bg-[#64b5f6] disabled:opacity-50"
                onClick={handleNextStep}
            >
                {t('COUNT_DIET')}
            </button>
        </div>
    )
}

export default Recomposition
