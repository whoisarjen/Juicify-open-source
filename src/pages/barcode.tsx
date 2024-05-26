import Quagga from '@ericblade/quagga2'
import { useState, useEffect } from 'react'
import { trpc } from '@/utils/trpc.utils'
import DialogShowProduct from '@/containers/consumed/BoxMeal/DialogAddProducts/BoxAddProduct/DialogShowProduct/DialogShowProduct'
import DialogCreateProduct from '@/containers/DialogCreateProduct/DialogCreateProduct'

const BarcodeScannerPage = () => {
    const [barcode, setBarcode] = useState('')
    const [isDialogShowProduct, setIsDialogShowProduct] = useState(false)
    const [isDialogCreateProduct, setIsDialogCreateProduct] = useState(false)

    const { data: product, refetch } = trpc.product.getByBarcode.useQuery(
        { barcode },
        {
            enabled: !!barcode,
            onSuccess() {
                setIsDialogShowProduct(true)
            },
            onError() {
                setIsDialogCreateProduct(true)
            },
        }
    )

    const handleRefetch = () => {
        setIsDialogShowProduct(false)
        setIsDialogCreateProduct(false)
        refetch()
    }

    useEffect(() => {
        Quagga.init(
            {
                inputStream: {
                    type: 'LiveStream',
                    target:
                        document.querySelector('#scanner-container') ||
                        undefined,
                    constraints: {
                        facingMode: 'environment', // or user
                    },
                },
                numOfWorkers: navigator.hardwareConcurrency,
                locate: true,
                frequency: 1,
                locator: {
                    halfSample: false,
                    patchSize: 'large', // x-small, small, medium, large, x-large
                    debug: {
                        showCanvas: false,
                        showPatches: false,
                        showFoundPatches: false,
                        showSkeleton: false,
                        showLabels: false,
                        showPatchLabels: false,
                        showRemainingPatchLabels: false,
                        boxFromPatches: {
                            showTransformed: false,
                            showTransformedBox: false,
                            showBB: false,
                        },
                    },
                },
                decoder: {
                    readers: [
                        'code_128_reader',
                        'ean_reader',
                        'ean_8_reader',
                        'code_39_reader',
                        'code_39_vin_reader',
                        'codabar_reader',
                        'upc_reader',
                        'upc_e_reader',
                        'i2of5_reader',
                        'i2of5_reader',
                        '2of5_reader',
                        'code_93_reader',
                    ],
                },
            },
            (err: any) => {
                Quagga.start()
            }
        )
        Quagga.onDetected((res: any) =>
            setBarcode(res?.codeResult?.code?.toString() || '')
        )
        Quagga.onProcessed((result: any) => {
            let drawingCtx = Quagga.canvas.ctx.overlay,
                drawingCanvas = Quagga.canvas.dom.overlay

            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(
                        0,
                        0,
                        Number(drawingCanvas.getAttribute('width')),
                        Number(drawingCanvas.getAttribute('height'))
                    )
                    result.boxes
                        .filter((box: any) => box !== result.box)
                        .forEach((box: any) => {
                            Quagga.ImageDebug.drawPath(
                                box,
                                { x: 0, y: 1 },
                                drawingCtx,
                                {
                                    color: 'green',
                                    lineWidth: 2,
                                }
                            )
                        })
                }

                if (result.box) {
                    Quagga.ImageDebug.drawPath(
                        result.box,
                        { x: 0, y: 1 },
                        drawingCtx,
                        { color: '#00F', lineWidth: 2 }
                    )
                }

                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(
                        result.line,
                        { x: 'x', y: 'y' },
                        drawingCtx,
                        { color: 'red', lineWidth: 3 }
                    )
                }
            }
        })

        return () => {
            Quagga.stop()
        }
    }, [])

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex h-full w-full flex-col items-center justify-center">
                <div id="scanner-container" className="flex-1" />
                <div className="min-h-8 text-center">Scan barcode code</div>
            </div>
            {isDialogShowProduct && product && (
                <DialogShowProduct
                    defaultState={isDialogShowProduct}
                    onClose={() => setIsDialogShowProduct(false)}
                    product={product}
                />
            )}
            {isDialogCreateProduct && barcode && (
                <DialogCreateProduct
                    defaultState={isDialogCreateProduct}
                    created={(_: string) => handleRefetch()}
                    barcode={barcode}
                />
            )}
        </div>
    )
}

export default BarcodeScannerPage
