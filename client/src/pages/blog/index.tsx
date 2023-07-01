// @ts-nocheck
import Image from "next/image";
import Link from 'next/link';
import slugify from "slugify"
import { env } from '@/env/client.mjs'

export const BlogPostGridElement = (post: any) => (
    <Link href={`/blog/${slugify(post.attributes.title, { lower: true, strict: true })}-${post.id}`} key={post.id} className="flex flex-row w-full gap-3">
        <Image
            width="192"
            height="108"
            src={`${post.attributes.thumbnail.data
                ? `${env.NEXT_PUBLIC_STRAPI_URL}${post.attributes.thumbnail.data?.attributes.formats.large.url}`
                : '/images/logo.png'
            }`}
            alt={post.attributes.title}
        />
        <div className="flex flex-1 items-center">
            <h2>{post.attributes.title}</h2>
        </div>
    </Link>
)

const BlogPage = () => {
    const { data: posts } = trpc.post.getAll.useQuery({ take: 100000 })

    return (
        <div className="flex w-full flex-col">
            {posts?.data.map(BlogPostGridElement)}
        </div>
    );
}

export default BlogPage;
