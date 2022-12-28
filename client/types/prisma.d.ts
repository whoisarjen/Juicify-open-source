import type { WorkoutPlan, WorkoutResult, Exercise } from "@prisma/client"

import type { WorkoutPlanSchema, WorkoutPlanExerciseSchema } from 'server/schema/workoutPlan.schema'
import type { ResultSchema, WorkoutResultExerciseSchema, WorkoutResultSchema } from 'server/schema/workoutResult.schema'

declare global {
    export type WorkoutPlanExercise = WorkoutPlanExerciseSchema

    export type WorkoutPlanWithExercises <T = WorkoutPlan> = WorkoutPlanSchema & T

    export type Result = ResultSchema

    export type WorkoutResultExercise = WorkoutResultExerciseSchema

    export type WorkoutResultWithExercises <T = WorkoutResult> = WorkoutResultSchema & T
}