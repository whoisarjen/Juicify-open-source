import Image from "next/image";
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';

const BlogPage = () => {
    const { t } = useTranslation('blog')

    const posts: any[] = []

    return (
        <div>
            <h1>{t('LATEST_NEWS')}</h1>
            <div>
                {t('POSTS_COMMING_SOON')}
                {posts.map((post: any) =>
                    <Link href={`/blog/${post.url}`} key={post.url}>
                        <article>
                            <Image src="/images/logo_big.png" width="515" height="290" alt={post.title} />
                            <h3>{post.title}</h3>
                        </article>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default BlogPage;
