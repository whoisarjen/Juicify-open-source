import { z, type ZodTypeAny } from 'zod'

const commaToPoint = (val: unknown) =>
    typeof val === 'string' ? val.replace(',', '.') : val

/** Wraps a numeric Zod schema to accept comma as decimal separator */
export const decimal = <T extends ZodTypeAny>(schema: T) =>
    z.preprocess(commaToPoint, schema)
