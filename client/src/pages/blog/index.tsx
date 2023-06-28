// @ts-nocheck
import Image from "next/image";
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import slugify from "slugify"
import { env } from '@/env/client.mjs'
import { useState, useEffect } from "react";

const BlogPage = () => {
    const { t } = useTranslation('blog')
    const [posts, setPosts] = useState([])

    useEffect(() => {
        (async () => {
            await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/posts?populate=*`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${env.NEXT_PUBLIC_API_TOKEN}`,
                },
            })
                .then(async (res) => await res.json())
                .then(res => setPosts(res.data))
                .catch(() => setPosts([]))
        })()
    }, [])

    return (
        <div className="flex w-full flex-col">
            <h1>{t('LATEST_NEWS')}</h1>
            {!posts.length && t('POSTS_COMMING_SOON')}
            {posts.map(post =>
                <Link href={`/blog/${slugify(post.attributes.title, { lower: true, strict: true })}-${post.id}`} key={post.id} className="flex flex-row w-full gap-3">
                    <Image
                        width="192"
                        height="108"
                        src={`${env.NEXT_PUBLIC_STRAPI_URL}${post.attributes.thumbnail?.data.attributes.formats.large.url}`}
                        alt={post.attributes.title}
                    />
                    <div className="flex flex-1 items-center">
                        <h2>{post.attributes.title}</h2>
                    </div>
                </Link>
            )}
        </div>
    );
}

export default BlogPage;
