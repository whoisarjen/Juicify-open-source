import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import SlideUp from '@/transition/SlideUp'
import { omit } from 'lodash'
import useTranslation from 'next-translate/useTranslation'
import {
    type ReactNode,
    useState,
    cloneElement,
    type ReactElement,
} from 'react'
import ButtonCloseDialog from '@/components/ButtonCloseDialog/ButtonCloseDialog'
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm'
import { useSession } from 'next-auth/react'
import { trpc } from '@/utils/trpc.utils'
import DialogAddProduct from '@/containers/DialogAddProduct/DialogAddProduct'

const PROPERTIES_TO_OMIT = [
    'id',
    'userId',
    'nameLength',
    'isVerified',
    'isDeleted',
    'isExpectingCheck',
    'createdAt',
    'updatedAt',
]

interface DialogShowProductProps {
    children?: ReactElement
    product: Product
    onClose?: () => void
    defaultState?: boolean
}

const DialogShowProduct = ({
    children,
    product,
    onClose,
    defaultState = false,
}: DialogShowProductProps) => {
    const { t } = useTranslation('nutrition-diary')
    const { data: sessionData } = useSession()

    const [isDialog, setIsDialog] = useState(defaultState)

    const handleSetIsDialog = (state: boolean) => {
        if (!state) {
            onClose?.()
        }

        setIsDialog(state)
    }

    const deleteProduct = trpc.product.delete.useMutation({
        onSuccess() {
            handleSetIsDialog(false)
        },
    })

    const isOwner = sessionData?.user?.id == product?.userId

    return (
        <>
            {children &&
                cloneElement(children, {
                    onClick: () => handleSetIsDialog(true),
                })}
            <Dialog fullScreen open={isDialog} TransitionComponent={SlideUp}>
                <div className="flex flex-col">
                    <table style={{ textAlign: 'center' }}>
                        <tbody>
                            {Object.keys(omit(product, PROPERTIES_TO_OMIT)).map(
                                (key) => (
                                    <tr key={key}>
                                        <td key={key}>{key}</td>
                                        <td>
                                            {
                                                product[
                                                    key as keyof typeof product
                                                ] as unknown as ReactNode
                                            }
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                    <div className="h-20 w-full" />
                    {isOwner && (
                        <DialogConfirm
                            isDisabled={!isOwner}
                            onConfirmed={async () =>
                                await deleteProduct.mutateAsync({
                                    id: product.id,
                                })
                            }
                        >
                            <div className="fixed bottom-24 left-0 z-10 flex w-full items-center justify-center bg-black p-2">
                                <Button
                                    variant="contained"
                                    className="flex-1"
                                    color="error"
                                >
                                    {t('Delete')}
                                </Button>
                            </div>
                        </DialogConfirm>
                    )}
                    <DialogAddProduct product={product}>
                        <div className="fixed bottom-12 left-0 z-10 flex w-full items-center justify-center bg-black p-2">
                            <Button variant="contained" className="flex-1">
                                {t('ADD_TO_DIARY')}
                            </Button>
                        </div>
                    </DialogAddProduct>
                    <ButtonCloseDialog
                        clicked={() => handleSetIsDialog(false)}
                    />
                </div>
            </Dialog>
        </>
    )
}

export default DialogShowProduct
