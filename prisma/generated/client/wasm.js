
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/wasm.js')


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

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

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
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/workspaces/Juicify-t3/prisma/generated/client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "debian-openssl-1.1.x",
        "native": true
      },
      {
        "fromEnvVar": null,
        "value": "linux-musl"
      }
    ],
    "previewFeatures": [
      "driverAdapters"
    ],
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../..",
  "clientVersion": "5.14.0",
  "engineVersion": "e9771e62de70f79a5e1c604a2d7c8e2a0a874b48",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "generator client {\n  provider        = \"prisma-client-js\"\n  binaryTargets   = [\"native\", \"linux-musl\"]\n  previewFeatures = [\"driverAdapters\"]\n  output          = \"./generated/client\" // Vercel fix\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nenum kindOfDiets {\n  REGULAR\n  KETOGENIC\n}\n\nenum activityLevels {\n  ZERO\n  MINIMAL\n  AVERAGE\n  HIGH\n  EXTREME\n}\n\nenum goals {\n  MINUS_ONE_AND_HALF\n  MINUS_ONE_AND_QUARTER\n  MINUS_ONE\n  MINUS_THREE_QUARTERS\n  MINUS_HALF\n  ZERO\n  HALF\n  THREE_QUARTERS\n  ONE\n  ONE_AND_QUARTER\n  ONE_AND_HALF\n}\n\nmodel Account {\n  id                Int      @id @default(autoincrement())\n  createdAt         DateTime @default(now())\n  userId            Int\n  type              String\n  provider          String\n  providerAccountId String\n  refresh_token     String?\n  access_token      String?\n  expires_at        Int?\n  token_type        String?\n  scope             String?\n  id_token          String?\n  session_state     String?\n  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([provider, providerAccountId])\n  @@index([userId])\n}\n\nmodel Session {\n  id           Int      @id @default(autoincrement())\n  createdAt    DateTime @default(now())\n  sessionToken String   @unique\n  userId       Int\n  expires      DateTime\n  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n}\n\nmodel Permission {\n  id          Int      @id @default(autoincrement())\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @default(now()) @updatedAt\n  name        String\n  description String?\n  users       User[]\n}\n\nmodel User {\n  id                  Int              @id @default(autoincrement())\n  createdAt           DateTime         @default(now())\n  updatedAt           DateTime         @default(now()) @updatedAt\n  username            String           @unique @default(uuid())\n  name                String?\n  surname             String?\n  email               String           @unique\n  emailVerified       DateTime?\n  image               String?\n  locale              String           @default(\"en\") @db.Char(2)\n  numberOfMeals       Int              @default(5)\n  proteinsDay0        Int              @default(0)\n  carbsDay0           Int              @default(0)\n  fatsDay0            Int              @default(0)\n  proteinsDay1        Int              @default(0)\n  carbsDay1           Int              @default(0)\n  fatsDay1            Int              @default(0)\n  proteinsDay2        Int              @default(0)\n  carbsDay2           Int              @default(0)\n  fatsDay2            Int              @default(0)\n  proteinsDay3        Int              @default(0)\n  carbsDay3           Int              @default(0)\n  fatsDay3            Int              @default(0)\n  proteinsDay4        Int              @default(0)\n  carbsDay4           Int              @default(0)\n  fatsDay4            Int              @default(0)\n  proteinsDay5        Int              @default(0)\n  carbsDay5           Int              @default(0)\n  fatsDay5            Int              @default(0)\n  proteinsDay6        Int              @default(0)\n  carbsDay6           Int              @default(0)\n  fatsDay6            Int              @default(0)\n  fiber               Int              @default(10)\n  carbsPercentAsSugar Int              @default(10)\n  nextCoach           DateTime         @default(now())\n  isCoachAnalyze      Boolean          @default(false)\n  height              Int              @default(0)\n  birth               DateTime         @default(now())\n  description         String           @default(\"\")\n  website             String           @default(\"\")\n  facebook            String           @default(\"\")\n  instagram           String           @default(\"\")\n  twitter             String           @default(\"\")\n  goal                goals            @default(ZERO)\n  kindOfDiet          kindOfDiets      @default(REGULAR)\n  isSportActive       Boolean          @default(false)\n  activityLevel       activityLevels   @default(AVERAGE)\n  sex                 Boolean          @default(true)\n  isBanned            Boolean          @default(false)\n  permissions         Permission[]\n  accounts            Account[]\n  sessions            Session[]\n  Exercise            Exercise[]\n  WorkoutPlan         WorkoutPlan[]\n  WorkoutResult       WorkoutResult[]\n  Product             Product[]\n  Consumed            Consumed[]\n  Measurement         Measurement[]\n  Coach               Coach[]\n  BurnedCalories      BurnedCalories[]\n  Post                Post[]\n}\n\nmodel VerificationToken {\n  identifier String\n  token      String   @unique\n  expires    DateTime\n\n  @@unique([identifier, token])\n}\n\nmodel Exercise {\n  id         Int      @id @default(autoincrement())\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @default(now()) @updatedAt\n  user       User?    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  userId     Int?\n  name       String   @db.VarChar(100)\n  nameLength Int\n  isDeleted  Boolean  @default(false)\n\n  @@unique([userId, name, isDeleted])\n  @@index([userId])\n}\n\nmodel WorkoutPlan {\n  id             Int             @id @default(autoincrement())\n  createdAt      DateTime        @default(now())\n  updatedAt      DateTime        @default(now()) @updatedAt\n  user           User            @relation(fields: [userId], references: [id], onDelete: Cascade)\n  userId         Int\n  name           String          @db.VarChar(100)\n  description    String?\n  burnedCalories Int             @default(0)\n  isDeleted      Boolean         @default(false)\n  exercises      Json\n  WorkoutResult  WorkoutResult[]\n\n  @@unique([id, userId])\n  @@index([userId])\n}\n\nmodel WorkoutResult {\n  id             Int          @id @default(autoincrement())\n  createdAt      DateTime     @default(now())\n  updatedAt      DateTime     @default(now()) @updatedAt\n  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)\n  userId         Int\n  name           String       @db.VarChar(100)\n  note           String?\n  burnedCalories Int          @default(0)\n  exercises      Json\n  workoutPlan    WorkoutPlan? @relation(fields: [workoutPlanId], references: [id], onDelete: SetNull)\n  workoutPlanId  Int?\n  whenAdded      DateTime     @default(now())\n\n  @@unique([id, userId])\n  @@index([userId])\n  @@index([workoutPlanId])\n}\n\nmodel Product {\n  id               Int        @id @default(autoincrement())\n  createdAt        DateTime   @default(now())\n  updatedAt        DateTime   @default(now()) @updatedAt\n  user             User?      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  userId           Int?\n  name             String     @db.VarChar(255)\n  nameLength       Int\n  proteins         Decimal    @default(0) @db.Decimal(4, 1)\n  carbs            Decimal    @default(0) @db.Decimal(4, 1)\n  sugar            Decimal    @default(0) @db.Decimal(4, 1)\n  fats             Decimal    @default(0) @db.Decimal(4, 1)\n  fiber            Decimal    @default(0) @db.Decimal(4, 1)\n  sodium           Decimal    @default(0) @db.Decimal(4, 1)\n  ethanol          Decimal    @default(0) @db.Decimal(4, 1)\n  barcode          String?\n  isVerified       Boolean?   @default(false)\n  isDeleted        Boolean?   @default(false)\n  isExpectingCheck Boolean?   @default(false)\n  Consumed         Consumed[]\n\n  @@unique([id, userId])\n  @@unique([name, userId])\n  @@index([userId])\n}\n\nmodel Consumed {\n  id        Int      @id @default(autoincrement())\n  createdAt DateTime @default(now())\n  updatedAt DateTime @default(now()) @updatedAt\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  userId    Int\n  whenAdded DateTime @default(now())\n  product   Product  @relation(fields: [productId], references: [id])\n  productId Int\n  howMany   Decimal  @default(1) @db.Decimal(4, 1)\n  meal      Int      @default(0)\n\n  @@unique([id, userId])\n  @@index([userId])\n  @@index([productId])\n}\n\nmodel Measurement {\n  id        Int      @id @default(autoincrement())\n  createdAt DateTime @default(now())\n  updatedAt DateTime @default(now()) @updatedAt\n  whenAdded DateTime @default(now())\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  weight    Decimal  @default(0) @db.Decimal(4, 1)\n  userId    Int\n\n  @@unique([id, userId])\n  @@index([userId])\n}\n\nmodel Coach {\n  id              Int            @id @default(autoincrement())\n  createdAt       DateTime       @default(now())\n  updatedAt       DateTime       @default(now()) @updatedAt\n  user            User           @relation(fields: [userId], references: [id], onDelete: Cascade)\n  userId          Int\n  goal            goals          @default(ZERO)\n  kindOfDiet      kindOfDiets    @default(REGULAR)\n  isSportActive   Boolean        @default(false)\n  activityLevel   activityLevels @default(AVERAGE)\n  countedProteins Int            @default(0)\n  countedCarbs    Int            @default(0)\n  countedFats     Int            @default(0)\n  countedCalories Int            @default(0)\n  currentWeight   Decimal        @db.Decimal(4, 1)\n  changeInWeight  Decimal        @db.Decimal(4, 1)\n  isDataInJuicify Boolean        @default(false)\n  data            Json\n\n  @@index([userId])\n}\n\nmodel BurnedCalories {\n  id             Int      @id @default(autoincrement())\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @default(now()) @updatedAt\n  whenAdded      DateTime @default(now())\n  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  userId         Int\n  name           String   @db.VarChar(255)\n  burnedCalories Int\n\n  @@unique([id, userId])\n  @@index([userId])\n}\n\nmodel Post {\n  id        Int      @id @default(autoincrement())\n  createdAt DateTime @default(now())\n  updatedAt DateTime @default(now()) @updatedAt\n  whenAdded DateTime @default(now())\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  userId    Int\n  title     String   @db.VarChar(255)\n  content   String   @db.Text\n  img_url   String\n\n  @@unique([id, userId])\n  @@index([userId])\n}\n",
  "inlineSchemaHash": "7a1aa815723d07d02368f98a418f28a6349f73deebea414fd4f4d0a23ad8620c",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"Account\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"provider\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"providerAccountId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"refresh_token\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"access_token\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"expires_at\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"token_type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"scope\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"id_token\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"session_state\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AccountToUser\"}],\"dbName\":null},\"Session\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"sessionToken\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"expires\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"SessionToUser\"}],\"dbName\":null},\"Permission\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"users\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"PermissionToUser\"}],\"dbName\":null},\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"username\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"surname\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"emailVerified\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"image\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"locale\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"numberOfMeals\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"proteinsDay0\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"carbsDay0\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"fatsDay0\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"proteinsDay1\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"carbsDay1\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"fatsDay1\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"proteinsDay2\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"carbsDay2\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"fatsDay2\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"proteinsDay3\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"carbsDay3\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"fatsDay3\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"proteinsDay4\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"carbsDay4\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"fatsDay4\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"proteinsDay5\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"carbsDay5\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"fatsDay5\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"proteinsDay6\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"carbsDay6\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"fatsDay6\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"fiber\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"carbsPercentAsSugar\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"nextCoach\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"isCoachAnalyze\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"height\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"birth\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"website\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"facebook\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"instagram\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"twitter\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"goal\",\"kind\":\"enum\",\"type\":\"goals\"},{\"name\":\"kindOfDiet\",\"kind\":\"enum\",\"type\":\"kindOfDiets\"},{\"name\":\"isSportActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"activityLevel\",\"kind\":\"enum\",\"type\":\"activityLevels\"},{\"name\":\"sex\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"isBanned\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"permissions\",\"kind\":\"object\",\"type\":\"Permission\",\"relationName\":\"PermissionToUser\"},{\"name\":\"accounts\",\"kind\":\"object\",\"type\":\"Account\",\"relationName\":\"AccountToUser\"},{\"name\":\"sessions\",\"kind\":\"object\",\"type\":\"Session\",\"relationName\":\"SessionToUser\"},{\"name\":\"Exercise\",\"kind\":\"object\",\"type\":\"Exercise\",\"relationName\":\"ExerciseToUser\"},{\"name\":\"WorkoutPlan\",\"kind\":\"object\",\"type\":\"WorkoutPlan\",\"relationName\":\"UserToWorkoutPlan\"},{\"name\":\"WorkoutResult\",\"kind\":\"object\",\"type\":\"WorkoutResult\",\"relationName\":\"UserToWorkoutResult\"},{\"name\":\"Product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToUser\"},{\"name\":\"Consumed\",\"kind\":\"object\",\"type\":\"Consumed\",\"relationName\":\"ConsumedToUser\"},{\"name\":\"Measurement\",\"kind\":\"object\",\"type\":\"Measurement\",\"relationName\":\"MeasurementToUser\"},{\"name\":\"Coach\",\"kind\":\"object\",\"type\":\"Coach\",\"relationName\":\"CoachToUser\"},{\"name\":\"BurnedCalories\",\"kind\":\"object\",\"type\":\"BurnedCalories\",\"relationName\":\"BurnedCaloriesToUser\"},{\"name\":\"Post\",\"kind\":\"object\",\"type\":\"Post\",\"relationName\":\"PostToUser\"}],\"dbName\":null},\"VerificationToken\":{\"fields\":[{\"name\":\"identifier\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"token\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"expires\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Exercise\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ExerciseToUser\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"nameLength\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"isDeleted\",\"kind\":\"scalar\",\"type\":\"Boolean\"}],\"dbName\":null},\"WorkoutPlan\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserToWorkoutPlan\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"burnedCalories\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"isDeleted\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"exercises\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"WorkoutResult\",\"kind\":\"object\",\"type\":\"WorkoutResult\",\"relationName\":\"WorkoutPlanToWorkoutResult\"}],\"dbName\":null},\"WorkoutResult\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserToWorkoutResult\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"note\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"burnedCalories\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"exercises\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"workoutPlan\",\"kind\":\"object\",\"type\":\"WorkoutPlan\",\"relationName\":\"WorkoutPlanToWorkoutResult\"},{\"name\":\"workoutPlanId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"whenAdded\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Product\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ProductToUser\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"nameLength\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"proteins\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"carbs\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"sugar\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"fats\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"fiber\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"sodium\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"ethanol\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"barcode\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isVerified\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"isDeleted\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"isExpectingCheck\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"Consumed\",\"kind\":\"object\",\"type\":\"Consumed\",\"relationName\":\"ConsumedToProduct\"}],\"dbName\":null},\"Consumed\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ConsumedToUser\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"whenAdded\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ConsumedToProduct\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"howMany\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"meal\",\"kind\":\"scalar\",\"type\":\"Int\"}],\"dbName\":null},\"Measurement\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"whenAdded\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"MeasurementToUser\"},{\"name\":\"weight\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"Int\"}],\"dbName\":null},\"Coach\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"CoachToUser\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"goal\",\"kind\":\"enum\",\"type\":\"goals\"},{\"name\":\"kindOfDiet\",\"kind\":\"enum\",\"type\":\"kindOfDiets\"},{\"name\":\"isSportActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"activityLevel\",\"kind\":\"enum\",\"type\":\"activityLevels\"},{\"name\":\"countedProteins\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"countedCarbs\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"countedFats\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"countedCalories\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"currentWeight\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"changeInWeight\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"isDataInJuicify\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"data\",\"kind\":\"scalar\",\"type\":\"Json\"}],\"dbName\":null},\"BurnedCalories\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"whenAdded\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"BurnedCaloriesToUser\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"burnedCalories\",\"kind\":\"scalar\",\"type\":\"Int\"}],\"dbName\":null},\"Post\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"whenAdded\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"PostToUser\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"img_url\",\"kind\":\"scalar\",\"type\":\"String\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = {
  getRuntime: () => require('./query_engine_bg.js'),
  getQueryEngineWasmModule: async () => {
    return (await import('#wasm-engine-loader')).default
  }
}

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

