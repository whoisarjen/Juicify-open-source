import ReactMarkdown from 'react-markdown'
import { trpc } from '@/utils/trpc.utils'
import Image from 'next/image'
import { useRouter } from 'next/router'
import SidebarRight from 'src/layout/SidebarRight'

const PostPage = () => {
    const router = useRouter()
    const slug = router.query.slug as string
    const postId = slug.substring(0, slug.indexOf('--'))
    const { data } = trpc.post.getById.useQuery({ id: Number(postId) })

    if (!data) {
        return null
    }

    return (
        <div className="flex flex-1 flex-col gap-8">
            <Image src="/images/logo_big.png" alt="Juicify" width={545} height={545} className="mx-auto" />
            <div className="flex gap-8 flex-row">
                <div className="flex flex-1 flex-col gap-3 prose dark:prose-invert">
                    <h1>{data.title}</h1>
                    <ReactMarkdown>{data.content.replaceAll('. ', '.\n ').replaceAll(' #', ' \n#')}</ReactMarkdown>
                </div>
                <div className="flex">
                    <SidebarRight />
                </div>
            </div>
        </div>
    )
}

export default PostPage
