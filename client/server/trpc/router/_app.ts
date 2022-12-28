import { router } from "../trpc";
import { exerciseRouter } from "./exercise";
import { workoutPlanRouter } from "./workoutPlan";
import { workoutResultRouter } from "./workoutResult"

export const appRouter = router({
    exercise: exerciseRouter,
    workoutPlan: workoutPlanRouter,
    workoutResult: workoutResultRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
