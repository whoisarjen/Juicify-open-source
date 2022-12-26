import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import styled from 'styled-components'
import SlideUp from '../../transition/SlideUp';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setIsDialogShowProduct } from '@/redux/features/dialogShowProduct.slice';
import { omit } from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import { setIsDialogAddProduct, setMealToAdd, setSelectProduct } from '@/redux/features/dialogAddProduct.slice';
import { ReactNode } from 'react';
import ButtonCloseDialog from '@/components/ButtonCloseDialog/ButtonCloseDialog';
import { useDeleteProductMutation } from '@/generated/graphql';
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm';
import { useSession } from 'next-auth/react';

const Remove = styled.div`
    display: grid;
    width: calc(100% - 10px);
    padding: 3.75px 5px;
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--theme-background);
    z-index: 2;
    ${this} button{
        background: red;
    }
`

const Close = styled.div`
    display: grid;
    width: calc(100% - 10px);
    padding: 3.75px 5px;
    position: fixed;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--theme-background);
    z-index: 2;
`

const Placeholder = styled.div`
    width: 100%;
    height: 88px;
`

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

const PROPERTY_TO_OMIT = [
    'id',
    'user',
    'isVerified',
    'isDeleted',
    'isExpectingCheck',
    '__typename',
]

const DialogShowProduct = ({ children }: { children: ReactNode }) => {
    const { t } = useTranslation('nutrition-diary')
    const dispatch = useAppDispatch()
    const { mealToAdd } = useAppSelector(state => state.dialogAddProducts)
    const { isDialogShowProduct, selectedProduct } = useAppSelector(state => state.dialogShowProduct)
    const { data: sessionData } = useSession()
    const [, deleteProduct] = useDeleteProductMutation()

    const handleDialogAddProduct = () => {
        dispatch(setMealToAdd(mealToAdd))
        dispatch(setSelectProduct(selectedProduct))
        dispatch(setIsDialogAddProduct(true))
    }

    const handleDeleteProduct = async () => {
        if (sessionData?.user?.id) {
            await deleteProduct({
                id: selectedProduct?.id,
                user: sessionData.user.id,
            })
            dispatch(setIsDialogShowProduct(false))
        }
    }

    return (
        <Dialog
            fullScreen
            open={isDialogShowProduct}
            TransitionComponent={SlideUp}
        >
            <Grid>
                {children}
                <table style={{ textAlign: 'center' }}>
                    <tbody>
                        {Object.keys(omit(selectedProduct, PROPERTY_TO_OMIT)).map(key =>
                            <tr key={key}>
                                <td key={key}>{key}</td>
                                <td>{selectedProduct[key as keyof typeof selectedProduct]}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <Placeholder />
                {sessionData?.user?.id == selectedProduct?.user?.id &&
                    <DialogConfirm confirmed={handleDeleteProduct}>
                        <Remove>
                            <Button variant="contained">
                                {t('Delete')}
                            </Button>
                        </Remove>
                    </DialogConfirm>
                }
                <Close onClick={handleDialogAddProduct}>
                    <Button variant="contained">
                        {t('ADD_TO_DIARY')}
                    </Button>
                </Close>
                <ButtonCloseDialog clicked={() => dispatch(setIsDialogShowProduct(false))} />
            </Grid>
        </Dialog>
    )
}

export default DialogShowProduct;