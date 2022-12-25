import { ConsumedFieldsFragment, ProductFieldsFragment, UserFieldsFragment } from "@/generated/graphql"

export const getCaloriesFromProduct = (product: ProductFieldsFragment) => {
    return Math.round(product.proteins * 4 + product.carbs * 4 + product.fats * 9)
}

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

export const getConsumedMacro = (consumed?: (ConsumedFieldsFragment | null)[] | null) => !consumed ? emptyMacro : consumed
    .reduce((prev: any, current) => ({
        proteins: prev.proteins + parseFloat(current?.product.proteins) || 0,
        carbs: prev.carbs + parseFloat(current?.product.carbs) || 0,
        sugar: prev.sugar + parseFloat(current?.product.sugar) || 0,
        fats: prev.fats + parseFloat(current?.product.fats) || 0,
        fiber: prev.fiber + parseFloat(current?.product.fiber) || 0,
        calories: prev.calories + (current?.product && getCaloriesFromProduct(current.product) || 0),
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