import Link from "next/link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import styled from 'styled-components'
import DialogRules from "@/components/DialogRules/DialogRules";
import Logo from "@/components/Logo/Logo";
import { useNotify } from "@/hooks/useNotify";
import { zodResolver } from "@hookform/resolvers/zod";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { object, string, preprocess, number, boolean, TypeOf } from "zod";
import { useCreateUserMutation } from "@/generated/graphql";
import { omit } from 'lodash'
import moment from 'moment'

const Form = styled.div`
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-rows: 1fr auto 1fr;
    a{
        text-align: center;
    }
`
const LogoWrapper = styled.div`
    margin: auto;
    padding: 10px;
    max-width: 180px;
    display: grid;
`

const CreateUserSchema = object({
    username: string().min(3).max(50),
    password: string().min(8).max(150),
    passwordConfirmation: string().min(8).max(150),
    email: string().email().max(150),
    height: preprocess((val) => Number(val), number().min(120).max(250)),
    birth: string().transform(val => moment(new Date(val)).format('YYYY-MM-DD')),
    sex: preprocess((val) => Boolean(val), boolean()),
    rules: preprocess((val) => Boolean(val), boolean()),
}).refine(data => data.password === data.passwordConfirmation, {
    message: process.env.PASSWORDS_DO_NOT_MATCH,
    path: ['passwordConfirmation']
})

type CreateUserSchemaProps = Omit<TypeOf<typeof CreateUserSchema>, "body.passwordConfirmation">

const RegisterPage = () => {
    const router: any = useRouter();
    const { t } = useTranslation();
    const { success, error } = useNotify()
    const [date, setDate] = useState("1995-03-03")
    const [{ fetching }, createUser] = useCreateUserMutation()

    const { register, formState: { errors }, handleSubmit, setValue } = useForm<CreateUserSchemaProps>({
        resolver: zodResolver(CreateUserSchema)
    })

    const registerUser = async (newUser: CreateUserSchemaProps) => {
            if (!newUser.rules) {
                return error('ACCEPT_RULES');
            }
            const response = await createUser({
                ...omit(newUser, ['rules', 'passwordConfirmation'])
            })
            if (response.error?.message) {
                return error('USER_ALREADY_EXISTS')
            }
            success('CHECK_YOUR_EMAIL')
            router.push(`/login`);
    }

    useEffect(() => setValue('birth', date), [date])

    return (
        <Form onSubmit={handleSubmit(registerUser)}>
            <LogoWrapper>
                <Logo size={180} />
            </LogoWrapper>
            <Stack direction="column" spacing={2}>
                <TextField
                    variant="outlined"
                    label={t("auth:LOGIN")}
                    type="text"
                    {...register('username')}
                    error={!!errors.username}
                    helperText={errors.username?.message && t(`notify:${errors.username.message || ''}`)}
                />
                <TextField
                    type="email"
                    variant="outlined"
                    label={t("auth:EMAIL")}
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message && t(`notify:${errors.email.message || ''}`)}
                />
                <TextField
                    type="password"
                    variant="outlined"
                    label={t("auth:PASSWORD")}
                    {...register('password')}
                    data-testid="password"
                    error={!!errors.password}
                    helperText={errors.password?.message && t(`notify:${errors.password.message || ''}`)}
                />
                <TextField
                    type="password"
                    variant="outlined"
                    label={t("auth:PASSWORD_CONFIRMATION")}
                    {...register('passwordConfirmation')}
                    data-testid="confirmation"
                    error={!!errors.passwordConfirmation}
                    helperText={errors.passwordConfirmation?.message && t(`notify:${errors.passwordConfirmation.message || ''}`)}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                        label={t("auth:BIRTH")}
                        value={date}
                        inputFormat="dd.MM.yyyy"
                        onChange={(newValue: any) => setDate(newValue)}
                        renderInput={(params: any) => <TextField {...register('birth')} {...params} />}
                    />
                </LocalizationProvider>
                <TextField
                    type="Number"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    variant="outlined"
                    label={t("auth:HEIGHT")}
                    {...register('height')}
                    error={!!errors.height}
                    helperText={errors.height?.message && t(`notify:${errors.height.message || ''}`)}
                />
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">{t("auth:SEX")}</InputLabel>
                    <Select
                        {...register('sex')}
                        label={t("auth:SEX")}
                        defaultValue={1}
                    >
                        <MenuItem value={1}>{t("auth:MAN")}</MenuItem>
                        <MenuItem value={0}>{t("auth:WOMAN")}</MenuItem>
                    </Select>
                </FormControl>
                <DialogRules>
                    <FormControlLabel
                        control={
                            <Checkbox
                                {...register('rules')}
                            />
                        }
                        label={t('auth:I_AM_ACCEPTING_RULES')}
                    />
                </DialogRules>
                <LoadingButton
                    loading={fetching}
                    variant="contained"
                    type="submit"
                    onClick={handleSubmit(registerUser)}
                >
                    {t("auth:REGISTER")}
                </LoadingButton>
            </Stack>
            <Link passHref href="/login" legacyBehavior>
                <LoadingButton
                    color="success"
                    style={{ margin: 'auto 0' }}
                    variant="contained"
                >
                    {t("auth:ONE_OF_US_SIGN_IN")}
                </LoadingButton>
            </Link>
        </Form>
    );
};

export default RegisterPage;
