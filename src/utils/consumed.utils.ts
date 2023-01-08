import { type Decimal } from "@prisma/client/runtime"
import moment from "moment"

export const DEFAULT_MACRO = {
    proteins: 0,
    carbs: 0,
    sugar: 0,
    fats: 0,
    fiber: 0,
    calories: 0,
}

export const getCalories = ({ proteins, carbs, fats }: { proteins: Decimal | number, carbs: Decimal | number, fats: Decimal | number }) =>
    Math.round(Number(proteins) * 4 + Number(carbs) * 4 + Number(fats) * 9)

export const sumMacroFromConsumed = (consumed: Consumed[]) =>
    consumed.reduce((previous, consumed) => {
        const { product } = multipleProductByHowMany(consumed)
        const { proteins, carbs, sugar, fats, fiber } = product

        return {
            proteins: previous.proteins + Number(proteins),
            carbs: previous.carbs + Number(carbs),
            sugar: previous.sugar + Number(sugar),
            fats: previous.fats + Number(fats),
            fiber: previous.fiber + Number(fiber),
            calories: previous.calories + getCalories(product),
        }
    }, DEFAULT_MACRO)

export const multipleProductByHowMany = (consumed: Consumed) => {
    const { product: defaultProduct } = consumed

    const product = Object.keys(defaultProduct)
        .reduce((previous, key) => ({
            ...previous,
            [key]: Number(defaultProduct[key])
                ? Number(defaultProduct[key]) * Number(consumed.howMany)
                : defaultProduct[key],
        }), {}) as Product

    return { ...consumed, product }
}

export const getExpectedMacro = (user: User | null | undefined, whenAdded: string) => {
    if (!user) {
        return DEFAULT_MACRO
    }

    const proteins = (user[`proteinsDay${moment(whenAdded).day()}` as keyof typeof user] || 0) as number
    const carbs = (user[`carbsDay${moment(whenAdded).day()}` as keyof typeof user] || 0) as number
    const fats = (user[`fatsDay${moment(whenAdded).day()}` as keyof typeof user] || 0) as number
    const calories = getCalories({ proteins, carbs, fats })

    const { fiber, carbsPercentAsSugar } = user

    return {
        proteins,
        carbs,
        sugar: Math.round(carbsPercentAsSugar / 100 * carbs),
        fats,
        fiber: Math.round(calories / 1000 * fiber),
        calories,
    }
}