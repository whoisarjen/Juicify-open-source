import { kindOfDiets } from "@prisma/client"

export const GOALS = {
    MINUS_ONE_AND_HALF: -1.5,
    MINUS_ONE_AND_QUARTER: -1.25,
    MINUS_ONE: -1,
    MINUS_THREE_QUARTERS: -0.75,
    MINUS_HALF: -0.5,
    ZERO: 0,
    HALF: 0.5,
    THREE_QUARTERS: 0.75,
    ONE: 1,
    ONE_AND_QUARTER: 1.25,
    ONE_AND_HALF: 1.5,
}

export const ACTIVITY_LEVELS = {
    ZERO: 1.2,
    MINIMAL: 1.375,
    AVERAGE: 1.55,
    HIGH: 1.715,
    EXTREME: 1.9,
}

export const updateMacronutrientsInUser = (proteins: number, carbs: number, fats: number) => ({
    proteinsDay0: proteins,
    carbsDay0: carbs,
    fatsDay0: fats,
    proteinsDay1: proteins,
    carbsDay1: carbs,
    fatsDay1: fats,
    proteinsDay2: proteins,
    carbsDay2: carbs,
    fatsDay2: fats,
    proteinsDay3: proteins,
    carbsDay3: carbs,
    fatsDay3: fats,
    proteinsDay4: proteins,
    carbsDay4: carbs,
    fatsDay4: fats,
    proteinsDay5: proteins,
    carbsDay5: carbs,
    fatsDay5: fats,
    proteinsDay6: proteins,
    carbsDay6: carbs,
    fatsDay6: fats,
})

type GetMacronutrients = {
    age: number
    isExtraProteins: boolean
    weight: number
    calories: number
    kindOfDiet: keyof typeof kindOfDiets
}

export type GetMacronutrientsReturn = {
    proteins: number
    carbs: number
    fats: number
}

const createKetogenicDiet = ({
    age,
    isExtraProteins,
    weight,
    calories,
}: GetMacronutrients) => {
    let proteins = 0
    let carbs = calories * 0.05 / 4
    let fats = 0

    // At least 40g carbs per day
    if ((carbs * 4) < 160) {
        carbs = 160
    }

    if (isExtraProteins) {
        proteins = 1.6 * weight * 4
    } else {
        if (age < 18) {
            proteins = 0.8 * weight * 4
        } else if (age < 40) {
            proteins = 1.1 * weight * 4
        } else if (age < 65) {
            proteins = 1.3 * weight * 4
        } else {
            proteins = 1.5 * weight * 4
        }
    }

    fats = calories - carbs - proteins

    if (fats < (calories * 0.7)) {
        if (age < 18) {
            proteins = 0.8 * weight * 4
        } else if (age < 40) {
            proteins = 1.1 * weight * 4
        } else if (age < 65) {
            proteins = 1.3 * weight * 4
        } else {
            proteins = 1.5 * weight * 4
        }

        fats = calories - carbs - proteins
    }

    proteins = Math.round(proteins / 4)
    carbs = Math.round(carbs / 4)
    fats = Math.round(fats / 9)

    return {
        proteins,
        carbs,
        fats,
    }
}

export const createBalancedDiet = ({ age, isExtraProteins, weight, calories }: GetMacronutrients) => {
    let proteins = 0
    let carbs = 0
    let fats = calories * 0.25

    if (isExtraProteins) {
        proteins = 1.6 * weight * 4
    } else {
        if (age < 18) {
            proteins = 0.8 * weight * 4
        } else if (age < 40) {
            proteins = 1.1 * weight * 4
        } else if (age < 65) {
            proteins = 1.3 * weight * 4
        } else {
            proteins = 1.5 * weight * 4
        }
    }

    carbs = calories - fats - proteins

    if (carbs < 160) {
        proteins += carbs - 160
        carbs = 160
    }

    proteins = Math.round(proteins / 4)
    carbs = Math.round(carbs / 4)
    fats = Math.round(fats / 9)

    return {
        proteins,
        carbs,
        fats,
    }
}

export const getMacronutrients = (props: GetMacronutrients): GetMacronutrientsReturn => {
    if (props.kindOfDiet === kindOfDiets.KETOGENIC) {
        return createKetogenicDiet(props)
    }

    return createBalancedDiet(props)
}
