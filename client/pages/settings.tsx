import SelectLanguage from '@/containers/settings/SelectLanguage/SelectLanguage';
import useAuth from '@/hooks/useAuth';
import { useNotify } from '@/hooks/useNotify';
import { useAppSelector } from '@/hooks/useRedux';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import useTranslation from 'next-translate/useTranslation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components'
import { object, preprocess, number, string, array, TypeOf } from 'zod';

const Form = styled.form`
    ${this} .MuiTextField-root {
        width: 100%;
        margin-bottom: 12px;
    }
`

const Separator = styled.div`
    font-size: 0.785rem;
    font-weight: bold;
    margin-bottom: 12px;
`

const SettingsSchema = object({
    meal_number: preprocess((val) => Number(val), number().min(1).max(10)).optional(),
    fiber: preprocess((val) => Number(val), number().min(0).max(100)).optional(),
    sugar_percent: preprocess((val) => Number(val), number().min(0).max(100)).optional(),
    name: string().max(50).optional(),
    surname: string().max(50).optional(),
    birth: string().optional(),
    height: preprocess((val) => Number(val), number().min(120).max(250)).optional(),
    description: string().max(255).optional(),
    website: string().max(150).optional(),
    facebook: string().max(150).optional(),
    instagram: string().max(150).optional(),
    twitter: string().max(150).optional(),
    macronutrients: array(object({ proteins: number(), carbs: number(), fats: number() })).optional(),
})

type SettingsSchemaProps = TypeOf<typeof SettingsSchema>

const SettingsPage = () => {
    const { success } = useNotify()
    const { t } = useTranslation('settings')
    const token: any = useAppSelector(state => state.token)

    const changeSettings = async (object: SettingsSchemaProps) => {
        try {
            // const response = await post({ object, url: '/auth/change' });
            // await dispatchToken(response.data.token)
            success()
        } catch (e: any) {
            console.log(e)
        }
    }

    const { register, formState: { errors, isDirty }, handleSubmit, reset } = useForm<SettingsSchemaProps>({
        resolver: zodResolver(SettingsSchema)
    })

    useEffect(() => reset(token), [token._id])

    const { logout } = useAuth()

    return (
        <Form onSubmit={handleSubmit(changeSettings)}>
            <Separator>{t('Preferences')}</Separator>
            <SelectLanguage />
            <Separator>{t('Diary')}</Separator>
            <TextField
                variant="outlined"
                label={t('Number of meals')}
                type="number"
                {...register('meal_number')}
                error={typeof errors.meal_number === 'undefined' ? false : true}
                helperText={errors.meal_number?.message && t(`notify:${errors.meal_number.message || ''}`)}
            />
            <TextField
                label={t("Fiber")}
                type="number"
                InputProps={{
                    endAdornment: <InputAdornment position="start">g / 1000 kcal</InputAdornment>
                }}
                {...register('fiber')}
                error={typeof errors.fiber === 'undefined' ? false : true}
                helperText={errors.fiber?.message && t(`notify:${errors.fiber.message || ''}`)}
            />
            <TextField
                label={t("Sugar")}
                type="number"
                InputProps={{
                    endAdornment: <InputAdornment position="start">% / {t("Carbs")}</InputAdornment>
                }}
                {...register('sugar_percent')}
                error={typeof errors.sugar_percent === 'undefined' ? false : true}
                helperText={errors.sugar_percent?.message && t(`notify:${errors.sugar_percent.message || ''}`)}
            />
            <Separator>{t('Profile')}</Separator>
            <TextField
                label={t("Name")}
                {...register('name')}
                error={typeof errors.name === 'undefined' ? false : true}
                helperText={errors.name?.message && t(`notify:${errors.name.message || ''}`)}
            />
            <TextField
                label={t("Surname")}
                variant="outlined"
                {...register('surname')}
                error={typeof errors.surname === 'undefined' ? false : true}
                helperText={errors.surname?.message && t(`notify:${errors.surname.message || ''}`)}
            />
            <TextField
                label={t("Height")}
                type="number"
                InputProps={{
                    endAdornment: <InputAdornment position="start">% / {t("Carbs")}</InputAdornment>
                }}
                {...register('height')}
                error={typeof errors.height === 'undefined' ? false : true}
                helperText={errors.height?.message && t(`notify:${errors.height.message || ''}`)}
            />
            <TextField
                label={t("Description")}
                variant="outlined"
                type="text"
                {...register('description')}
                error={typeof errors.description === 'undefined' ? false : true}
                helperText={errors.description?.message && t(`notify:${errors.description.message || ''}`)}
            />
            <TextField
                label={t("Website")}
                variant="outlined"
                InputProps={{
                    startAdornment: <InputAdornment position="start">https://</InputAdornment>
                }}
                type="text"
                {...register('website')}
                error={typeof errors.website === 'undefined' ? false : true}
                helperText={errors.website?.message && t(`notify:${errors.website.message || ''}`)}
            />
            <TextField
                label="Facebook"
                variant="outlined"
                InputProps={{
                    startAdornment: <InputAdornment position="start">https://facebook.com/</InputAdornment>
                }}
                type="text"
                {...register('facebook')}
                error={typeof errors.facebook === 'undefined' ? false : true}
                helperText={errors.facebook?.message && t(`notify:${errors.facebook.message || ''}`)}
            />
            <TextField
                label="Instagram"
                variant="outlined"
                InputProps={{
                    startAdornment: <InputAdornment position="start">https://instagram.com/</InputAdornment>
                }}
                type="text"
                {...register('instagram')}
                error={typeof errors.instagram === 'undefined' ? false : true}
                helperText={errors.instagram?.message && t(`notify:${errors.instagram.message || ''}`)}
            />
            <TextField
                label="Twitter"
                variant="outlined"
                InputProps={{
                    startAdornment: <InputAdornment position="start">https://twitter.com/</InputAdornment>
                }}
                type="text"
                {...register('twitter')}
                error={typeof errors.twitter === 'undefined' ? false : true}
                helperText={errors.twitter?.message && t(`notify:${errors.twitter.message || ''}`)}
            />
            <Separator>{t('Logout')}</Separator>
            <Button color="error" onClick={async () => await logout()}>
                Logout
            </Button>
            {/* {
                isDirty &&
                <BottomFlyingButton clicked={() => handleSubmit(changeSettings)} />
            } */}
        </Form>
    );
};

export default SettingsPage;