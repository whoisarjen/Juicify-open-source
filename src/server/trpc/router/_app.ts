import { router } from "../trpc";
import { exerciseRouter } from "./exercise";
import { productRouter } from "./product";
import { consumedRouter } from "./consumed"
import { workoutPlanRouter } from "./workoutPlan";
import { workoutResultRouter } from "./workoutResult"
import { measurementRouter } from "./measurement"

export const appRouter = router({
    exercise: exerciseRouter,
    workoutPlan: workoutPlanRouter,
    workoutResult: workoutResultRouter,
    product: productRouter,
    consumed: consumedRouter,
    measurement: measurementRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;