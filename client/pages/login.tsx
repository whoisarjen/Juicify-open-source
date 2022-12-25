import Link from "next/link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import styled from 'styled-components'
import { zodResolver } from "@hookform/resolvers/zod";
import useTranslation from "next-translate/useTranslation";
import { useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod"
import Logo from "@/components/Logo/Logo";
import { useTokenAuthMutation } from "@/generated/graphql";
import moment from "moment";

const Form = styled.form`
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
`

const LoginSchema = object({
    username: string().min(3).max(60),
    password: string().min(8).max(255)
})

export type LoginSchemaProps = TypeOf<typeof LoginSchema>

const LoginPage = () => {
    const { t } = useTranslation()
    const [{ fetching }, login] = useTokenAuthMutation()

    const { register, formState: { errors }, handleSubmit } = useForm<LoginSchemaProps>({
        resolver: zodResolver(LoginSchema)
    })

    const handleLogin = (loginDetails: LoginSchemaProps) => {
        login(loginDetails)
            .then(async ({ data }) => {
                if (!data?.tokenAuth) {
                    return
                }
                localStorage.setItem('token', data.tokenAuth.token)
                localStorage.setItem('refreshToken', data.tokenAuth.refreshToken)
                localStorage.setItem('payload', JSON.stringify(data.tokenAuth.payload))
                document.location = `/${data.tokenAuth.payload.username}/consumed/${moment().format('YYYY-MM-DD')}`
            })
    }

    return (
        <Form onSubmit={handleSubmit(handleLogin)}>
            <LogoWrapper>
                <Logo size={180} />
            </LogoWrapper>
            <Stack direction="column" spacing={2}>
                <TextField
                    variant="outlined"
                    label={t("auth:LOGIN")}
                    type="text"
                    {...register('username')}
                    error={typeof errors.username === 'undefined' ? false : true}
                    helperText={errors.username?.message && t(`notify:${errors.username.message || ''}`)}
                />
                <TextField
                    type="password"
                    variant="outlined"
                    label={t("auth:PASSWORD")}
                    {...register('password')}
                    error={typeof errors.password === 'undefined' ? false : true}
                    helperText={errors.password?.message && t(`notify:${errors.password.message || ''}`)}
                />
                <LoadingButton
                    loading={fetching}
                    variant="contained"
                    type="submit"
                    data-testid="login_button"
                >
                    {t("auth:SIGN_IN")}
                </LoadingButton>
                <Link passHref href="/reset-password" legacyBehavior>
                    {t("auth:FORGOT_PASSWORD_RESET_IT")}
                </Link>
            </Stack>
            <Link passHref href="/register" legacyBehavior>
                <LoadingButton
                    data-testid="register_button"
                    color="success"
                    style={{ margin: 'auto 0' }}
                    variant="contained"
                >
                    {t("auth:FIRST_TIME_CREATE_ACCOUNT")}
                </LoadingButton>
            </Link>
        </Form>
    );
};

export default LoginPage;