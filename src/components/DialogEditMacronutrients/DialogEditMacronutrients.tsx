import DialogConfirm from '@/components/DialogConfirm/DialogConfirm';
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { reloadSession } from '@/utils/global.utils';
import { updateMacronutrientsInUser } from '@/utils/coach.utils';
import { trpc } from '@/utils/trpc.utils';

interface DialogEditMacronutrientsProps {
    isOwnMacro: boolean
    onClose: () => void
}

const DialogEditMacronutrients = ({
    isOwnMacro,
    onClose,
}: DialogEditMacronutrientsProps) => {
    const { data } = useSession()
    const [isDialog, setIsDialog] = useState(false) // TODO
    const [proteins, setProteins] = useState(0)
    const [carbs, setCarbs] = useState(0)
    const [fats, setFats] = useState(0)
    const { t } = useTranslation('macronutrients')

    const updateUser = trpc.user.update.useMutation({
        onSuccess() {
            onClose()
            reloadSession()
            setIsDialog(false)
        },
    })

    const handleConfirm = async () =>
        await updateUser.mutate({
            ...updateMacronutrientsInUser(
                proteins,
                carbs,
                fats,
            )
        })

    return (
        <>
            {isOwnMacro && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" onClick={onClose} />
                    <div className="relative z-50 w-full max-w-lg rounded-lg bg-white p-0 shadow-xl dark:bg-gray-900">
                        <div className="px-6 pt-6 text-lg font-semibold">{t('BUTTON')}</div>
                        <div className="px-6 py-4">
                            <p className="text-sm text-gray-500">
                                {t('OWN_MACRO_DESCRIPTION')}
                            </p>
                            <div className="mt-1 w-full">
                                <label className="mb-1 block text-sm text-gray-500">{t('PROTEINS')}</label>
                                <div className="flex items-center rounded border border-gray-300 bg-transparent focus-within:border-primary-dark dark:border-gray-600">
                                    <input
                                        className="flex-1 bg-transparent px-3 py-2 outline-none"
                                        type="number"
                                        value={proteins}
                                        onChange={(e) => setProteins(parseInt(e.target.value.toString()))}
                                    />
                                    <span className="px-3 text-sm text-gray-500">g/day</span>
                                </div>
                            </div>
                            <div className="mt-1 w-full">
                                <label className="mb-1 block text-sm text-gray-500">{t('CARBS')}</label>
                                <div className="flex items-center rounded border border-gray-300 bg-transparent focus-within:border-primary-dark dark:border-gray-600">
                                    <input
                                        className="flex-1 bg-transparent px-3 py-2 outline-none"
                                        type="number"
                                        value={carbs}
                                        onChange={(e) => setCarbs(parseInt(e.target.value.toString()))}
                                    />
                                    <span className="px-3 text-sm text-gray-500">g/day</span>
                                </div>
                            </div>
                            <div className="mt-1 w-full">
                                <label className="mb-1 block text-sm text-gray-500">{t('FATS')}</label>
                                <div className="flex items-center rounded border border-gray-300 bg-transparent focus-within:border-primary-dark dark:border-gray-600">
                                    <input
                                        className="flex-1 bg-transparent px-3 py-2 outline-none"
                                        type="number"
                                        value={fats}
                                        onChange={(e) => setFats(parseInt(e.target.value.toString()))}
                                    />
                                    <span className="px-3 text-sm text-gray-500">g/day</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-6 pb-6">
                            <button className="px-4 py-2 text-primary-dark hover:bg-[rgba(255,255,255,0.04)]" onClick={onClose}>{t('CLOSE')}</button>
                            <DialogConfirm onConfirmed={handleConfirm}>
                                <button className="px-4 py-2 text-primary-dark hover:bg-[rgba(255,255,255,0.04)]" onClick={() => setIsDialog(true)}>{t('CHANGE_ALL_DAYS')}</button>
                            </DialogConfirm>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default DialogEditMacronutrients;
