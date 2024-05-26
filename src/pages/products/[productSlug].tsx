import { useRouter } from "next/router"
import { trpc } from "@/utils/trpc.utils"
import { DialogShowProductDetails } from "@/containers/consumed/BoxMeal/DialogAddProducts/BoxAddProduct/DialogShowProduct/DialogShowProductDetails"
import { ProductsGrid } from "."

const ProductSlug = () => {
    const router = useRouter()
    const slug = router.query.productSlug as string
    const productId = slug.substring(slug.lastIndexOf('-') + 1, slug.length)

    const { data: product } = trpc.product.getById.useQuery({ id: parseInt(productId) })
    const { data: products } = trpc.product.getAll.useQuery({ name: slug.substring(0, slug.indexOf('-')) || '', take: 5 })

    return (
        <div className="flex flex-col gap-3">
            <div>
                
            </div>
            <DialogShowProductDetails product={product} />
            <div>
                {ProductsGrid(products)}
            </div>
        </div>
    )
}

export default ProductSlug
