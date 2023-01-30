import { router } from "../trpc";
import { userRouter } from "./user";
import { coachRouter } from "./coach";
import { exerciseRouter } from "./exercise";
import { productRouter } from "./product";
import { consumedRouter } from "./consumed"
import { workoutPlanRouter } from "./workoutPlan";
import { workoutResultRouter } from "./workoutResult"
import { measurementRouter } from "./measurement"
import { burnedCaloriesRouter } from "./burnedCalories";

export const appRouter = router({
    user: userRouter,
    coach: coachRouter,
    exercise: exerciseRouter,
    workoutPlan: workoutPlanRouter,
    workoutResult: workoutResultRouter,
    product: productRouter,
    consumed: consumedRouter,
    measurement: measurementRouter,
    burnedCalories: burnedCaloriesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
