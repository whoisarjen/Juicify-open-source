import { useState, useMemo } from 'react'
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import styled from 'styled-components'
import SlideUp from '../../transition/SlideUp';
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle';
import useTranslation from 'next-translate/useTranslation';
import BoxAddProduct from './BoxAddProduct/BoxAddProduct';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { cleanChecked, setIsDialogAddProducts, setMealToAdd } from '@/redux/features/dialogAddProducts.slice';
import { useCreateConsumedMutation } from '@/generated/graphql';
import ButtonCloseDialog from '@/components/ButtonCloseDialog/ButtonCloseDialog';
import DialogCreateProduct from '@/containers/DialogCreateProduct/DialogCreateProduct';
import TabsAddDialog from '@/components/TabsAddDialog/TabsAddDialog';
import ButtonSubmitItems from '@/components/ButtonSubmitItems/ButtonSubmitItems';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';
import { env } from '@/env/client.mjs';
import DialogAddProduct from '../DialogAddProduct/DialogAddProduct';
import DialogShowProduct from '../DialogShowProduct/DialogShowProduct';
import CustomAutocomplete from '@/components/CustomAutocomplete/CustomAutocomplete';
import { range } from 'lodash';

const Grid = styled.div`
    width: 100%;
    margin: 0 auto;
    max-width: 702px;
    padding: 12px;
    display: grid;
    min-height: calc(100vh - var(--BothNavHeightAndPadding));
    ${this} {
        min-height: auto;
    }
    @media (max-width: 726px) {
        ${this} {
            width: calc(100% - 24px);
        }
    }
`

const DialogAddProducts = () => {
    const dispatch = useAppDispatch()
    const {
        isDialogAddProducts,
        mealToAdd,
        checked,
    } = useAppSelector(state => state.dialogAddProducts)
    const { data: sessionData } = useSession()

    const { t } = useTranslation('nutrition-diary');
    const [tab, setTab] = useState(0)
    const router: any = useRouter()
    const [name, setName] = useState('')

    const enabled = name.length >= env.NEXT_PUBLIC_SEARCH_MIN_NAME_LENGTH

    const {
        data = [],
        isFetching,
        refetch,
    } = trpc.product.getAll.useQuery({ name }, { enabled })

    const [, createConsumed] = useCreateConsumedMutation()

    const addProductsToDiary = () => {
        // [...checked].forEach(async (product) => {
        //     if (sessionData?.user?.id) {
        //         await createConsumed({
        //             meal: mealToAdd,
        //             when: router.query.date,
        //             product: product.id,
        //             user: sessionData?.user?.id || '',
        //             howMany: product.howMany
        //         })
        //     }
        // })
        // dispatch(cleanChecked())
        // dispatch(setIsDialogAddProducts(false))
    }

    const products = useMemo(() => {
        if (tab === 1) {
            return checked
        }

        return data
    }, [data, checked, tab])

    return (
        <Dialog
            fullScreen
            scroll='body'
            open={isDialogAddProducts}
            TransitionComponent={SlideUp}
        >
            <Grid>
                <NavbarOnlyTitle title="home:ADD_PRODUCTS" />
                <Select
                    sx={{ marginBottom: '10px' }}
                    value={mealToAdd}
                    fullWidth
                    onChange={(e) => dispatch(setMealToAdd(e.target.value))}
                >
                    {range(0, sessionData?.user?.numberOfMeals).map(index =>
                        <MenuItem key={index} value={index}>{t('Meal')} {index + 1}</MenuItem>
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

                {enabled &&
                    products.map(product =>
                        <BoxAddProduct
                            key={product.id}
                            product={product}
                            isChecked={checked.some(x => x.id === product.id)}
                        />
                    )}

                <DialogCreateProduct created={(productName: string) => setName(productName)}>
                    <Button variant="outlined" sx={{ margin: 'auto' }}>
                        {t('Create product')}
                    </Button>
                </DialogCreateProduct>

                <ButtonSubmitItems clicked={addProductsToDiary} showNumber={checked.length} />

                <ButtonCloseDialog clicked={() => dispatch(setIsDialogAddProducts(false))} />

                <DialogShowProduct onClose={refetch}>
                    <DialogAddProduct />
                </DialogShowProduct>
            </Grid>
        </Dialog>
    );
}

export default DialogAddProducts;