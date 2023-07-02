import { useRouter } from "next/router"
import { trpc } from "@/utils/trpc.utils"
import { DialogShowProductDetails } from "@/containers/consumed/BoxMeal/DialogAddProducts/BoxAddProduct/DialogShowProduct/DialogShowProductDetails"

const ProductSlug = () => {
    const router = useRouter()
    const slug = router.query.productSlug as string
    const productId = slug.substring(slug.lastIndexOf('-') + 1, slug.length)

    const { data: product } = trpc.product.getById.useQuery({ id: parseInt(productId) })

    return <DialogShowProductDetails product={product} />
}

export default ProductSlug
