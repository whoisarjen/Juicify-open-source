import { GOALS, ACTIVITY_LEVELS, getMacronutrients, updateMacronutrientsInUser } from "@/utils/coach.utils";
import moment from "moment";
import { createCoachSchema } from "../../schema/coach.schema";
import { router, protectedProcedure } from "../trpc";
import { pick } from 'lodash'

export const coachRouter = router({
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
                    ...updateMacronutrientsInUser(proteins, carbs, fats),
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
                    data: pick(input.data, ['id', 'weight']),
                    userId: id,
                }
            })

            return { proteins, carbs, fats }
        })
});
