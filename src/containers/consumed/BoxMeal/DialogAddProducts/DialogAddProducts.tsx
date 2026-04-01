import { useState, type ReactNode, useEffect } from 'react'

import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'
import useTranslation from 'next-translate/useTranslation'
import BoxAddProduct from './BoxAddProduct/BoxAddProduct'
import { useRouter } from 'next/router'
import ButtonCloseDialog from '@/components/ButtonCloseDialog/ButtonCloseDialog'
import DialogCreateProduct from '@/containers/DialogCreateProduct/DialogCreateProduct'
import TabsAddDialog from '@/components/TabsAddDialog/TabsAddDialog'
import ButtonSubmitItems from '@/components/ButtonSubmitItems/ButtonSubmitItems'
import { useSession } from 'next-auth/react'
import { trpc } from '@/utils/trpc.utils'
import { env } from '@/env/client.mjs'
import CustomAutocomplete from '@/components/CustomAutocomplete/CustomAutocomplete'
import { range } from 'lodash'
import moment from 'moment'
import useCache from '@/hooks/useCache'

interface DialogAddProductsProps {
    children: ReactNode
    mealToAdd: number
}

const DialogAddProducts = ({ children, mealToAdd }: DialogAddProductsProps) => {
    const { data: sessionData } = useSession()
    const { t } = useTranslation('nutrition-diary')
    const [tab, setTab] = useState(0)
    const router: any = useRouter()
    const [name, setName] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [checked, setChecked] =
        useCache<(Product & { howMany?: number })[]>('CHECKED_PRODUCTS')
    const [meal, setMeal] = useState(mealToAdd)
    const [loadedProducts, setLoadedProducts] = useState<Product[]>([])

    const enabled = name.length >= env.NEXT_PUBLIC_SEARCH_MIN_NAME_LENGTH

    const { data = [], isFetching } = trpc.product.getAll.useQuery(
        { name },
        { enabled }
    )

    const utils = trpc.useContext()

    const createConsumed = trpc.consumed.create.useMutation({
        onSuccess(data, variables, context) {
            setChecked([])
            setIsDialogOpen(false)

            utils.consumed.getPeriod.refetch() // TODO
        },
    })

    const addProductsToDiary = async () => {
        await Promise.all(
            [...checked].map((product) =>
                createConsumed.mutateAsync({
                    productId: product.id,
                    whenAdded: moment(router.query.date)
                        .add(moment().format('hh:mm:ss'))
                        .toDate(),
                    howMany: product.howMany || 1,
                    meal,
                })
            )
        )
    }

    const products = tab === 1 ? checked : loadedProducts

    useEffect(() => {
        setMeal(mealToAdd)
    }, [mealToAdd])

    useEffect(() => {
        setLoadedProducts(data)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFetching])

    return (
        <>
            <div onClick={() => setIsDialogOpen(true)}>{children}</div>
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-auto">
                    <div className="flex flex-col items-center p-3">
                        <div className="flex w-full max-w-3xl flex-1 flex-col gap-3">
                            <NavbarOnlyTitle title="home:ADD_PRODUCTS" />
                            <select
                                className="mb-2.5 w-full rounded border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-600"
                                value={meal}
                                onChange={(e) => setMeal(Number(e.target.value))}
                            >
                                {range(0, sessionData?.user?.numberOfMeals).map(
                                    (index) => (
                                        <option key={index} value={index}>
                                            {t('Meal')} {index + 1}
                                        </option>
                                    )
                                )}
                            </select>

                            <CustomAutocomplete
                                find={name}
                                setFind={setName}
                                isLoading={isFetching}
                            />

                            <TabsAddDialog
                                changeTab={(value: number) => setTab(value)}
                                checkedLength={checked.length}
                            />

                            {products.map((product) => {
                                const isChecked = checked.some(
                                    (x) => x.id === product.id
                                )

                                return (
                                    <BoxAddProduct
                                        key={product.id}
                                        product={product}
                                        isChecked={isChecked}
                                        onCheckClick={() =>
                                            isChecked
                                                ? setChecked(
                                                      checked.filter(
                                                          ({ id }) =>
                                                              id !== product.id
                                                      )
                                                  )
                                                : setChecked([...checked, product])
                                        }
                                        onValueChange={(howMany) => {
                                            setLoadedProducts((state) =>
                                                state.map((currentProduct) => {
                                                    if (
                                                        currentProduct.id ===
                                                        product.id
                                                    ) {
                                                        return {
                                                            ...currentProduct,
                                                            howMany,
                                                        }
                                                    }

                                                    return currentProduct
                                                })
                                            )

                                            setChecked(
                                                checked.map((currentProduct) => {
                                                    if (
                                                        currentProduct.id ===
                                                        product.id
                                                    ) {
                                                        return {
                                                            ...currentProduct,
                                                            howMany,
                                                        }
                                                    }

                                                    return currentProduct
                                                })
                                            )
                                        }}
                                    />
                                )
                            })}

                            <DialogCreateProduct
                                created={(productName: string) =>
                                    setName(productName)
                                }
                            >
                                <button className="mx-auto rounded border border-blue-500 px-4 py-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800">
                                    {t('Create product')}
                                </button>
                            </DialogCreateProduct>

                            <ButtonSubmitItems
                                clicked={addProductsToDiary}
                                showNumber={checked.length}
                            />

                            <ButtonCloseDialog
                                clicked={() => setIsDialogOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default DialogAddProducts
