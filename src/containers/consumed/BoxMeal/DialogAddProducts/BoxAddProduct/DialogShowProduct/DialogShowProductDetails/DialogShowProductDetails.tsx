import { omit } from "lodash"
import { type ReactNode } from "react"

interface DialogShowProductDetailsProps {
    product?: Product
}

const PROPERTIES_TO_OMIT = [
    'id',
    'userId',
    'nameLength',
    'isVerified',
    'isDeleted',
    'isExpectingCheck',
    'createdAt',
    'updatedAt',
    'barcode',
]

export const DialogShowProductDetails = ({
    product,
}: DialogShowProductDetailsProps) => {
    if (!product) {
        return null
    }

    return (
        <table style={{ textAlign: 'center' }}>
            <tbody>
                {Object.keys(omit(product, PROPERTIES_TO_OMIT)).map(
                    (key) => (
                        <tr key={key}>
                            <td key={key}>{key}</td>
                            <td>
                                {
                                    product[
                                        key as keyof typeof product
                                    ] as unknown as ReactNode
                                }
                            </td>
                        </tr>
                    )
                )}
            </tbody>
        </table>
    )
}