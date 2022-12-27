import Link from "next/link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import styled from 'styled-components'

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
`

const ResetPasswordPage = () => {
    // const { t } = useTranslation('auth');
    // const [loading, setLoading] = useState(false)

    // const { register, formState: { errors }, handleSubmit } = useForm<RemindPasswordUserSchemaProps>({
    //     resolver: zodResolver(RemindPasswordUserSchema)
    // })

    // const onSubmit = async (object: RemindPasswordUserSchemaProps) => {
    //     try {
    //         setLoading(true);
    //         await post({ url: '/auth/reset-password', object })
    //         success('CHECK_YOUR_EMAIL')
    //     } catch (e: any) {
    //         console.log(e.message)
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    return (
        <></>
        // <Form onSubmit={handleSubmit(onSubmit)}>
        //     <LogoWrapper>
        //         <Logo size={180} />
        //     </LogoWrapper>
        //     <Stack direction="column" spacing={2}>
        //         <TextField
        //             variant="outlined"
        //             label={t("auth:EMAIL")}
        //             type="text"
        //             {...register('email')}
        //             error={typeof errors.email === 'undefined' ? false : true}
        //             helperText={errors.email?.message && t(`notify:${errors.email.message || ''}`)}
        //         />
        //         <LoadingButton
        //             onClick={handleSubmit(onSubmit)}
        //             loading={loading}
        //             variant="contained"
        //             type="submit"
        //         >
        //             {t("auth:CONFIRM")}
        //         </LoadingButton>
        //     </Stack>
        //     <Link passHref href="/login">
        //         <LoadingButton
        //             color="success"
        //             style={{ margin: 'auto 0' }}
        //             variant="contained"
        //         >
        //             {t("auth:SIGN_IN")}
        //         </LoadingButton>
        //     </Link>
        // </Form>
    );
};

export default ResetPasswordPage;
