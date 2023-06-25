import Image from "next/image";
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { trpc } from "@/utils/trpc.utils";
import slugify from "slugify"

const BlogPage = () => {
    const { t } = useTranslation('blog')
    const { data = [] } = trpc.post.getAll.useQuery({ take: 10 })

    return (
        <div className="flex w-full flex-col">
            <h1>{t('LATEST_NEWS')}</h1>
            {!data.length && t('POSTS_COMMING_SOON')}
            {data.map(post =>
                <Link href={`/blog/${post.id}--${slugify(post.title)}`} key={post.id} className="flex flex-row w-full gap-3">
                    <Image src="/images/logo_big.png" width="192" height="108" alt={post.img_url} />
                    <div className="flex flex-1 items-center">
                        <h2>{post.title}</h2>
                    </div>
                </Link>
            )}
        </div>
    );
}

export default BlogPage;
