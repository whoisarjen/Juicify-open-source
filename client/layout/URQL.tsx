
import { createClient, dedupExchange, fetchExchange, subscriptionExchange, Provider } from 'urql'
import { authExchange } from '@urql/exchange-auth'
import { makeOperation } from '@urql/core'
import { ReactNode, useMemo } from 'react'
import { createClient as createWSClient } from 'graphql-ws';
import { offlineExchange } from '@urql/exchange-graphcache';
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage';
import { customCacheExchangeValue } from 'utils/urql.utils'
import schema, { RefreshTokenDocument } from '@/generated/graphql'
import { useSession } from 'next-auth/react';

const addAuthToOperation = ({ authState, operation }: any) => {
    if (!authState || !authState.token) {
        return operation
    }

    const fetchOptions =
        typeof operation.context.fetchOptions === 'function'
            ? operation.context.fetchOptions()
            : operation.context.fetchOptions || {}

    return makeOperation(operation.kind, operation, {
        ...operation.context,
        fetchOptions: {
            ...fetchOptions,
            headers: {
                ...fetchOptions.headers,
                Authorization: `JWT ${authState.token}`,
            },
        },
    })
}

const URQL = ({ children }: { children: ReactNode }) => {
    const isServerSide = typeof window === 'undefined';
    const { data: sessionData } = useSession()
    console.log({ sessionData })

    const didAuthError = ({ error }: any) => {
        console.log(error.graphQLErrors[0]?.message)
        return error.graphQLErrors.some(
            (e: any) => {
                if (e.message === 'User is disabled') {
                    // logout()
                }

                return e.message === 'Signature has expired'
            },
        )
    }

    const getAuth = async ({ authState, mutate }: any) => {
        if (isServerSide) {
            return null
        }

        if (!authState) {
            const token = localStorage.getItem('token')
            const refreshToken = localStorage.getItem('refreshToken')
            // reloadToken()

            if (token && refreshToken) {
                return { token, refreshToken }
            }
            return null
        }

        const result = await mutate(RefreshTokenDocument, {
            refreshToken: authState!.refreshToken,
        })

        if (result.data?.refreshToken) {
            localStorage.setItem('token', result.data.refreshToken.token)
            localStorage.setItem('refreshToken', result.data.refreshToken.refreshToken)
            localStorage.setItem('payload', JSON.stringify(result.data.refreshToken.payload))
            // reloadToken()

            return {
                token: result.data.refreshToken.token,
                refreshToken: result.data.refreshToken.refreshToken,
            }
        }

        // logout()

        return null
    }

    const wsClient =
        !isServerSide &&
        createWSClient({
            url: 'ws://localhost/graphql',
        })

    const storage =
        !isServerSide &&
        makeDefaultStorage({
            idbName: 'juicify',
            maxAge: 7,
        });

    const client = useMemo(() => createClient({
        url: process.env.SERVER as string,
        requestPolicy: 'cache-and-network',
        exchanges: [
            dedupExchange,
            // @ts-ignore
            ...(wsClient && storage
                ? [
                    offlineExchange({
                        schema,
                        storage,
                        ...customCacheExchangeValue,
                    }),
                    subscriptionExchange({
                        forwardSubscription: (operation: any) => ({
                            subscribe: (sink: any) => ({
                                unsubscribe: wsClient.subscribe(operation, sink),
                            }),
                        }),
                    })
                ]
                : []
            ),
            // @ts-ignore
            authExchange({
                getAuth,
                didAuthError,
                addAuthToOperation,
            }),
            // @ts-ignore
            fetchExchange,
        ],
    }), [isServerSide, schema])

    return (
        <Provider value={client}>
            {children}
        </Provider>
    )
}

export default URQL