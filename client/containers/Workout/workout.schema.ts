import { object, preprocess, boolean, number, TypeOf, string, array } from "zod"

export const ExerciseResultSchema = object({
    open: preprocess((val) => Boolean(val), boolean()).optional(),
    reps: preprocess((val) => Number(val), number()),
    weight: preprocess((val) => Number(val), number()),
})

export type ExerciseResultSchemaProps = TypeOf<typeof ExerciseResultSchema>

export const ExerciseSchema = object({
    id: string().optional(),
    name: string().optional(),
    results: array(ExerciseResultSchema).optional(),
})

export type ExerciseSchemaProps = TypeOf<typeof ExerciseSchema>

export const WorkoutResultSchema = object({
    id: string(),
    name: string(),
    when: string(),
    note: string().optional().nullable(),
    burnedCalories: preprocess((val) => Number(val), number().min(0).max(5000)),
    exercises: array(ExerciseSchema),
})

export type WorkoutResultSchemaProps = TypeOf<typeof WorkoutResultSchema>

export const WorkoutPlanSchema = object({
    id: string(),
    name: string().max(100).nullable(),
    description: string().max(500).nullable(),
    user: string(),
    burnedCalories: preprocess((val) => Number(val), number().min(0).max(5000)),
    exercises: array(object({
        id: string(),
        name: string(),
    })),
})

export type WorkoutPlanSchemaProps = TypeOf<typeof WorkoutPlanSchema>