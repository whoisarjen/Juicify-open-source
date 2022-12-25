import { CreateConsumedMutation, ConsumedByWhenAndUsernameDocument, UpdateConsumedMutation, ConsumedFieldsFragment, ProductFieldsFragmentDoc, ConsumedFieldsFragmentDoc, CreateMeasurementMutation, MeasurementsByRangeAndUsernameDocument, CreateConsumedMutationVariables, CreateMeasurementMutationVariables } from "@/generated/graphql";
import { store } from "redux/store";

export const customCacheExchangeValue =
{
    updates: {
        Mutation: {
            createConsumed: (result: CreateConsumedMutation, args: any, cache: any, info: any) => {
                cache
                    .inspectFields({ __typename: 'Query' })
                    .filter((field: any) =>
                        field.fieldName === 'consumedByWhenAndUsername' &&
                        field.arguments.username === store.getState().token.username &&
                        field.arguments.when === args.when
                    )
                    .forEach(({ arguments: variables }: any) => {
                        cache.updateQuery({ query: ConsumedByWhenAndUsernameDocument, variables }, (data: any) => {
                            return {
                            ...data,
                            consumedByWhenAndUsername: [...data.consumedByWhenAndUsername, result?.createConsumed?.consumed],
                        }});
                    })
            },
            updateConsumed: (result: UpdateConsumedMutation, _args: any, cache: any) => {
                cache
                    .inspectFields({ __typename: 'Query' })
                    .filter((field: any) =>
                        field.fieldName === 'consumedByWhenAndUsername' &&
                        field.arguments.username === store.getState().token.username
                    )
                    .forEach(({ arguments: variables }: any) => {
                        cache.updateQuery({ query: ConsumedByWhenAndUsernameDocument, variables }, (data: any) => ({
                            ...data,
                            consumedByWhenAndUsername: data.consumedByWhenAndUsername.map((consumed: ConsumedFieldsFragment) => {
                                if (consumed && consumed.id === result?.updateConsumed?.consumed?.id) {
                                    return result.updateConsumed?.consumed
                                }
                                return consumed
                            })
                        }));
                    })
            },
            deleteConsumed: (_result: any, args: any, cache: any) => {
                cache
                    .inspectFields({ __typename: 'Query' })
                    .filter((field: any) => field.fieldName === 'consumedByWhenAndUsername')
                    .forEach(({ arguments: variables }: any) => {
                        cache.updateQuery({ query: ConsumedByWhenAndUsernameDocument, variables }, (data: any) => ({
                            ...data,
                            consumedByWhenAndUsername: data
                                .consumedByWhenAndUsername
                                .filter((consumed: ConsumedFieldsFragment) => consumed && consumed.id !== args.id)
                        }));
                    })
            },
            createMeasurement: (result: CreateMeasurementMutation, args: any, cache: any, info: any) => {
                cache
                    .inspectFields({ __typename: 'Query' })
                    .filter((field: any) =>
                        field.fieldName === 'measurementsByRangeAndUsername' &&
                        field.arguments.username === store.getState().token.username
                    )
                    .forEach(({ arguments: variables }: any) => {
                        cache.updateQuery({ query: MeasurementsByRangeAndUsernameDocument, variables }, (data: any) => {
                            return {
                            ...data,
                            measurementsByRangeAndUsername: [...data.measurementsByRangeAndUsername, result?.createMeasurement?.measurement],
                        }});
                    })
            },
        }
    },
    optimistic: {
        createConsumed: (variables: CreateConsumedMutationVariables, cache: any) => ({
            consumed: {
                ...variables,
                product: cache.readFragment(
                    ProductFieldsFragmentDoc,
                    { id: variables.product }
                ),
                user: {
                    id: variables.user,
                    __typename: "UserType"
                },
                __typename: "ConsumedType"
            },
            __typename: "CreateConsumed"
        }),
        updateConsumed: (variables: any, cache: any) => ({
            consumed: {
                ...cache.readFragment(
                    ConsumedFieldsFragmentDoc,
                    { id: variables.id }
                ),
                ...variables,
            },
            __typename: "UpdateConsumed"
        }),
        deleteConsumed: () => ({
            "consumed": null,
            "__typename": "DeleteConsumed"
        }),
    }
}