
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.14.0
 * Query Engine version: e9771e62de70f79a5e1c604a2d7c8e2a0a874b48
 */
Prisma.prismaVersion = {
  client: "5.14.0",
  engine: "e9771e62de70f79a5e1c604a2d7c8e2a0a874b48"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  userId: 'userId',
  type: 'type',
  provider: 'provider',
  providerAccountId: 'providerAccountId',
  refresh_token: 'refresh_token',
  access_token: 'access_token',
  expires_at: 'expires_at',
  token_type: 'token_type',
  scope: 'scope',
  id_token: 'id_token',
  session_state: 'session_state'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  sessionToken: 'sessionToken',
  userId: 'userId',
  expires: 'expires'
};

exports.Prisma.PermissionScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  name: 'name',
  description: 'description'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  username: 'username',
  name: 'name',
  surname: 'surname',
  email: 'email',
  emailVerified: 'emailVerified',
  image: 'image',
  locale: 'locale',
  numberOfMeals: 'numberOfMeals',
  proteinsDay0: 'proteinsDay0',
  carbsDay0: 'carbsDay0',
  fatsDay0: 'fatsDay0',
  proteinsDay1: 'proteinsDay1',
  carbsDay1: 'carbsDay1',
  fatsDay1: 'fatsDay1',
  proteinsDay2: 'proteinsDay2',
  carbsDay2: 'carbsDay2',
  fatsDay2: 'fatsDay2',
  proteinsDay3: 'proteinsDay3',
  carbsDay3: 'carbsDay3',
  fatsDay3: 'fatsDay3',
  proteinsDay4: 'proteinsDay4',
  carbsDay4: 'carbsDay4',
  fatsDay4: 'fatsDay4',
  proteinsDay5: 'proteinsDay5',
  carbsDay5: 'carbsDay5',
  fatsDay5: 'fatsDay5',
  proteinsDay6: 'proteinsDay6',
  carbsDay6: 'carbsDay6',
  fatsDay6: 'fatsDay6',
  fiber: 'fiber',
  carbsPercentAsSugar: 'carbsPercentAsSugar',
  nextCoach: 'nextCoach',
  isCoachAnalyze: 'isCoachAnalyze',
  height: 'height',
  birth: 'birth',
  description: 'description',
  website: 'website',
  facebook: 'facebook',
  instagram: 'instagram',
  twitter: 'twitter',
  goal: 'goal',
  kindOfDiet: 'kindOfDiet',
  isSportActive: 'isSportActive',
  activityLevel: 'activityLevel',
  sex: 'sex',
  isBanned: 'isBanned'
};

exports.Prisma.VerificationTokenScalarFieldEnum = {
  identifier: 'identifier',
  token: 'token',
  expires: 'expires'
};

exports.Prisma.ExerciseScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId',
  name: 'name',
  nameLength: 'nameLength',
  isDeleted: 'isDeleted'
};

exports.Prisma.WorkoutPlanScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId',
  name: 'name',
  description: 'description',
  burnedCalories: 'burnedCalories',
  isDeleted: 'isDeleted',
  exercises: 'exercises'
};

exports.Prisma.WorkoutResultScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId',
  name: 'name',
  note: 'note',
  burnedCalories: 'burnedCalories',
  exercises: 'exercises',
  workoutPlanId: 'workoutPlanId',
  whenAdded: 'whenAdded'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId',
  name: 'name',
  nameLength: 'nameLength',
  proteins: 'proteins',
  carbs: 'carbs',
  sugar: 'sugar',
  fats: 'fats',
  fiber: 'fiber',
  sodium: 'sodium',
  ethanol: 'ethanol',
  barcode: 'barcode',
  isVerified: 'isVerified',
  isDeleted: 'isDeleted',
  isExpectingCheck: 'isExpectingCheck'
};

exports.Prisma.ConsumedScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId',
  whenAdded: 'whenAdded',
  productId: 'productId',
  howMany: 'howMany',
  meal: 'meal'
};

exports.Prisma.MeasurementScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  whenAdded: 'whenAdded',
  weight: 'weight',
  userId: 'userId'
};

exports.Prisma.CoachScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId',
  goal: 'goal',
  kindOfDiet: 'kindOfDiet',
  isSportActive: 'isSportActive',
  activityLevel: 'activityLevel',
  countedProteins: 'countedProteins',
  countedCarbs: 'countedCarbs',
  countedFats: 'countedFats',
  countedCalories: 'countedCalories',
  currentWeight: 'currentWeight',
  changeInWeight: 'changeInWeight',
  isDataInJuicify: 'isDataInJuicify',
  data: 'data'
};

exports.Prisma.BurnedCaloriesScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  whenAdded: 'whenAdded',
  userId: 'userId',
  name: 'name',
  burnedCalories: 'burnedCalories'
};

exports.Prisma.PostScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  whenAdded: 'whenAdded',
  userId: 'userId',
  title: 'title',
  content: 'content',
  img_url: 'img_url'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.goals = exports.$Enums.goals = {
  MINUS_ONE_AND_HALF: 'MINUS_ONE_AND_HALF',
  MINUS_ONE_AND_QUARTER: 'MINUS_ONE_AND_QUARTER',
  MINUS_ONE: 'MINUS_ONE',
  MINUS_THREE_QUARTERS: 'MINUS_THREE_QUARTERS',
  MINUS_HALF: 'MINUS_HALF',
  ZERO: 'ZERO',
  HALF: 'HALF',
  THREE_QUARTERS: 'THREE_QUARTERS',
  ONE: 'ONE',
  ONE_AND_QUARTER: 'ONE_AND_QUARTER',
  ONE_AND_HALF: 'ONE_AND_HALF'
};

exports.kindOfDiets = exports.$Enums.kindOfDiets = {
  REGULAR: 'REGULAR',
  KETOGENIC: 'KETOGENIC'
};

exports.activityLevels = exports.$Enums.activityLevels = {
  ZERO: 'ZERO',
  MINIMAL: 'MINIMAL',
  AVERAGE: 'AVERAGE',
  HIGH: 'HIGH',
  EXTREME: 'EXTREME'
};

exports.Prisma.ModelName = {
  Account: 'Account',
  Session: 'Session',
  Permission: 'Permission',
  User: 'User',
  VerificationToken: 'VerificationToken',
  Exercise: 'Exercise',
  WorkoutPlan: 'WorkoutPlan',
  WorkoutResult: 'WorkoutResult',
  Product: 'Product',
  Consumed: 'Consumed',
  Measurement: 'Measurement',
  Coach: 'Coach',
  BurnedCalories: 'BurnedCalories',
  Post: 'Post'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
