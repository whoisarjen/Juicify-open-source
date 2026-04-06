import FullPageError from '@/components/FullPageError'
import type { GetServerSideProps } from 'next'

const Error401 = () => {
    return <FullPageError code={401} message="You need to sign in to access this page" />
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    res.statusCode = 401
    return { props: {} }
}

export default Error401
