import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
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
            <Button variant="outlined" onClick={() => setIsOpen(true)} sx={{ margin: 'auto' }}>
                {t('Create exercise')}
            </Button>
            <Dialog open={isOpen}>
                <form style={{ margin: 'auto 0' }} onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>{t('Create exercise')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {t('Create exercise description')}
                        </DialogContentText>
                        <TextField
                            {...register('name')}
                            error={typeof errors.name === 'undefined' ? false : true}
                            helperText={errors.name?.message}
                            required
                            autoFocus
                            margin="dense"
                            id="name"
                            label={t('Name of exercise')}
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsOpen(false)}>{t('Cancel')}</Button>
                        <LoadingButton loading={createExercise.isLoading} type="submit">
                            {t('Submit')}
                        </LoadingButton>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}

export default DialogCreateExercise;