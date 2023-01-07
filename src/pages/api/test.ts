import { type NextApiRequest, type NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client'
// import path from 'path';
// import { promises as fs } from 'fs';
// import { uniqBy } from 'lodash'

// const inRange = (number: number, start: number, end: number) => ((number >= start) && (number <= end))

// const products = []
// const productsLength = products.length

// const prisma = new PrismaClient()
// let counter = 0

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // const jsonDirectory = path.join(process.cwd(), '')
    // const exercises = JSON.parse(await fs.readFile(jsonDirectory + '/exercises.json', 'utf8'))

    // await prisma.exercise.deleteMany({
    //     where: {
    //         id: {
    //             gte: 0,
    //         }
    //     }
    // })

    // for await (const exercise of uniqBy(exercises, 'name')) {
    //     await prisma.exercise.create({
    //         data: {
    //             name: exercise.name,
    //             nameLength: exercise.name.length
    //         }
    //     })
    // }

    res.status(200).json({
        message: 'Still alive',
    });
}

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     const jsonDirectory = path.join(process.cwd(), '')
//     const products = JSON.parse(await fs.readFile(jsonDirectory + '/products.json', 'utf8'))

//     await prisma.product.deleteMany({
//         where: {
//             id: {
//                 gte: 0,
//             }
//         }
//     })

//     const toSend = []

//     const productsLength = products.length

//     for await (const product of products) {
//         const proteins = product.p || 0
//         const carbs = product.c || 0
//         const fats = product.f || 0
//         const sugar = product.s || 0
//         const fiber = product.fi || 0
//         const sodium = product.na || 0
//         const ethanol = product.ethanol || 0

//         counter++

//         if (
//             (proteins || carbs || fats) &&
//             inRange(proteins, 0, 999) &&
//             inRange(carbs, 0, 999) &&
//             inRange(sugar, 0, 999) &&
//             inRange(fats, 0, 999) &&
//             inRange(fiber, 0, 999) &&
//             inRange(sodium, 0, 999) &&
//             inRange(ethanol, 0, 999) &&
//             !product.isDeleted &&
//             product.name.length <= 255
//         ) {
//             const data = {
//                 name: product.name,
//                 nameLength: product.name.length,
//                 proteins,
//                 carbs,
//                 sugar,
//                 fats,
//                 fiber,
//                 sodium,
//                 ethanol,
//                 barcode: product.code?.toString() || null,
//                 isVerified: !!product.v,
//                 isDeleted: false,
//                 isExpectingCheck: false,
//             }

//             console.log(productsLength - counter)

//             toSend.push(data)

//             if (toSend.length == 200 || ((counter + 1) >= products.length)) {
//                 await Promise.all(toSend.map(data => prisma.product.create({ data })))
//                 toSend.splice(0, toSend.length)
//             }
//         }
//     }

//     res.status(200).json({
//         message: 'Done',
//     });
// }
