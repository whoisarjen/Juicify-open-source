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
import { ExerciseSchema, ExerciseSchemaProps } from '@/containers/Workout/workout.schema'
import { useCreateExerciseMutation } from '@/generated/graphql';
import { v4 as uuidv4 } from 'uuid';
import { useSession } from 'next-auth/react';

interface DialogCreateExerciseProps {
    onCreated: (name: string) => void
}

const DialogCreateExercise = ({
    onCreated,
}: DialogCreateExerciseProps) => {
    const { t } = useTranslation('workout')
    const [isOpen, setIsOpen] = useState(false)
    const { data: sessionData } = useSession()
    const [{ fetching }, createExercise] = useCreateExerciseMutation()

    const onSubmit = async ({ name }: ExerciseSchemaProps) => {
        if (name) {
            await createExercise({
                id: uuidv4(),
                name,
                user: sessionData?.user?.id || '',
            })
            onCreated(name)
            setIsOpen(false)
        }
    }

    const { register, formState: { errors }, handleSubmit } = useForm<ExerciseSchemaProps>({
        resolver: zodResolver(ExerciseSchema)
    })

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
                            helperText={errors.name?.message && t(`notify:${errors.name.message || ''}`)}
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
                        <LoadingButton loading={fetching} type="submit">
                            {t('Submit')}
                        </LoadingButton>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}

export default DialogCreateExercise;