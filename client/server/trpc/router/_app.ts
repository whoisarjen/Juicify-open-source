import { router } from "../trpc";
import { workoutPlanRouter } from "./workoutPlan";
import { exerciseRouter } from "./exercise";

export const appRouter = router({
    workoutPlan: workoutPlanRouter,
    exercise: exerciseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
