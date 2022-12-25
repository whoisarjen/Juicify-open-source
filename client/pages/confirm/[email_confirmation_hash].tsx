import { useConfirmUserMutation } from "@/generated/graphql";
import { useNotify } from "@/hooks/useNotify";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ConfirmPasswordPage = () => {
    const router: any = useRouter()
    const { success } = useNotify()
    const [, confirmUser] = useConfirmUserMutation()

    useEffect(() => {
        (async () => {
            if (router.query.email_confirmation_hash) {
                await confirmUser({
                    confirmEmailHash: router.query.email_confirmation_hash,
                })
                    .then(() => {
                        success()
                        router.push('/login')
                    })
            }
        })()
    }, [router.query.email_confirmation_hash])

    return <></>
};

export default ConfirmPasswordPage;
