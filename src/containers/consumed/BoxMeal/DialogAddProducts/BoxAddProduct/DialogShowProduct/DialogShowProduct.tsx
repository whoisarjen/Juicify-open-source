import useTranslation from 'next-translate/useTranslation'
import {
    useState,
    cloneElement,
    type ReactElement,
} from 'react'
import ButtonCloseDialog from '@/components/ButtonCloseDialog/ButtonCloseDialog'
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm'
import { useSession } from 'next-auth/react'
import { trpc } from '@/utils/trpc.utils'
import DialogAddProduct from '@/containers/DialogAddProduct/DialogAddProduct'
import { DialogShowProductDetails } from './DialogShowProductDetails'

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
            {isDialog && (
                <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-900">
                    <div className="flex flex-col">
                        <DialogShowProductDetails product={product} />
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
                                    <button
                                        className="flex-1 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
                                    >
                                        {t('Delete')}
                                    </button>
                                </div>
                            </DialogConfirm>
                        )}
                        <DialogAddProduct product={product}>
                            <div className="fixed bottom-12 left-0 z-10 flex w-full items-center justify-center bg-black p-2">
                                <button className="flex-1 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50">
                                    {t('ADD_TO_DIARY')}
                                </button>
                            </div>
                        </DialogAddProduct>
                        <ButtonCloseDialog
                            clicked={() => handleSetIsDialog(false)}
                        />
                    </div>
                </div>
            )}
        </>
    )
}

export default DialogShowProduct
