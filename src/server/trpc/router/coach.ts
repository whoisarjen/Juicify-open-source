import moment from "moment";
import { pick, omit } from 'lodash'

import { router, protectedProcedure } from "../trpc";
import { createCoachSchema } from "../../schema/coach.schema";
import { GOALS, ACTIVITY_LEVELS, getMacronutrients, updateMacronutrientsInUser } from "@/utils/coach.utils";
import { z } from 'zod'
import { type PrismaClient } from "@prisma/client";
import { getCalories, sumMacroFromConsumed } from "@/utils/consumed.utils";

const NUMBER_OF_DAYS_BETWEEN_COACHES = 7

const getLastCoachByUserId = async (prisma: PrismaClient, userId: number) =>
    await prisma.coach.findFirstOrThrow({
        where: {
            userId,
        },
        orderBy: {
            id: 'asc',
        },
    })

export const coachRouter = router({
    getLastByUserId: protectedProcedure
        .input(
            z.object({
                userId: z.number(),
            })
        )
        .query(async ({ ctx, input: { userId } }) => {
            return await getLastCoachByUserId(ctx.prisma, userId)
        }),
    create: protectedProcedure
        .input(createCoachSchema)
        .mutation(async ({ ctx, input }) => {
            const { activityLevel, isSportActive, kindOfDiet, goal, data: { weight } } = input
            const { id, sex, height, birth } = ctx.session.user

            const age = moment().diff(birth, 'years')

            const BMR = sex
                ? 9.99 * weight + 6.25 * height - 4.92 * age + 5
                : 9.99 * weight + 6.25 * height - 4.92 * age - 161

            const calories = Math.round(BMR * ACTIVITY_LEVELS[activityLevel] + (GOALS[goal] / 100 * weight) * 7800 / 30)

            const { proteins, carbs, fats } = getMacronutrients({
                age,
                weight,
                calories,
                kindOfDiet,
                isExtraProteins: isSportActive,
            })

            await ctx.prisma.user.update({
                data: {
                    ...omit(input, ['data']),
                    ...updateMacronutrientsInUser(proteins, carbs, fats),
                    isCoachAnalyze: true,
                    nextCoach: moment().add(NUMBER_OF_DAYS_BETWEEN_COACHES + 1, 'days').toDate(),
                },
                where: {
                    id,
                }
            })

            await ctx.prisma.coach.create({
                data: {
                    ...input,
                    countedProteins: proteins,
                    countedCarbs: carbs,
                    countedFats: fats,
                    countedCalories: calories,
                    data: pick({
                        ...input.data,
                        BMR,
                    }, ['id', 'weight']),
                    userId: id,
                    currentWeight: weight,
                    changeInWeight: 0,
                }
            })

            return { proteins, carbs, fats }
        }),
    analyze: protectedProcedure
        .input(
            z.object({
                isDataInJuicify: z.boolean(),
            })
        )
        .mutation(async ({ ctx, input: { isDataInJuicify } }) => {
            const { id, birth, activityLevel, goal, isSportActive, kindOfDiet } = ctx.session.user
            const previousCoach = await getLastCoachByUserId(ctx.prisma, id)

            const age = moment().diff(birth, 'years')

            const findManyQuery = {
                where: {
                    userId: id,
                    whenAdded: {
                        gte: moment().add(-NUMBER_OF_DAYS_BETWEEN_COACHES, 'days').startOf('day').toDate(),
                        lte: moment().endOf('day').toDate(),
                    },
                }
            }

            const averageDailyConsumedCalories = isDataInJuicify
                ? (getCalories(
                    sumMacroFromConsumed(
                        await ctx.prisma.consumed.findMany({
                            ...findManyQuery,
                            include: {
                                product: true,
                            },
                        })
                    )
                ) - await (await ctx.prisma.workoutResult.findMany(findManyQuery)).reduce((previous, workoutResult) => previous + workoutResult.burnedCalories, 0)) / NUMBER_OF_DAYS_BETWEEN_COACHES
                : getCalories({
                    proteins: previousCoach.countedProteins,
                    carbs: previousCoach.countedCarbs,
                    fats: previousCoach.countedFats,
                })

            const measurements = await ctx.prisma.measurement.findMany(findManyQuery)

            const averageWeight = measurements.length
                ? measurements.reduce((previous, current) => previous + Number(current.weight), 0) / measurements.length
                : Number(previousCoach.currentWeight)

            const changeInWeight = averageWeight - Number(previousCoach.currentWeight)

            const BMR = averageDailyConsumedCalories - (changeInWeight * 7800 / 7)

            const calories = Math.round(BMR + (GOALS[goal] / 100 * averageWeight) * 7800 / 30)

            const { proteins, carbs, fats } = getMacronutrients({
                age,
                weight: averageWeight,
                calories,
                kindOfDiet,
                isExtraProteins: isSportActive,
            })

            await ctx.prisma.user.update({
                data: {
                    ...updateMacronutrientsInUser(proteins, carbs, fats),
                    isCoachAnalyze: true,
                    nextCoach: moment().add(8, 'days').toDate(),
                },
                where: {
                    id,
                }
            })

            await ctx.prisma.coach.create({
                data: {
                    countedProteins: proteins,
                    countedCarbs: carbs,
                    countedFats: fats,
                    countedCalories: calories,
                    data: {
                        averageWeight,
                        changeInWeight,
                        BMR,
                        averageDailyConsumedCalories,
                    },
                    userId: id,
                    currentWeight: averageWeight,
                    changeInWeight,
                    isDataInJuicify,
                }
            })

            return { proteins, carbs, fats }
        })
});
