import Link from 'next/link';
import slugify from "slugify"
import { trpc } from "@/utils/trpc.utils"

export const BlogPostGrid = (posts?: any) => (
    <div className="flex w-full flex-col gap-3">
        {posts?.data.map((post: any) => (
            <Link href={`/blog/${slugify(post.attributes.title, { lower: true, strict: true })}-${post.id}`} key={post.id} className="flex flex-row w-full gap-3">
                <h2>{post.attributes.title}</h2>
            </Link>
        ))}
    </div>
)

const BlogPage = () => {
    const { data: posts } = trpc.post.getAll.useQuery({ take: 100000 })

    return BlogPostGrid(posts);
}

export default BlogPage;
