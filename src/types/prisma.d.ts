import type {
    User as UserPrisma,
    Exercise as ExercisePrisma,
    WorkoutPlan as WorkoutPlanPrisma,
    WorkoutResult as WorkoutResultPrisma,
    Product as ProductPrisma,
    Consumed as ConsumedPrisma,
    Measurement as MeasurementPrisma,
} from "@prisma/client"

import type { WorkoutPlanSchema, WorkoutPlanExerciseSchema } from '@/server/schema/workoutPlan.schema'
import type { WorkoutResultExerciseResultSchema, WorkoutResultExerciseSchema, WorkoutResultSchema } from '@/server/schema/workoutResult.schema'

declare global {
    export type User<T = UserPrisma> = T
    export type Exercise<T = ExercisePrisma> = ExerciseSchema & T

    export type WorkoutPlanExercise = WorkoutPlanExerciseSchema
    export type WorkoutPlan<T = WorkoutPlanPrisma> = WorkoutPlanSchema & T

    export type WorkoutResultExerciseResult = WorkoutResultExerciseResultSchema
    export type WorkoutResultExercise = WorkoutResultExerciseSchema
    export type WorkoutResult<T = WorkoutResultPrisma> = (WorkoutResultSchema & T)

    export type Product<T = ProductPrisma> = T

    export type Consumed<T = ConsumedPrisma> = T & { product: Product }

    export type Measurement<T = MeasurementPrisma> = T

    type ObjectKeys<T> =
        T extends object ? (keyof T)[] :
        T extends number ? [] :
        T extends Array<any> | string ? string[] :
        never;
    
    interface ObjectConstructor {
        keys<T>(o: T): ObjectKeys<T>
    }
}
