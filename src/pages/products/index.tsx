import Link from 'next/link';
import slugify from "slugify"
import { trpc } from "@/utils/trpc.utils"

export const ProductsGrid = (products?: Product[]) => {
    return (
        <div className="flex w-full flex-col gap-3">
            {products?.map(product => (
                <Link
                    key={product.id}
                    className="flex flex-row w-full gap-3"
                    href={`/products/${slugify(product.name, { lower: true, strict: true })}-${product.id}`}
                >
                    <h2>{product.name}</h2>
                </Link>
            ))}
        </div>
    )
}

const Products = () => {
    const { data: products } = trpc.product.getAll.useQuery({ name: '', take: 1000 })

    return ProductsGrid(products);
}

export default Products
