import { ConsumedFieldsFragment, UserFieldsFragment } from "@/generated/graphql"

export const getCaloriesFromProduct = (product: Product) =>
    Math.round(Number(product.proteins) * 4 + Number(product.carbs) * 4 + Number(product.fats) * 9)

export const multipleConsumedProductByHowMany = (consumed: ConsumedFieldsFragment) => ({
    ...consumed,
    product: {
        ...consumed.product,
        proteins: consumed.product.proteins * consumed.howMany,
        carbs: consumed.product.carbs * consumed.howMany,
        sugar: consumed.product.sugar * consumed.howMany,
        fats: consumed.product.fats * consumed.howMany,
        fiber: consumed.product.fiber * consumed.howMany,
    }
})

const emptyMacro = {
    proteins: 0,
    carbs: 0,
    sugar: 0,
    fats: 0,
    fiber: 0,
    calories: 0,
}

export const getConsumedMacro = (consumed?: Consumed[]) => !consumed ? emptyMacro : consumed
    .reduce((prev, { product, howMany }) => ({
        proteins: prev.proteins + Number(product.proteins) * Number(howMany),
        carbs: prev.carbs + Number(product.carbs) * Number(howMany),
        sugar: prev.sugar + Number(product.sugar) * Number(howMany),
        fats: prev.fats + Number(product.fats) * Number(howMany),
        fiber: prev.fiber + Number(product.fiber) * Number(howMany),
        calories: prev.calories + getCaloriesFromProduct(product),
    }), emptyMacro)

export const getExpectedMacro = (userByUsername?: UserFieldsFragment | null, when = new Date().toISOString()) => {
    const expectedProteins = (userByUsername?.[`proteinsDay${new Date(when).getDay()}` as keyof typeof userByUsername] || 0) as number
    const expectedCarbs = (userByUsername?.[`carbsDay${new Date(when).getDay()}` as keyof typeof userByUsername] || 0) as number
    const expectedFats = (userByUsername?.[`fatsDay${new Date(when).getDay()}` as keyof typeof userByUsername] || 0) as number

    return {
        proteins: expectedProteins,
        carbs: expectedCarbs,
        carbsPercentAsSugar: userByUsername?.carbsPercentAsSugar || 0,
        fats: expectedFats,
        fiber: userByUsername?.fiber || 0,
        calories: expectedProteins * 4 + expectedCarbs * 4 + expectedFats * 9,
    }
}