import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import SlideUp from "@/transition/SlideUp";
import useTranslation from 'next-translate/useTranslation';
import { cloneElement, useState, type ReactElement } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc.utils';

interface DialogAddProductProps {
    children: ReactElement
    product: Product
}

const DialogAddProduct = ({
    children,
    product,
}: DialogAddProductProps) => {
    const { t } = useTranslation('nutrition-diary')
    const { data: sessionData } = useSession()
    const [howMany, setHowMany] = useState<number | undefined>(1.0)
    const [mealToAdd, setMealToAdd] = useState(0)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const router: any = useRouter()

    const utils = trpc.useContext()

    const createConsumed = trpc.consumed.create.useMutation({ // TODO move to useConsumed and remove in diffrent places
        onSuccess(data, variables, context) {
            setIsDialogOpen(false) // TODO should close all open dialogs

            utils
                .consumed
                .getPeriod
                .refetch() // TODO
        },
    })

    const addNewProduct = async () => {
        await createConsumed.mutateAsync({
            whenAdded: moment(router.query.date).add(moment().format("hh:mm:ss")).toDate(), // TODO It has to be local date
            howMany: howMany || 1,
            productId: product.id,
            meal: mealToAdd || 0, // TODO should also get from props
        })
    }

    return (
        <>
            {cloneElement(children, { onClick: () => setIsDialogOpen(true) })}
            <Dialog
                open={isDialogOpen}
                TransitionComponent={SlideUp}
                keepMounted
                onClose={() => setIsDialogOpen(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{t('ADD_TO_DIARY')}</DialogTitle>
                <DialogContent>
                    <Select
                        sx={{ marginBottom: '10px' }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={mealToAdd}
                        fullWidth
                        onChange={(e) => setMealToAdd(Number(e.target.value))}
                    >
                        {
                            [...Array(sessionData?.user?.numberOfMeals)].map((x, i) =>
                                <MenuItem key={i} value={i}>{t('Meal')} {i + 1}</MenuItem>
                            )
                        }
                    </Select>
                    <TextField
                        value={howMany}
                        onChange={(e) => setHowMany(e.target.value ? Number(e.target.value) : undefined)}
                        id="outlined-basic"
                        label={t('How many times 100g/ml')}
                        variant="outlined"
                        fullWidth
                        sx={{ marginTop: '12px' }}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">x 100g/ml</InputAdornment>,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)}>{t('Deny')}</Button>
                    <Button onClick={addNewProduct}>{t('Confirm')}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DialogAddProduct;