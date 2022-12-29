import type {
    Exercise as ExercisePrisma,
    WorkoutPlan as WorkoutPlanPrisma,
    WorkoutResult as WorkoutResultPrisma,
    Product as ProductPrisma,
} from "@prisma/client"

import type { WorkoutPlanSchema, WorkoutPlanExerciseSchema } from 'server/schema/workoutPlan.schema'
import type { WorkoutResultExerciseResultSchema, WorkoutResultExerciseSchema, WorkoutResultSchema } from 'server/schema/workoutResult.schema'

declare global {
    export type Exercise <T = ExercisePrisma> = ExerciseSchema & T

    export type WorkoutPlanExercise = WorkoutPlanExerciseSchema
    export type WorkoutPlan <T = WorkoutPlanPrisma> = WorkoutPlanSchema & T

    export type WorkoutResultExerciseResult = WorkoutResultExerciseResultSchema
    export type WorkoutResultExercise = WorkoutResultExerciseSchema
    export type WorkoutResult <T = WorkoutResultPrisma> = WorkoutResultSchema & T

    export type Product <T = ProductPrisma> = T
}