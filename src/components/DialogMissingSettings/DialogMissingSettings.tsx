import * as React from 'react';
import { reloadSession } from '@/utils/global.utils';
import { trpc } from '@/utils/trpc.utils';
import { type UserSchema, userSchema } from '@/server/schema/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@/components/DatePicker'

export const DialogMissingSettings = ({ onSkip }: { onSkip?: () => void }) => {
    const { t } = useTranslation()
    const { data: sessionData } = useSession()

    const updateUser = trpc.user.update.useMutation({
        onSuccess() {
            reloadSession()
        },
    })

    const changeSettings = async (newUserSettings: UserSchema) =>
        await updateUser.mutateAsync(newUserSettings)

    const {
        register,
        formState: {
            errors,
            isDirty,
        },
        handleSubmit,
        reset,
        setValue,
        getValues,
    } = useForm<UserSchema>({ resolver: zodResolver(userSchema) })

    React.useEffect(() => {
        if (!sessionData?.user) {
            return
        }

        reset(sessionData.user)
    }, [reset, sessionData?.user])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" />
            <div className="relative z-50 w-full max-w-lg rounded-lg bg-white p-0 shadow-xl dark:bg-gray-900">
                <div className="px-6 pt-6 text-lg font-semibold">{t('home:MISSING_SETTINGS')}</div>
                <div className="px-6 py-4">
                    <p className="text-sm text-gray-500">
                        {t('home:MISSING_SETTINGS_DESCRIPTION')}
                    </p>
                    <div className="my-3 w-full">
                        <label className="mb-1 block text-sm text-gray-500">{t("HEIGHT")}</label>
                        <div className="flex items-center rounded border border-gray-300 bg-transparent focus-within:border-blue-500 dark:border-gray-600">
                            <input
                                className="flex-1 bg-transparent px-3 py-2 outline-none"
                                type="text"
                                inputMode="decimal"
                                {...register('height')}
                            />
                            <span className="px-3 text-sm text-gray-500">cm</span>
                        </div>
                        {errors.height && <p className="mt-1 text-xs text-red-500">{errors.height?.message}</p>}
                    </div>

                    <DatePicker
                        defaultDate={getValues().birth}
                        onChange={newBirth => setValue('birth', newBirth, { shouldDirty: true })}
                        register={register('birth')}
                    />
                </div>
                <div className="flex justify-end gap-2 px-6 pb-6">
                    {onSkip && (
                        <button className="px-4 py-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800" onClick={onSkip}>
                            {t('home:SKIP_FOR_NOW')}
                        </button>
                    )}
                    <button
                        disabled={updateUser.isPending}
                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                        onClick={handleSubmit(changeSettings)}
                    >
                        {updateUser.isPending ? <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : t('home:SAVE_AND_CLOSE')}
                    </button>
                </div>
            </div>
        </div>
    );
}
