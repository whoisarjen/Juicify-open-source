import { goals, activityLevels, kindOfDiets } from "@prisma/client"

export const DIET_GOALS_SURPLUS = [
    {
        name: 'DIET_GOAL_1',
        value: goals.HALF,
    },
    {
        name: 'DIET_GOAL_2',
        value: goals.THREE_QUARTERS,
    },
    {
        name: 'DIET_GOAL_3',
        value: goals.ONE,
    },
    {
        name: 'DIET_GOAL_4',
        value: goals.ONE_AND_QUARTER,
    },
    {
        name: 'DIET_GOAL_5',
        value: goals.ONE_AND_HALF,
    }
]

export const DIET_GOALS_DEFICIT = [
    {
        name: 'DIET_GOAL_1',
        value: goals.MINUS_HALF,
    },
    {
        name: 'DIET_GOAL_2',
        value: goals.MINUS_THREE_QUARTERS,
    },
    {
        name: 'DIET_GOAL_3',
        value: goals.MINUS_ONE,
    },
    {
        name: 'DIET_GOAL_4',
        value: goals.MINUS_ONE_AND_QUARTER,
    },
    {
        name: 'DIET_GOAL_5',
        value: goals.MINUS_ONE_AND_HALF,
    }
]

export const DIET_ACTIVITY = [
    {
        name: 'DIET_ACTIVITY_1',
        value: activityLevels.ZERO,
    },
    {
        name: 'DIET_ACTIVITY_2',
        value: activityLevels.MINIMAL,
    },
    {
        name: 'DIET_ACTIVITY_3',
        value: activityLevels.AVERAGE,
    },
    {
        name: 'DIET_ACTIVITY_4',
        value: activityLevels.HIGH,
    },
    {
        name: 'DIET_ACTIVITY_5',
        value: activityLevels.EXTREME,
    }
]

export const DIET_KIND = [
    {
        name: 'DIET_KIND_1',
        value: kindOfDiets.REGULAR,
    },
    {
        name: 'DIET_KIND_2',
        value: kindOfDiets.KETOGENIC,
    }
]

export const DIET_EXTRA_PROTEINS = [
    {
        name: 'DIET_EXTRA_PROTEINS_1',
        value: 'true'
    },
    {
        name: 'DIET_EXTRA_PROTEINS_2',
        value: 'false'
    }
]
