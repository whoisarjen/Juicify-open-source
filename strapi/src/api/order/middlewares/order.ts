/**
 * `order` middleware
 */

import { Strapi } from "@strapi/strapi";
import { omit } from 'lodash'

import Zod from 'zod'

export const orderSchema = Zod.object({
    email: Zod.string().email({ message: 'Niepoprawny adres email!' }),
    name: Zod.string().min(3, {
        message: 'Imię musi mieć conajmniej 3 litery',
    }),
    surname: Zod.string().min(3, {
        message: 'Nazwisko musi mieć conajmniej 3 litery',
    }),
    country: Zod.string().min(3).default('Polska'),
    postcode: Zod.string()
        .min(1, { message: 'Kod musi mieć conajmniej 1 literę' })
        .max(32, { message: 'Kod musi mieć maksymalnie 32 litery' }),
    town: Zod.string().min(3, {
        message: 'Miasto musi mieć conajmniej 3 litery',
    }),
    address: Zod.string().min(3, {
        message: 'Adres musi mieć conajmniej 3 litery',
    }),
    house: Zod.string().min(1, {
        message: 'Budynek musi mieć conajmniej 1 literę',
    }),
    phone: Zod.number()
        .refine((val) => val.toString().length === 9 && /^\d+$/.test(val.toString()), {
            message: 'Podaj poprawny numer telefonu! (bez numeru kierunkowego)',
        })
        .transform((val) => Number(val)),
    products: Zod.array(Zod.object({
        id: Zod.number().positive(),
        quantity: Zod.number().positive(),
    }), { required_error: "Nie dodałeś żadnych produktów!" }).nonempty({ message: "Nie dodałeś żadnych produktów!" }),
    providerOptionId: Zod.number({ required_error: "Wybierz opcję dostawy!" }).positive(),
    paymentId: Zod.number({ required_error: "Wybierz opcję płatności!" }).positive(),


    // AFTER UPDATING, UPDATE order.schama.ts. SCHEMAS MIGHT BE A BIG DIFFERENT BETWEEN EACH OTHER!


})

export default (config, { strapi }: { strapi: Strapi }) => {
    return async (ctx, next) => {
        if (ctx.request.method === 'POST' && ctx.request.url === '/api/orders') {
            const { body: { data }, params } = ctx.request

            const safeParse: any = await orderSchema.safeParseAsync(data)

            if (!safeParse.success) {
                return ctx.badRequest(safeParse.error)
            }

            const productService = strapi.service('api::product.product')
            const orderProductsService = strapi.service('api::order-product.order-product')
            const providerOptionService = strapi.service('api::provider-option.provider-option')

            const products = await Promise.all(data.products.map(({ id }) => productService.findOne(id, params)))
            const providerOption = await providerOptionService.findOne(data.providerOptionId, params)

            if (products.some(product => !product)) {
                return ctx.badRequest("At least one product is not correct!")
            }

            if (!providerOption) {
                return ctx.badRequest("Provider option is not correct!")
            }

            const orderProducts = await Promise.all(products.map((product, index) =>
                orderProductsService.create({
                    data: {
                        ...omit(product, ['created_at', 'published_at', 'id']),
                        ...omit(data.products[index], ['id']),
                        product: product.id,
                        // TODO K gross_price and net_price should be counted with promotion
                    }
                })
            ))

            ctx.request.body.data.provider_option = providerOption.id
            ctx.request.body.data.order_products = orderProducts.map(({ id }) => id)
        }
        await next();
    };
};
