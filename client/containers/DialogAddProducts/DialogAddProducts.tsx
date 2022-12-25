import { Fragment, useEffect, useState, useMemo } from 'react'
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
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
import { useCreateConsumedMutation, useProductsByNameQuery } from '@/generated/graphql';
import ButtonCloseDialog from '@/components/ButtonCloseDialog/ButtonCloseDialog';
import DialogCreateProduct from '@/containers/DialogCreateProduct/DialogCreateProduct';
import TabsAddDialog from '@/components/TabsAddDialog/TabsAddDialog';
import ButtonSubmitItems from '@/components/ButtonSubmitItems/ButtonSubmitItems';
import { v4 as uuidv4 } from 'uuid';

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
    const token = useAppSelector(state => state.token)


    const { t } = useTranslation('nutrition-diary');
    const [tab, setTab] = useState(0)
    const router: any = useRouter()


    const [name, setName] = useState('')
    const [{ data, fetching }, getProductsByName] = useProductsByNameQuery({
        variables: {
            name,
        },
        pause: true,
    })

    useEffect(() => {
        if (name?.length >= (process.env.SEARCH_MIN_NAME_LENGTH as unknown as number)) {
            getProductsByName()
        }
    }, [name, tab])

    const [, createConsumed] = useCreateConsumedMutation()

    const created = async (productName: string) => setName(productName === name ? '' : productName)

    const addProductsToDiary = () => {
        [...checked].forEach(async (product) => {
            if (token.id) {
                await createConsumed({
                    id: uuidv4(),
                    meal: mealToAdd,
                    when: router.query.date,
                    product: product.id,
                    user: token.id as string,
                    howMany: product.howMany
                })
            }
        })
        dispatch(cleanChecked())
        dispatch(setIsDialogAddProducts(false))
    }

    const products = useMemo(() => {
        if (tab === 1) {
            return checked
        }

        return data?.productsByName
    }, [data?.productsByName, checked, tab])

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
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={mealToAdd}
                    fullWidth
                    onChange={(e) => dispatch(setMealToAdd(e.target.value))}
                >
                    {[...Array(token?.numberOfMeals)].map((x, i) =>
                        <MenuItem key={i} value={i}>{t('Meal')} {i + 1}</MenuItem>
                    )}
                </Select>
                <Autocomplete
                    value={name}
                    sx={{ marginBottom: '10px', width: '100%' }}
                    open={false}
                    isOptionEqualToValue={(option, value) => option === value}
                    getOptionLabel={option => option ? option : ''}
                    options={[]}
                    loading={fetching}
                    onInputChange={(e, value) => setName(value.trim().toLowerCase())}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={t('Search')}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <Fragment>
                                        {fetching ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </Fragment>
                                ),
                            }}
                        />
                    )}
                />
                <TabsAddDialog changeTab={(value: number) => setTab(value)} checkedLength={checked.length} />

                {((name?.length >= (process.env.SEARCH_MIN_NAME_LENGTH as unknown as number) && products) || []).map(product =>
                    product && !product.isDeleted &&
                    <BoxAddProduct
                        key={product.id}
                        product={product}
                        isChecked={checked.some(x => x.id === product.id)}
                    />
                )}

                <DialogCreateProduct created={created}>
                    <Button variant="outlined" sx={{ margin: 'auto' }}>
                        {t('Create product')}
                    </Button>
                </DialogCreateProduct>

                <ButtonSubmitItems clicked={addProductsToDiary} showNumber={checked.length} />

                <ButtonCloseDialog clicked={() => dispatch(setIsDialogAddProducts(false))} />

            </Grid>
        </Dialog>
    );
}

export default DialogAddProducts;