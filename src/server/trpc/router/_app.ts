import { router } from "../trpc";
import { userRouter } from "./user";
import { coachRouter } from "./coach";
import { postRouter } from "./post";
import { exerciseRouter } from "./exercise";
import { productRouter } from "./product";
import { consumedRouter } from "./consumed"
import { workoutPlanRouter } from "./workoutPlan";
import { workoutResultRouter } from "./workoutResult"
import { measurementRouter } from "./measurement"
import { burnedCaloriesRouter } from "./burnedCalories";
import { versionRouter } from "./version";

export const appRouter = router({
    user: userRouter,
    coach: coachRouter,
    post: postRouter,
    exercise: exerciseRouter,
    workoutPlan: workoutPlanRouter,
    workoutResult: workoutResultRouter,
    product: productRouter,
    consumed: consumedRouter,
    measurement: measurementRouter,
    burnedCalories: burnedCaloriesRouter,
    version: versionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
