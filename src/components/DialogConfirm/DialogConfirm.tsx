import useTranslation from "next-translate/useTranslation"
import { useState } from 'react'

interface DialogConfirmProps {
    children: any
    onConfirmed: () => void
    isDisabled?: boolean
}

const DialogConfirm = ({
    children,
    onConfirmed,
    isDisabled,
}: DialogConfirmProps) => {
    const [isDialog, setIsDialog] = useState(false)
    const { t } = useTranslation('home')

    const handleSetIsDialog = (event: any, state: boolean) => {
        event?.stopPropagation()
        setIsDialog(state)
    }

    const handleConfimed = (event: any) => {
        onConfirmed()
        handleSetIsDialog(event, false)
    }

    return (
        <>
            <div onClick={event => !isDisabled && handleSetIsDialog(event, true)}>{children}</div>
            {isDialog && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" onClick={event => handleSetIsDialog(event, false)} />
                    <div className="relative z-[200] w-full max-w-lg rounded-lg bg-white p-0 shadow-xl dark:bg-gray-900 mx-4">
                        <div className="px-6 pt-6 text-lg font-semibold">
                            {t('Confirm Dialog Title')}
                        </div>
                        <div className="px-6 py-4">
                            <p className="text-sm text-gray-500">
                                {t('This action can NOT be undone')}.
                            </p>
                        </div>
                        <div className="flex justify-end gap-2 px-6 pb-6">
                            <button className="px-4 py-2 text-primary-dark hover:bg-[rgba(255,255,255,0.04)] cursor-pointer" onClick={event => handleSetIsDialog(event, false)}>{t('Deny')}</button>
                            <button
                                className="px-4 py-2 text-primary-dark hover:bg-[rgba(255,255,255,0.04)] cursor-pointer"
                                onClick={handleConfimed}
                                autoFocus
                            >
                                {t('Confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default DialogConfirm
