import { zodResolver } from '@hookform/resolvers/zod';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc.utils';
import { type CreateExerciseSchema, createExerciseSchema } from '@/server/schema/exercise.schema';

interface DialogCreateExerciseProps {
    onCreated: (name: string) => void
}

const DialogCreateExercise = ({
    onCreated,
}: DialogCreateExerciseProps) => {
    const { t } = useTranslation('workout')
    const [isOpen, setIsOpen] = useState(false)
    const { data: sessionData } = useSession()
    const createExercise = trpc.exercise.create.useMutation({
        onSuccess: (data, variables) => {
            onCreated(variables.name)
            setIsOpen(false)
        }
    })

    const onSubmit = async (newExercise: CreateExerciseSchema) => {
        await createExercise.mutate(newExercise)
    }

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<CreateExerciseSchema>({ resolver: zodResolver(createExerciseSchema) })

    return (
        <>
            <button className="mx-auto rounded border border-blue-500 px-4 py-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800" onClick={() => setIsOpen(true)}>
                {t('Create exercise')}
            </button>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" />
                    <div className="relative z-50 w-full max-w-lg rounded-lg bg-white p-0 shadow-xl dark:bg-gray-900">
                        <form style={{ margin: 'auto 0' }} onSubmit={handleSubmit(onSubmit)}>
                            <div className="px-6 pt-6 text-lg font-semibold">{t('Create exercise')}</div>
                            <div className="px-6 py-4">
                                <p className="text-sm text-gray-500">
                                    {t('Create exercise description')}
                                </p>
                                <div className="mt-2 w-full">
                                    <label className="mb-1 block text-sm text-gray-500">{t('Name of exercise')}</label>
                                    <input
                                        className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-blue-500 dark:border-gray-600"
                                        {...register('name')}
                                        required
                                        autoFocus
                                        type="text"
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name?.message}</p>}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 px-6 pb-6">
                                <button className="px-4 py-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800" onClick={() => setIsOpen(false)}>{t('Cancel')}</button>
                                <button
                                    disabled={createExercise.isLoading}
                                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                                    type="submit"
                                >
                                    {createExercise.isLoading ? <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : t('Submit')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default DialogCreateExercise;
