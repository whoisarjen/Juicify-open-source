import { useState, type ReactNode, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import SlideUp from '@/transition/SlideUp'
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
            <Dialog
                fullScreen
                scroll="body"
                open={isDialogOpen}
                TransitionComponent={SlideUp}
            >
                <div className="flex flex-col items-center p-3">
                    <div className="flex w-full max-w-3xl flex-1 flex-col gap-3">
                        <NavbarOnlyTitle title="home:ADD_PRODUCTS" />
                        <Select
                            sx={{ marginBottom: '10px' }}
                            value={meal}
                            fullWidth
                            onChange={(e) => setMeal(Number(e.target.value))}
                        >
                            {range(0, sessionData?.user?.numberOfMeals).map(
                                (index) => (
                                    <MenuItem key={index} value={index}>
                                        {t('Meal')} {index + 1}
                                    </MenuItem>
                                )
                            )}
                        </Select>

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
                            <Button variant="outlined" sx={{ margin: 'auto' }}>
                                {t('Create product')}
                            </Button>
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
            </Dialog>
        </>
    )
}

export default DialogAddProducts
