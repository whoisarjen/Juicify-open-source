import { type GetServerSidePropsContext } from 'next'
import { getServerAuthSession } from '@/server/common/get-server-auth-session'

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx)

    if (session?.user) {
        return {
            redirect: {
                destination: '/coach',
                permanent: false,
            },
        }
    }

    return { props: {} }
}
