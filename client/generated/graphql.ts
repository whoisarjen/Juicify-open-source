import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  DateTime: any;
  Decimal: any;
  GenericScalar: any;
  JSONString: any;
  UUID: any;
};

/** An enumeration. */
export enum CoachActivityLevel {
  /** 0 */
  A_0 = 'A_0',
  /** 1 */
  A_1 = 'A_1',
  /** 2 */
  A_2 = 'A_2',
  /** 3 */
  A_3 = 'A_3',
  /** 4 */
  A_4 = 'A_4'
}

/** An enumeration. */
export enum CoachGoal {
  /** 0 */
  A_0 = 'A_0',
  /** 0.5 */
  A_0_5 = 'A_0_5',
  /** 0.75 */
  A_0_75 = 'A_0_75',
  /** 1 */
  A_1 = 'A_1',
  /** 1.5 */
  A_1_5 = 'A_1_5',
  /** 1.25 */
  A_1_25 = 'A_1_25',
  /** -0.5 */
  _0_5 = '_0_5',
  /** -0.75 */
  _0_75 = '_0_75',
  /** -1 */
  _1 = '_1',
  /** -1.5 */
  _1_5 = '_1_5',
  /** -1.25 */
  _1_25 = '_1_25'
}

/** An enumeration. */
export enum CoachKindOfDiet {
  /** REGULAR */
  A_0 = 'A_0',
  /** KETOGENIC */
  A_1 = 'A_1'
}

export type CoachType = {
  __typename?: 'CoachType';
  activityLevel: CoachActivityLevel;
  bmr: Scalars['Int'];
  calories: Scalars['Int'];
  countedCarbs: Scalars['Int'];
  countedFats: Scalars['Int'];
  countedProteins: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  data?: Maybe<Scalars['JSONString']>;
  dataCoveragePercentage: Scalars['Int'];
  goal: CoachGoal;
  id: Scalars['UUID'];
  isCoachAnalyze: Scalars['Boolean'];
  isSportActive: Scalars['Boolean'];
  kindOfDiet: CoachKindOfDiet;
  user?: Maybe<UserType>;
  weight: Scalars['Decimal'];
};

export type ConfirmUser = {
  __typename?: 'ConfirmUser';
  user?: Maybe<UserType>;
};

export type ConsumedType = {
  __typename?: 'ConsumedType';
  createdAt: Scalars['DateTime'];
  howMany: Scalars['Decimal'];
  id: Scalars['UUID'];
  meal: Scalars['Int'];
  product: ProductType;
  updatedAt: Scalars['DateTime'];
  user: UserType;
  when: Scalars['Date'];
};

export type CreateCoach = {
  __typename?: 'CreateCoach';
  coach?: Maybe<CoachType>;
};

export type CreateConsumed = {
  __typename?: 'CreateConsumed';
  consumed?: Maybe<ConsumedType>;
};

export type CreateExercise = {
  __typename?: 'CreateExercise';
  exercise?: Maybe<ExerciseType>;
};

export type CreateMeasurement = {
  __typename?: 'CreateMeasurement';
  measurement?: Maybe<MeasurementType>;
};

export type CreateProduct = {
  __typename?: 'CreateProduct';
  product?: Maybe<ProductType>;
};

export type CreateUser = {
  __typename?: 'CreateUser';
  user?: Maybe<UserType>;
};

export type CreateWorkoutPlan = {
  __typename?: 'CreateWorkoutPlan';
  workoutPlan?: Maybe<WorkoutPlanType>;
};

export type CreateWorkoutResult = {
  __typename?: 'CreateWorkoutResult';
  workoutResult?: Maybe<WorkoutResultType>;
};

/** An enumeration. */
export enum CustomUserActivityLevel {
  /** 0 */
  A_0 = 'A_0',
  /** 1 */
  A_1 = 'A_1',
  /** 2 */
  A_2 = 'A_2',
  /** 3 */
  A_3 = 'A_3',
  /** 4 */
  A_4 = 'A_4'
}

/** An enumeration. */
export enum CustomUserGoal {
  /** 0 */
  A_0 = 'A_0',
  /** 0.5 */
  A_0_5 = 'A_0_5',
  /** 0.75 */
  A_0_75 = 'A_0_75',
  /** 1 */
  A_1 = 'A_1',
  /** 1.5 */
  A_1_5 = 'A_1_5',
  /** 1.25 */
  A_1_25 = 'A_1_25',
  /** -0.5 */
  _0_5 = '_0_5',
  /** -0.75 */
  _0_75 = '_0_75',
  /** -1 */
  _1 = '_1',
  /** -1.5 */
  _1_5 = '_1_5',
  /** -1.25 */
  _1_25 = '_1_25'
}

/** An enumeration. */
export enum CustomUserKindOfDiet {
  /** REGULAR */
  A_0 = 'A_0',
  /** KETOGENIC */
  A_1 = 'A_1'
}

export type DeleteConsumed = {
  __typename?: 'DeleteConsumed';
  consumed?: Maybe<ConsumedType>;
};

export type DeleteWorkoutPlan = {
  __typename?: 'DeleteWorkoutPlan';
  workoutPlan?: Maybe<WorkoutPlanType>;
};

export type DeleteWorkoutResult = {
  __typename?: 'DeleteWorkoutResult';
  workoutResult?: Maybe<WorkoutResultType>;
};

export type DeteleExercise = {
  __typename?: 'DeteleExercise';
  Exercise?: Maybe<ExerciseType>;
};

export type DeteleProduct = {
  __typename?: 'DeteleProduct';
  product?: Maybe<ProductType>;
};

export type ExerciseType = {
  __typename?: 'ExerciseType';
  createdAt: Scalars['DateTime'];
  id: Scalars['UUID'];
  isDeleted: Scalars['Boolean'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  user?: Maybe<UserType>;
};

export type MeasurementType = {
  __typename?: 'MeasurementType';
  createdAt: Scalars['DateTime'];
  id: Scalars['UUID'];
  updatedAt: Scalars['DateTime'];
  user: UserType;
  weight: Scalars['Decimal'];
  when: Scalars['Date'];
};

export type Mutation = {
  __typename?: 'Mutation';
  confirmUser?: Maybe<ConfirmUser>;
  createCoach?: Maybe<CreateCoach>;
  createConsumed?: Maybe<CreateConsumed>;
  createExercise?: Maybe<CreateExercise>;
  createMeasurement?: Maybe<CreateMeasurement>;
  createProduct?: Maybe<CreateProduct>;
  createUser?: Maybe<CreateUser>;
  createWorkoutPlan?: Maybe<CreateWorkoutPlan>;
  createWorkoutResult?: Maybe<CreateWorkoutResult>;
  deleteConsumed?: Maybe<DeleteConsumed>;
  deleteExercise?: Maybe<DeteleExercise>;
  deleteProduct?: Maybe<DeteleProduct>;
  deleteWorkoutPlan?: Maybe<DeleteWorkoutPlan>;
  deleteWorkoutResult?: Maybe<DeleteWorkoutResult>;
  refreshToken?: Maybe<Refresh>;
  revokeToken?: Maybe<Revoke>;
  /** Obtain JSON Web Token mutation */
  tokenAuth?: Maybe<ObtainJsonWebToken>;
  updateConsumed?: Maybe<UpdateConsumed>;
  updateMeasurement?: Maybe<UpdateMeasurement>;
  updateUser?: Maybe<UpdateUser>;
  updateWorkoutPlan?: Maybe<UpdateWorkoutPlan>;
  updateWorkoutResult?: Maybe<UpdateWorkoutResult>;
  verifyToken?: Maybe<Verify>;
};


export type MutationConfirmUserArgs = {
  confirmEmailHash: Scalars['UUID'];
};


export type MutationCreateCoachArgs = {
  activityLevel: Scalars['Int'];
  goal: Scalars['Decimal'];
  id: Scalars['UUID'];
  isSportActive: Scalars['Boolean'];
  kindOfDiet: Scalars['Int'];
  user: Scalars['UUID'];
  weight: Scalars['Decimal'];
};


export type MutationCreateConsumedArgs = {
  howMany: Scalars['Decimal'];
  id: Scalars['UUID'];
  meal: Scalars['Int'];
  product: Scalars['UUID'];
  user: Scalars['UUID'];
  when: Scalars['Date'];
};


export type MutationCreateExerciseArgs = {
  id: Scalars['UUID'];
  name: Scalars['String'];
  user: Scalars['UUID'];
};


export type MutationCreateMeasurementArgs = {
  id: Scalars['UUID'];
  user: Scalars['UUID'];
  weight: Scalars['Decimal'];
  when: Scalars['Date'];
};


export type MutationCreateProductArgs = {
  barcode?: InputMaybe<Scalars['Int']>;
  carbs?: InputMaybe<Scalars['Decimal']>;
  ethanol?: InputMaybe<Scalars['Decimal']>;
  fats?: InputMaybe<Scalars['Decimal']>;
  fiber?: InputMaybe<Scalars['Decimal']>;
  id: Scalars['UUID'];
  isExpectingCheck?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  proteins?: InputMaybe<Scalars['Decimal']>;
  sodium?: InputMaybe<Scalars['Decimal']>;
  sugar?: InputMaybe<Scalars['Decimal']>;
  user: Scalars['UUID'];
};


export type MutationCreateUserArgs = {
  birth: Scalars['Date'];
  email: Scalars['String'];
  height: Scalars['Int'];
  password: Scalars['String'];
  sex: Scalars['Boolean'];
  username: Scalars['String'];
};


export type MutationCreateWorkoutPlanArgs = {
  burnedCalories?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['UUID']>;
  name?: InputMaybe<Scalars['String']>;
};


export type MutationCreateWorkoutResultArgs = {
  burnedCalories: Scalars['Int'];
  exercises: Scalars['JSONString'];
  id: Scalars['UUID'];
  name: Scalars['String'];
  when: Scalars['Date'];
  workoutPlan: Scalars['UUID'];
};


export type MutationDeleteConsumedArgs = {
  id: Scalars['UUID'];
};


export type MutationDeleteExerciseArgs = {
  id: Scalars['UUID'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['UUID'];
  user: Scalars['UUID'];
};


export type MutationDeleteWorkoutPlanArgs = {
  id: Scalars['UUID'];
};


export type MutationDeleteWorkoutResultArgs = {
  id: Scalars['UUID'];
};


export type MutationRefreshTokenArgs = {
  refreshToken?: InputMaybe<Scalars['String']>;
};


export type MutationRevokeTokenArgs = {
  refreshToken?: InputMaybe<Scalars['String']>;
};


export type MutationTokenAuthArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationUpdateConsumedArgs = {
  howMany: Scalars['Decimal'];
  id: Scalars['UUID'];
  meal: Scalars['Int'];
};


export type MutationUpdateMeasurementArgs = {
  id: Scalars['UUID'];
  user: Scalars['UUID'];
  weight: Scalars['Decimal'];
};


export type MutationUpdateUserArgs = {
  carbsDay0?: InputMaybe<Scalars['Int']>;
  carbsDay1?: InputMaybe<Scalars['Int']>;
  carbsDay2?: InputMaybe<Scalars['Int']>;
  carbsDay3?: InputMaybe<Scalars['Int']>;
  carbsDay4?: InputMaybe<Scalars['Int']>;
  carbsDay5?: InputMaybe<Scalars['Int']>;
  carbsDay6?: InputMaybe<Scalars['Int']>;
  fatsDay0?: InputMaybe<Scalars['Int']>;
  fatsDay1?: InputMaybe<Scalars['Int']>;
  fatsDay2?: InputMaybe<Scalars['Int']>;
  fatsDay3?: InputMaybe<Scalars['Int']>;
  fatsDay4?: InputMaybe<Scalars['Int']>;
  fatsDay5?: InputMaybe<Scalars['Int']>;
  fatsDay6?: InputMaybe<Scalars['Int']>;
  proteinsDay0?: InputMaybe<Scalars['Int']>;
  proteinsDay1?: InputMaybe<Scalars['Int']>;
  proteinsDay2?: InputMaybe<Scalars['Int']>;
  proteinsDay3?: InputMaybe<Scalars['Int']>;
  proteinsDay4?: InputMaybe<Scalars['Int']>;
  proteinsDay5?: InputMaybe<Scalars['Int']>;
  proteinsDay6?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateWorkoutPlanArgs = {
  burnedCalories?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  exercises?: InputMaybe<Scalars['JSONString']>;
  id: Scalars['UUID'];
  name?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateWorkoutResultArgs = {
  burnedCalories?: InputMaybe<Scalars['Int']>;
  exercises: Scalars['JSONString'];
  id: Scalars['UUID'];
  name: Scalars['String'];
  note?: InputMaybe<Scalars['String']>;
  when: Scalars['Date'];
};


export type MutationVerifyTokenArgs = {
  token?: InputMaybe<Scalars['String']>;
};

/** Obtain JSON Web Token mutation */
export type ObtainJsonWebToken = {
  __typename?: 'ObtainJSONWebToken';
  payload: Scalars['GenericScalar'];
  refreshExpiresIn: Scalars['Int'];
  refreshToken: Scalars['String'];
  token: Scalars['String'];
};

export type ProductType = {
  __typename?: 'ProductType';
  barcode: Scalars['Int'];
  carbs: Scalars['Decimal'];
  consumedSet: Array<ConsumedType>;
  createdAt: Scalars['DateTime'];
  ethanol: Scalars['Decimal'];
  fats: Scalars['Decimal'];
  fiber: Scalars['Decimal'];
  id: Scalars['UUID'];
  isDeleted: Scalars['Boolean'];
  isExpectingCheck: Scalars['Boolean'];
  isVerified: Scalars['Boolean'];
  name: Scalars['String'];
  proteins: Scalars['Decimal'];
  sodium: Scalars['Decimal'];
  sugar: Scalars['Decimal'];
  updatedAt: Scalars['DateTime'];
  user?: Maybe<UserType>;
};

export type Query = {
  __typename?: 'Query';
  consumedByRangeAndUsername?: Maybe<Array<Maybe<ConsumedType>>>;
  consumedByWhenAndUsername?: Maybe<Array<Maybe<ConsumedType>>>;
  exercisesByName?: Maybe<Array<Maybe<ExerciseType>>>;
  measurementByWhenAndUsername?: Maybe<MeasurementType>;
  measurementsByRangeAndUsername?: Maybe<Array<Maybe<MeasurementType>>>;
  previousWorkoutResult?: Maybe<WorkoutResultType>;
  productsByName?: Maybe<Array<Maybe<ProductType>>>;
  userByUsername?: Maybe<UserType>;
  users?: Maybe<Array<Maybe<UserType>>>;
  workoutPlan?: Maybe<WorkoutPlanType>;
  workoutPlans?: Maybe<Array<Maybe<WorkoutPlanType>>>;
  workoutResult?: Maybe<WorkoutResultType>;
  workoutResults?: Maybe<Array<Maybe<WorkoutResultType>>>;
  workoutResultsByRangeAndUsername?: Maybe<Array<Maybe<WorkoutResultType>>>;
  workoutResultsByWhen?: Maybe<Array<Maybe<WorkoutResultType>>>;
};


export type QueryConsumedByRangeAndUsernameArgs = {
  endDate: Scalars['Date'];
  startDate: Scalars['Date'];
  username: Scalars['String'];
};


export type QueryConsumedByWhenAndUsernameArgs = {
  username: Scalars['String'];
  when: Scalars['Date'];
};


export type QueryExercisesByNameArgs = {
  name: Scalars['String'];
};


export type QueryMeasurementByWhenAndUsernameArgs = {
  username: Scalars['String'];
  when: Scalars['Date'];
};


export type QueryMeasurementsByRangeAndUsernameArgs = {
  endDate: Scalars['Date'];
  startDate: Scalars['Date'];
  username: Scalars['String'];
};


export type QueryPreviousWorkoutResultArgs = {
  id: Scalars['UUID'];
};


export type QueryProductsByNameArgs = {
  name: Scalars['String'];
};


export type QueryUserByUsernameArgs = {
  username: Scalars['String'];
};


export type QueryWorkoutPlanArgs = {
  id: Scalars['UUID'];
};


export type QueryWorkoutPlansArgs = {
  username: Scalars['String'];
};


export type QueryWorkoutResultArgs = {
  id: Scalars['UUID'];
};


export type QueryWorkoutResultsArgs = {
  username: Scalars['String'];
};


export type QueryWorkoutResultsByRangeAndUsernameArgs = {
  endDate: Scalars['Date'];
  startDate: Scalars['Date'];
  username: Scalars['String'];
};


export type QueryWorkoutResultsByWhenArgs = {
  username: Scalars['String'];
  when: Scalars['Date'];
};

export type Refresh = {
  __typename?: 'Refresh';
  payload: Scalars['GenericScalar'];
  refreshExpiresIn: Scalars['Int'];
  refreshToken: Scalars['String'];
  token: Scalars['String'];
};

export type Revoke = {
  __typename?: 'Revoke';
  revoked: Scalars['Int'];
};

export type UpdateConsumed = {
  __typename?: 'UpdateConsumed';
  consumed?: Maybe<ConsumedType>;
};

export type UpdateMeasurement = {
  __typename?: 'UpdateMeasurement';
  measurement?: Maybe<MeasurementType>;
};

export type UpdateUser = {
  __typename?: 'UpdateUser';
  user?: Maybe<UserType>;
};

export type UpdateWorkoutPlan = {
  __typename?: 'UpdateWorkoutPlan';
  workoutPlan?: Maybe<WorkoutPlanType>;
};

export type UpdateWorkoutResult = {
  __typename?: 'UpdateWorkoutResult';
  workoutResult?: Maybe<WorkoutResultType>;
};

export type UserType = {
  __typename?: 'UserType';
  activityLevel: CustomUserActivityLevel;
  birth: Scalars['Date'];
  /** Designates how many grams of carbs user wants to consume per day. */
  carbsDay0: Scalars['Int'];
  /** Designates how many grams of carbs user wants to consume per day. */
  carbsDay1: Scalars['Int'];
  /** Designates how many grams of carbs user wants to consume per day. */
  carbsDay2: Scalars['Int'];
  /** Designates how many grams of carbs user wants to consume per day. */
  carbsDay3: Scalars['Int'];
  /** Designates how many grams of carbs user wants to consume per day. */
  carbsDay4: Scalars['Int'];
  /** Designates how many grams of carbs user wants to consume per day. */
  carbsDay5: Scalars['Int'];
  /** Designates how many grams of carbs user wants to consume per day. */
  carbsDay6: Scalars['Int'];
  /** Designates how many percent of carbs should come from sugar. */
  carbsPercentAsSugar: Scalars['Int'];
  coachSet: Array<CoachType>;
  /** Hash used to confirm email */
  confirmEmailHash: Scalars['UUID'];
  consumedSet: Array<ConsumedType>;
  dateJoined: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  exerciseSet: Array<ExerciseType>;
  facebook?: Maybe<Scalars['String']>;
  /** Designates how many grams of fat user wants to consume per day. */
  fatsDay0: Scalars['Int'];
  /** Designates how many grams of fat user wants to consume per day. */
  fatsDay1: Scalars['Int'];
  /** Designates how many grams of fat user wants to consume per day. */
  fatsDay2: Scalars['Int'];
  /** Designates how many grams of fat user wants to consume per day. */
  fatsDay3: Scalars['Int'];
  /** Designates how many grams of fat user wants to consume per day. */
  fatsDay4: Scalars['Int'];
  /** Designates how many grams of fat user wants to consume per day. */
  fatsDay5: Scalars['Int'];
  /** Designates how many grams of fat user wants to consume per day. */
  fatsDay6: Scalars['Int'];
  /** Designates how many grams of fiber user wants to consume per day. */
  fiber: Scalars['Int'];
  firstName: Scalars['String'];
  goal: CustomUserGoal;
  /** Designates how tall is user. */
  height: Scalars['Int'];
  id: Scalars['UUID'];
  instagram?: Maybe<Scalars['String']>;
  /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
  isActive: Scalars['Boolean'];
  isCoachAnalyze: Scalars['Boolean'];
  isConfirmEmailHashExpired: Scalars['Boolean'];
  /** Designates whether the user's profile can be show to other people. */
  isPublic: Scalars['Boolean'];
  isSportActive: Scalars['Boolean'];
  /** Designates whether the user can log into this admin site. */
  isStaff: Scalars['Boolean'];
  /** Designates that this user has all permissions without explicitly assigning them. */
  isSuperuser: Scalars['Boolean'];
  isWaterAdder: Scalars['Boolean'];
  isWorkoutWatch: Scalars['Boolean'];
  kindOfDiet: CustomUserKindOfDiet;
  lastLogin?: Maybe<Scalars['DateTime']>;
  lastName: Scalars['String'];
  measurementSet: Array<MeasurementType>;
  nextCoach: Scalars['Date'];
  /** Designates how many meals user wants to have in profile. */
  numberOfMeals: Scalars['Int'];
  productSet: Array<ProductType>;
  /** Designates how many grams of proteins user wants to consume per day. */
  proteinsDay0: Scalars['Int'];
  /** Designates how many grams of proteins user wants to consume per day. */
  proteinsDay1: Scalars['Int'];
  /** Designates how many grams of proteins user wants to consume per day. */
  proteinsDay2: Scalars['Int'];
  /** Designates how many grams of proteins user wants to consume per day. */
  proteinsDay3: Scalars['Int'];
  /** Designates how many grams of proteins user wants to consume per day. */
  proteinsDay4: Scalars['Int'];
  /** Designates how many grams of proteins user wants to consume per day. */
  proteinsDay5: Scalars['Int'];
  /** Designates how many grams of proteins user wants to consume per day. */
  proteinsDay6: Scalars['Int'];
  /** Designates the sex of user. */
  sex: Scalars['Boolean'];
  twitter?: Maybe<Scalars['String']>;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String'];
  website?: Maybe<Scalars['String']>;
  workoutplanSet: Array<WorkoutPlanType>;
  workoutresultSet: Array<WorkoutResultType>;
};

export type Verify = {
  __typename?: 'Verify';
  payload: Scalars['GenericScalar'];
};

export type WorkoutPlanType = {
  __typename?: 'WorkoutPlanType';
  burnedCalories: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  exercises?: Maybe<Scalars['JSONString']>;
  id: Scalars['UUID'];
  isDeleted: Scalars['Boolean'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  user: UserType;
  workoutresultSet: Array<WorkoutResultType>;
};

export type WorkoutResultType = {
  __typename?: 'WorkoutResultType';
  burnedCalories: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  exercises?: Maybe<Scalars['JSONString']>;
  id: Scalars['UUID'];
  name: Scalars['String'];
  note?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  user: UserType;
  when: Scalars['Date'];
  workoutPlan?: Maybe<WorkoutPlanType>;
};

export type TokenAuthMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type TokenAuthMutation = { __typename?: 'Mutation', tokenAuth?: { __typename: 'ObtainJSONWebToken', token: string, refreshToken: string, payload: any, refreshExpiresIn: number } | null };

export type RefreshTokenMutationVariables = Exact<{
  refreshToken: Scalars['String'];
}>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken?: { __typename: 'Refresh', token: string, payload: any, refreshToken: string, refreshExpiresIn: number } | null };

export type CreateCoachMutationVariables = Exact<{
  id: Scalars['UUID'];
  user: Scalars['UUID'];
  weight: Scalars['Decimal'];
  goal: Scalars['Decimal'];
  kindOfDiet: Scalars['Int'];
  activityLevel: Scalars['Int'];
  isSportActive: Scalars['Boolean'];
}>;


export type CreateCoachMutation = { __typename?: 'Mutation', createCoach?: { __typename?: 'CreateCoach', coach?: { __typename?: 'CoachType', countedProteins: number, countedCarbs: number, countedFats: number } | null } | null };

export type ConsumedFieldsFragment = { __typename: 'ConsumedType', id: any, when: any, meal: number, howMany: any, product: { __typename: 'ProductType', id: any, name: string, proteins: any, carbs: any, sugar: any, fats: any, fiber: any, isVerified: boolean, sodium: any, ethanol: any, barcode: number, isExpectingCheck: boolean, isDeleted: boolean, user?: { __typename?: 'UserType', id: any } | null }, user: { __typename?: 'UserType', id: any } };

export type ConsumedByWhenAndUsernameQueryVariables = Exact<{
  when: Scalars['Date'];
  username: Scalars['String'];
}>;


export type ConsumedByWhenAndUsernameQuery = { __typename?: 'Query', consumedByWhenAndUsername?: Array<{ __typename: 'ConsumedType', id: any, when: any, meal: number, howMany: any, product: { __typename: 'ProductType', id: any, name: string, proteins: any, carbs: any, sugar: any, fats: any, fiber: any, isVerified: boolean, sodium: any, ethanol: any, barcode: number, isExpectingCheck: boolean, isDeleted: boolean, user?: { __typename?: 'UserType', id: any } | null }, user: { __typename?: 'UserType', id: any } } | null> | null, userByUsername?: { __typename: 'UserType', id: any, username: string, numberOfMeals: number, fiber: number, carbsPercentAsSugar: number, proteinsDay0: number, carbsDay0: number, fatsDay0: number, proteinsDay1: number, carbsDay1: number, fatsDay1: number, proteinsDay2: number, carbsDay2: number, fatsDay2: number, proteinsDay3: number, carbsDay3: number, fatsDay3: number, proteinsDay4: number, carbsDay4: number, fatsDay4: number, proteinsDay5: number, carbsDay5: number, fatsDay5: number, proteinsDay6: number, carbsDay6: number, fatsDay6: number, firstName: string, lastName: string, description?: string | null, facebook?: string | null, instagram?: string | null, twitter?: string | null, website?: string | null } | null };

export type ConsumedByRangeAndUsernameQueryVariables = Exact<{
  startDate: Scalars['Date'];
  endDate: Scalars['Date'];
  username: Scalars['String'];
}>;


export type ConsumedByRangeAndUsernameQuery = { __typename?: 'Query', consumedByRangeAndUsername?: Array<{ __typename: 'ConsumedType', id: any, when: any, meal: number, howMany: any, product: { __typename: 'ProductType', id: any, name: string, proteins: any, carbs: any, sugar: any, fats: any, fiber: any, isVerified: boolean, sodium: any, ethanol: any, barcode: number, isExpectingCheck: boolean, isDeleted: boolean, user?: { __typename?: 'UserType', id: any } | null }, user: { __typename?: 'UserType', id: any } } | null> | null };

export type CreateConsumedMutationVariables = Exact<{
  id: Scalars['UUID'];
  when: Scalars['Date'];
  howMany: Scalars['Decimal'];
  user: Scalars['UUID'];
  product: Scalars['UUID'];
  meal: Scalars['Int'];
}>;


export type CreateConsumedMutation = { __typename?: 'Mutation', createConsumed?: { __typename?: 'CreateConsumed', consumed?: { __typename: 'ConsumedType', id: any, when: any, meal: number, howMany: any, product: { __typename: 'ProductType', id: any, name: string, proteins: any, carbs: any, sugar: any, fats: any, fiber: any, isVerified: boolean, sodium: any, ethanol: any, barcode: number, isExpectingCheck: boolean, isDeleted: boolean, user?: { __typename?: 'UserType', id: any } | null }, user: { __typename?: 'UserType', id: any } } | null } | null };

export type UpdateConsumedMutationVariables = Exact<{
  id: Scalars['UUID'];
  howMany: Scalars['Decimal'];
  meal: Scalars['Int'];
}>;


export type UpdateConsumedMutation = { __typename?: 'Mutation', updateConsumed?: { __typename?: 'UpdateConsumed', consumed?: { __typename: 'ConsumedType', id: any, when: any, meal: number, howMany: any, product: { __typename: 'ProductType', id: any, name: string, proteins: any, carbs: any, sugar: any, fats: any, fiber: any, isVerified: boolean, sodium: any, ethanol: any, barcode: number, isExpectingCheck: boolean, isDeleted: boolean, user?: { __typename?: 'UserType', id: any } | null }, user: { __typename?: 'UserType', id: any } } | null } | null };

export type DeleteConsumedMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type DeleteConsumedMutation = { __typename?: 'Mutation', deleteConsumed?: { __typename?: 'DeleteConsumed', consumed?: { __typename?: 'ConsumedType', id: any } | null } | null };

export type DailyByWhenAndUsernameQueryVariables = Exact<{
  when: Scalars['Date'];
  username: Scalars['String'];
}>;


export type DailyByWhenAndUsernameQuery = { __typename?: 'Query', consumedByWhenAndUsername?: Array<{ __typename: 'ConsumedType', id: any, when: any, meal: number, howMany: any, product: { __typename: 'ProductType', id: any, name: string, proteins: any, carbs: any, sugar: any, fats: any, fiber: any, isVerified: boolean, sodium: any, ethanol: any, barcode: number, isExpectingCheck: boolean, isDeleted: boolean, user?: { __typename?: 'UserType', id: any } | null }, user: { __typename?: 'UserType', id: any } } | null> | null, workoutResultsByWhen?: Array<{ __typename: 'WorkoutResultType', id: any, name: string, burnedCalories: number, exercises?: any | null, note?: string | null, when: any, workoutPlan?: { __typename?: 'WorkoutPlanType', id: any, name: string, description?: string | null } | null, user: { __typename?: 'UserType', id: any, username: string } } | null> | null, measurementByWhenAndUsername?: { __typename: 'MeasurementType', id: any, weight: any, when: any, user: { __typename?: 'UserType', id: any, username: string } } | null, userByUsername?: { __typename: 'UserType', id: any, username: string, numberOfMeals: number, fiber: number, carbsPercentAsSugar: number, proteinsDay0: number, carbsDay0: number, fatsDay0: number, proteinsDay1: number, carbsDay1: number, fatsDay1: number, proteinsDay2: number, carbsDay2: number, fatsDay2: number, proteinsDay3: number, carbsDay3: number, fatsDay3: number, proteinsDay4: number, carbsDay4: number, fatsDay4: number, proteinsDay5: number, carbsDay5: number, fatsDay5: number, proteinsDay6: number, carbsDay6: number, fatsDay6: number, firstName: string, lastName: string, description?: string | null, facebook?: string | null, instagram?: string | null, twitter?: string | null, website?: string | null } | null };

export type DailiesByRangeAndUsernameQueryVariables = Exact<{
  startDate: Scalars['Date'];
  endDate: Scalars['Date'];
  username: Scalars['String'];
}>;


export type DailiesByRangeAndUsernameQuery = { __typename?: 'Query', consumedByRangeAndUsername?: Array<{ __typename: 'ConsumedType', id: any, when: any, meal: number, howMany: any, product: { __typename: 'ProductType', id: any, name: string, proteins: any, carbs: any, sugar: any, fats: any, fiber: any, isVerified: boolean, sodium: any, ethanol: any, barcode: number, isExpectingCheck: boolean, isDeleted: boolean, user?: { __typename?: 'UserType', id: any } | null }, user: { __typename?: 'UserType', id: any } } | null> | null, workoutResultsByRangeAndUsername?: Array<{ __typename: 'WorkoutResultType', id: any, name: string, burnedCalories: number, exercises?: any | null, note?: string | null, when: any, workoutPlan?: { __typename?: 'WorkoutPlanType', id: any, name: string, description?: string | null } | null, user: { __typename?: 'UserType', id: any, username: string } } | null> | null };

export type ExerciseFieldsFragment = { __typename: 'ExerciseType', id: any, name: string, user?: { __typename?: 'UserType', id: any } | null };

export type ExercisesByNameQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type ExercisesByNameQuery = { __typename?: 'Query', exercisesByName?: Array<{ __typename: 'ExerciseType', id: any, name: string, user?: { __typename?: 'UserType', id: any } | null } | null> | null };

export type CreateExerciseMutationVariables = Exact<{
  id: Scalars['UUID'];
  name: Scalars['String'];
  user: Scalars['UUID'];
}>;


export type CreateExerciseMutation = { __typename?: 'Mutation', createExercise?: { __typename?: 'CreateExercise', exercise?: { __typename: 'ExerciseType', id: any, name: string, user?: { __typename?: 'UserType', id: any } | null } | null } | null };

export type MeasurementFieldsFragment = { __typename: 'MeasurementType', id: any, weight: any, when: any, user: { __typename?: 'UserType', id: any, username: string } };

export type CreateMeasurementMutationVariables = Exact<{
  id: Scalars['UUID'];
  weight: Scalars['Decimal'];
  when: Scalars['Date'];
  user: Scalars['UUID'];
}>;


export type CreateMeasurementMutation = { __typename?: 'Mutation', createMeasurement?: { __typename?: 'CreateMeasurement', measurement?: { __typename: 'MeasurementType', id: any, weight: any, when: any, user: { __typename?: 'UserType', id: any, username: string } } | null } | null };

export type UpdateMeasurementMutationVariables = Exact<{
  id: Scalars['UUID'];
  weight: Scalars['Decimal'];
  user: Scalars['UUID'];
}>;


export type UpdateMeasurementMutation = { __typename?: 'Mutation', updateMeasurement?: { __typename?: 'UpdateMeasurement', measurement?: { __typename: 'MeasurementType', id: any, weight: any, when: any, user: { __typename?: 'UserType', id: any, username: string } } | null } | null };

export type MeasurementsByRangeAndUsernameQueryVariables = Exact<{
  startDate: Scalars['Date'];
  endDate: Scalars['Date'];
  username: Scalars['String'];
}>;


export type MeasurementsByRangeAndUsernameQuery = { __typename?: 'Query', measurementsByRangeAndUsername?: Array<{ __typename: 'MeasurementType', id: any, weight: any, when: any, user: { __typename?: 'UserType', id: any, username: string } } | null> | null };

export type ProductFieldsFragment = { __typename: 'ProductType', id: any, name: string, proteins: any, carbs: any, sugar: any, fats: any, fiber: any, isVerified: boolean, sodium: any, ethanol: any, barcode: number, isExpectingCheck: boolean, isDeleted: boolean, user?: { __typename?: 'UserType', id: any } | null };

export type CreateProductMutationVariables = Exact<{
  id: Scalars['UUID'];
  name: Scalars['String'];
  user: Scalars['UUID'];
  proteins?: InputMaybe<Scalars['Decimal']>;
  carbs?: InputMaybe<Scalars['Decimal']>;
  sugar?: InputMaybe<Scalars['Decimal']>;
  fats?: InputMaybe<Scalars['Decimal']>;
  fiber?: InputMaybe<Scalars['Decimal']>;
  sodium?: InputMaybe<Scalars['Decimal']>;
  ethanol?: InputMaybe<Scalars['Decimal']>;
  barcode?: InputMaybe<Scalars['Int']>;
  isExpectingCheck?: InputMaybe<Scalars['Boolean']>;
}>;


export type CreateProductMutation = { __typename?: 'Mutation', createProduct?: { __typename?: 'CreateProduct', product?: { __typename: 'ProductType', id: any, name: string, proteins: any, carbs: any, sugar: any, fats: any, fiber: any, isVerified: boolean, sodium: any, ethanol: any, barcode: number, isExpectingCheck: boolean, isDeleted: boolean, user?: { __typename?: 'UserType', id: any } | null } | null } | null };

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['UUID'];
  user: Scalars['UUID'];
}>;


export type DeleteProductMutation = { __typename?: 'Mutation', deleteProduct?: { __typename?: 'DeteleProduct', product?: { __typename: 'ProductType', id: any, name: string, proteins: any, carbs: any, sugar: any, fats: any, fiber: any, isVerified: boolean, sodium: any, ethanol: any, barcode: number, isExpectingCheck: boolean, isDeleted: boolean, user?: { __typename?: 'UserType', id: any } | null } | null } | null };

export type ProductsByNameQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type ProductsByNameQuery = { __typename?: 'Query', productsByName?: Array<{ __typename: 'ProductType', id: any, name: string, proteins: any, carbs: any, sugar: any, fats: any, fiber: any, isVerified: boolean, sodium: any, ethanol: any, barcode: number, isExpectingCheck: boolean, isDeleted: boolean, user?: { __typename?: 'UserType', id: any } | null } | null> | null };

export type BasicUserFieldsFragment = { __typename: 'UserType', id: any, username: string };

export type UserFieldsFragment = { __typename: 'UserType', id: any, username: string, numberOfMeals: number, fiber: number, carbsPercentAsSugar: number, proteinsDay0: number, carbsDay0: number, fatsDay0: number, proteinsDay1: number, carbsDay1: number, fatsDay1: number, proteinsDay2: number, carbsDay2: number, fatsDay2: number, proteinsDay3: number, carbsDay3: number, fatsDay3: number, proteinsDay4: number, carbsDay4: number, fatsDay4: number, proteinsDay5: number, carbsDay5: number, fatsDay5: number, proteinsDay6: number, carbsDay6: number, fatsDay6: number, firstName: string, lastName: string, description?: string | null, facebook?: string | null, instagram?: string | null, twitter?: string | null, website?: string | null };

export type CreateUserMutationVariables = Exact<{
  birth: Scalars['Date'];
  email: Scalars['String'];
  sex: Scalars['Boolean'];
  height: Scalars['Int'];
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser?: { __typename?: 'CreateUser', user?: { __typename: 'UserType', id: any, username: string, numberOfMeals: number, fiber: number, carbsPercentAsSugar: number, proteinsDay0: number, carbsDay0: number, fatsDay0: number, proteinsDay1: number, carbsDay1: number, fatsDay1: number, proteinsDay2: number, carbsDay2: number, fatsDay2: number, proteinsDay3: number, carbsDay3: number, fatsDay3: number, proteinsDay4: number, carbsDay4: number, fatsDay4: number, proteinsDay5: number, carbsDay5: number, fatsDay5: number, proteinsDay6: number, carbsDay6: number, fatsDay6: number, firstName: string, lastName: string, description?: string | null, facebook?: string | null, instagram?: string | null, twitter?: string | null, website?: string | null } | null } | null };

export type ConfirmUserMutationVariables = Exact<{
  confirmEmailHash: Scalars['UUID'];
}>;


export type ConfirmUserMutation = { __typename?: 'Mutation', confirmUser?: { __typename?: 'ConfirmUser', user?: { __typename?: 'UserType', id: any } | null } | null };

export type UpdateUserMutationVariables = Exact<{
  proteinsDay0?: InputMaybe<Scalars['Int']>;
  carbsDay0?: InputMaybe<Scalars['Int']>;
  fatsDay0?: InputMaybe<Scalars['Int']>;
  proteinsDay1?: InputMaybe<Scalars['Int']>;
  carbsDay1?: InputMaybe<Scalars['Int']>;
  fatsDay1?: InputMaybe<Scalars['Int']>;
  proteinsDay2?: InputMaybe<Scalars['Int']>;
  carbsDay2?: InputMaybe<Scalars['Int']>;
  fatsDay2?: InputMaybe<Scalars['Int']>;
  proteinsDay3?: InputMaybe<Scalars['Int']>;
  carbsDay3?: InputMaybe<Scalars['Int']>;
  fatsDay3?: InputMaybe<Scalars['Int']>;
  proteinsDay4?: InputMaybe<Scalars['Int']>;
  carbsDay4?: InputMaybe<Scalars['Int']>;
  fatsDay4?: InputMaybe<Scalars['Int']>;
  proteinsDay5?: InputMaybe<Scalars['Int']>;
  carbsDay5?: InputMaybe<Scalars['Int']>;
  fatsDay5?: InputMaybe<Scalars['Int']>;
  proteinsDay6?: InputMaybe<Scalars['Int']>;
  carbsDay6?: InputMaybe<Scalars['Int']>;
  fatsDay6?: InputMaybe<Scalars['Int']>;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser?: { __typename?: 'UpdateUser', user?: { __typename: 'UserType', id: any, username: string, numberOfMeals: number, fiber: number, carbsPercentAsSugar: number, proteinsDay0: number, carbsDay0: number, fatsDay0: number, proteinsDay1: number, carbsDay1: number, fatsDay1: number, proteinsDay2: number, carbsDay2: number, fatsDay2: number, proteinsDay3: number, carbsDay3: number, fatsDay3: number, proteinsDay4: number, carbsDay4: number, fatsDay4: number, proteinsDay5: number, carbsDay5: number, fatsDay5: number, proteinsDay6: number, carbsDay6: number, fatsDay6: number, firstName: string, lastName: string, description?: string | null, facebook?: string | null, instagram?: string | null, twitter?: string | null, website?: string | null } | null } | null };

export type UserByUsernameQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type UserByUsernameQuery = { __typename?: 'Query', userByUsername?: { __typename: 'UserType', id: any, username: string, numberOfMeals: number, fiber: number, carbsPercentAsSugar: number, proteinsDay0: number, carbsDay0: number, fatsDay0: number, proteinsDay1: number, carbsDay1: number, fatsDay1: number, proteinsDay2: number, carbsDay2: number, fatsDay2: number, proteinsDay3: number, carbsDay3: number, fatsDay3: number, proteinsDay4: number, carbsDay4: number, fatsDay4: number, proteinsDay5: number, carbsDay5: number, fatsDay5: number, proteinsDay6: number, carbsDay6: number, fatsDay6: number, firstName: string, lastName: string, description?: string | null, facebook?: string | null, instagram?: string | null, twitter?: string | null, website?: string | null } | null };

export type WorkoutPlanFieldsFragment = { __typename: 'WorkoutPlanType', id: any, name: string, description?: string | null, burnedCalories: number, exercises?: any | null, user: { __typename?: 'UserType', id: any, username: string } };

export type WorkoutPlanQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type WorkoutPlanQuery = { __typename?: 'Query', workoutPlan?: { __typename: 'WorkoutPlanType', id: any, name: string, description?: string | null, burnedCalories: number, exercises?: any | null, user: { __typename?: 'UserType', id: any, username: string } } | null };

export type WorkoutPlansQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type WorkoutPlansQuery = { __typename?: 'Query', workoutPlans?: Array<{ __typename: 'WorkoutPlanType', id: any, name: string, description?: string | null, burnedCalories: number, exercises?: any | null, user: { __typename?: 'UserType', id: any, username: string } } | null> | null };

export type CreateWorkoutPlanMutationVariables = Exact<{
  id: Scalars['UUID'];
  burnedCalories?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
}>;


export type CreateWorkoutPlanMutation = { __typename?: 'Mutation', createWorkoutPlan?: { __typename?: 'CreateWorkoutPlan', workoutPlan?: { __typename: 'WorkoutPlanType', id: any, name: string, description?: string | null, burnedCalories: number, exercises?: any | null, user: { __typename?: 'UserType', id: any, username: string } } | null } | null };

export type UpdateWorkoutPlanMutationVariables = Exact<{
  id: Scalars['UUID'];
  burnedCalories?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  exercises?: InputMaybe<Scalars['JSONString']>;
}>;


export type UpdateWorkoutPlanMutation = { __typename?: 'Mutation', updateWorkoutPlan?: { __typename?: 'UpdateWorkoutPlan', workoutPlan?: { __typename: 'WorkoutPlanType', id: any, name: string, description?: string | null, burnedCalories: number, exercises?: any | null, user: { __typename?: 'UserType', id: any, username: string } } | null } | null };

export type DeleteWorkoutPlanMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type DeleteWorkoutPlanMutation = { __typename?: 'Mutation', deleteWorkoutPlan?: { __typename?: 'DeleteWorkoutPlan', workoutPlan?: { __typename: 'WorkoutPlanType', id: any, name: string, description?: string | null, burnedCalories: number, exercises?: any | null, user: { __typename?: 'UserType', id: any, username: string } } | null } | null };

export type WorkoutResultFieldsFragment = { __typename: 'WorkoutResultType', id: any, name: string, burnedCalories: number, exercises?: any | null, note?: string | null, when: any, workoutPlan?: { __typename?: 'WorkoutPlanType', id: any, name: string, description?: string | null } | null, user: { __typename?: 'UserType', id: any, username: string } };

export type WorkoutResultsQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type WorkoutResultsQuery = { __typename?: 'Query', workoutResults?: Array<{ __typename: 'WorkoutResultType', id: any, name: string, burnedCalories: number, exercises?: any | null, note?: string | null, when: any, workoutPlan?: { __typename?: 'WorkoutPlanType', id: any, name: string, description?: string | null } | null, user: { __typename?: 'UserType', id: any, username: string } } | null> | null, userByUsername?: { __typename: 'UserType', id: any, username: string } | null };

export type WorkoutResultQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type WorkoutResultQuery = { __typename?: 'Query', workoutResult?: { __typename: 'WorkoutResultType', id: any, name: string, burnedCalories: number, exercises?: any | null, note?: string | null, when: any, workoutPlan?: { __typename?: 'WorkoutPlanType', id: any, name: string, description?: string | null } | null, user: { __typename?: 'UserType', id: any, username: string } } | null, previousWorkoutResult?: { __typename: 'WorkoutResultType', id: any, name: string, burnedCalories: number, exercises?: any | null, note?: string | null, when: any, workoutPlan?: { __typename?: 'WorkoutPlanType', id: any, name: string, description?: string | null } | null, user: { __typename?: 'UserType', id: any, username: string } } | null };

export type WorkoutResultsByWhenQueryVariables = Exact<{
  when: Scalars['Date'];
  username: Scalars['String'];
}>;


export type WorkoutResultsByWhenQuery = { __typename?: 'Query', workoutResultsByWhen?: Array<{ __typename: 'WorkoutResultType', id: any, name: string, burnedCalories: number, exercises?: any | null, note?: string | null, when: any, workoutPlan?: { __typename?: 'WorkoutPlanType', id: any, name: string, description?: string | null } | null, user: { __typename?: 'UserType', id: any, username: string } } | null> | null };

export type WorkoutResultsByRangeAndUsernameQueryVariables = Exact<{
  startDate: Scalars['Date'];
  endDate: Scalars['Date'];
  username: Scalars['String'];
}>;


export type WorkoutResultsByRangeAndUsernameQuery = { __typename?: 'Query', workoutResultsByRangeAndUsername?: Array<{ __typename: 'WorkoutResultType', id: any, name: string, burnedCalories: number, exercises?: any | null, note?: string | null, when: any, workoutPlan?: { __typename?: 'WorkoutPlanType', id: any, name: string, description?: string | null } | null, user: { __typename?: 'UserType', id: any, username: string } } | null> | null };

export type CreateWorkoutResultMutationVariables = Exact<{
  id: Scalars['UUID'];
  name: Scalars['String'];
  when: Scalars['Date'];
  burnedCalories: Scalars['Int'];
  workoutPlan: Scalars['UUID'];
  exercises: Scalars['JSONString'];
}>;


export type CreateWorkoutResultMutation = { __typename?: 'Mutation', createWorkoutResult?: { __typename?: 'CreateWorkoutResult', workoutResult?: { __typename: 'WorkoutResultType', id: any, name: string, burnedCalories: number, exercises?: any | null, note?: string | null, when: any, workoutPlan?: { __typename?: 'WorkoutPlanType', id: any, name: string, description?: string | null } | null, user: { __typename?: 'UserType', id: any, username: string } } | null } | null };

export type UpdateWorkoutResultMutationVariables = Exact<{
  id: Scalars['UUID'];
  burnedCalories?: InputMaybe<Scalars['Int']>;
  note?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  exercises: Scalars['JSONString'];
  when: Scalars['Date'];
}>;


export type UpdateWorkoutResultMutation = { __typename?: 'Mutation', updateWorkoutResult?: { __typename?: 'UpdateWorkoutResult', workoutResult?: { __typename: 'WorkoutResultType', id: any, name: string, burnedCalories: number, exercises?: any | null, note?: string | null, when: any, workoutPlan?: { __typename?: 'WorkoutPlanType', id: any, name: string, description?: string | null } | null, user: { __typename?: 'UserType', id: any, username: string } } | null } | null };

export type DeleteWorkoutResultMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type DeleteWorkoutResultMutation = { __typename?: 'Mutation', deleteWorkoutResult?: { __typename?: 'DeleteWorkoutResult', workoutResult?: { __typename: 'WorkoutResultType', id: any, name: string, burnedCalories: number, exercises?: any | null, note?: string | null, when: any, workoutPlan?: { __typename?: 'WorkoutPlanType', id: any, name: string, description?: string | null } | null, user: { __typename?: 'UserType', id: any, username: string } } | null } | null };

import { IntrospectionQuery } from 'graphql';
export default {
  "__schema": {
    "queryType": {
      "name": "Query"
    },
    "mutationType": {
      "name": "Mutation"
    },
    "subscriptionType": null,
    "types": [
      {
        "kind": "OBJECT",
        "name": "CoachType",
        "fields": [
          {
            "name": "activityLevel",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "bmr",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "calories",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "countedCarbs",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "countedFats",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "countedProteins",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "createdAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "data",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "dataCoveragePercentage",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "goal",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "isCoachAnalyze",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "isSportActive",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "kindOfDiet",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "user",
            "type": {
              "kind": "OBJECT",
              "name": "UserType",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "weight",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "ConfirmUser",
        "fields": [
          {
            "name": "user",
            "type": {
              "kind": "OBJECT",
              "name": "UserType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "ConsumedType",
        "fields": [
          {
            "name": "createdAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "howMany",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "meal",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "product",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ProductType",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "updatedAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "user",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UserType",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "when",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "CreateCoach",
        "fields": [
          {
            "name": "coach",
            "type": {
              "kind": "OBJECT",
              "name": "CoachType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "CreateConsumed",
        "fields": [
          {
            "name": "consumed",
            "type": {
              "kind": "OBJECT",
              "name": "ConsumedType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "CreateExercise",
        "fields": [
          {
            "name": "exercise",
            "type": {
              "kind": "OBJECT",
              "name": "ExerciseType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "CreateMeasurement",
        "fields": [
          {
            "name": "measurement",
            "type": {
              "kind": "OBJECT",
              "name": "MeasurementType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "CreateProduct",
        "fields": [
          {
            "name": "product",
            "type": {
              "kind": "OBJECT",
              "name": "ProductType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "CreateUser",
        "fields": [
          {
            "name": "user",
            "type": {
              "kind": "OBJECT",
              "name": "UserType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "CreateWorkoutPlan",
        "fields": [
          {
            "name": "workoutPlan",
            "type": {
              "kind": "OBJECT",
              "name": "WorkoutPlanType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "CreateWorkoutResult",
        "fields": [
          {
            "name": "workoutResult",
            "type": {
              "kind": "OBJECT",
              "name": "WorkoutResultType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "DeleteConsumed",
        "fields": [
          {
            "name": "consumed",
            "type": {
              "kind": "OBJECT",
              "name": "ConsumedType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "DeleteWorkoutPlan",
        "fields": [
          {
            "name": "workoutPlan",
            "type": {
              "kind": "OBJECT",
              "name": "WorkoutPlanType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "DeleteWorkoutResult",
        "fields": [
          {
            "name": "workoutResult",
            "type": {
              "kind": "OBJECT",
              "name": "WorkoutResultType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "DeteleExercise",
        "fields": [
          {
            "name": "Exercise",
            "type": {
              "kind": "OBJECT",
              "name": "ExerciseType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "DeteleProduct",
        "fields": [
          {
            "name": "product",
            "type": {
              "kind": "OBJECT",
              "name": "ProductType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "ExerciseType",
        "fields": [
          {
            "name": "createdAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "isDeleted",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "updatedAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "user",
            "type": {
              "kind": "OBJECT",
              "name": "UserType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "MeasurementType",
        "fields": [
          {
            "name": "createdAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "updatedAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "user",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UserType",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "weight",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "when",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Mutation",
        "fields": [
          {
            "name": "confirmUser",
            "type": {
              "kind": "OBJECT",
              "name": "ConfirmUser",
              "ofType": null
            },
            "args": [
              {
                "name": "confirmEmailHash",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "createCoach",
            "type": {
              "kind": "OBJECT",
              "name": "CreateCoach",
              "ofType": null
            },
            "args": [
              {
                "name": "activityLevel",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "goal",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "isSportActive",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "kindOfDiet",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "user",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "weight",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "createConsumed",
            "type": {
              "kind": "OBJECT",
              "name": "CreateConsumed",
              "ofType": null
            },
            "args": [
              {
                "name": "howMany",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "meal",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "product",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "user",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "when",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "createExercise",
            "type": {
              "kind": "OBJECT",
              "name": "CreateExercise",
              "ofType": null
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "name",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "user",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "createMeasurement",
            "type": {
              "kind": "OBJECT",
              "name": "CreateMeasurement",
              "ofType": null
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "user",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "weight",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "when",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "createProduct",
            "type": {
              "kind": "OBJECT",
              "name": "CreateProduct",
              "ofType": null
            },
            "args": [
              {
                "name": "barcode",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "carbs",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "ethanol",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "fats",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "fiber",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "isExpectingCheck",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "name",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "proteins",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "sodium",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "sugar",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "user",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "createUser",
            "type": {
              "kind": "OBJECT",
              "name": "CreateUser",
              "ofType": null
            },
            "args": [
              {
                "name": "birth",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "email",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "height",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "password",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "sex",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "username",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "createWorkoutPlan",
            "type": {
              "kind": "OBJECT",
              "name": "CreateWorkoutPlan",
              "ofType": null
            },
            "args": [
              {
                "name": "burnedCalories",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "description",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "id",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "name",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "createWorkoutResult",
            "type": {
              "kind": "OBJECT",
              "name": "CreateWorkoutResult",
              "ofType": null
            },
            "args": [
              {
                "name": "burnedCalories",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "exercises",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "name",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "when",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "workoutPlan",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "deleteConsumed",
            "type": {
              "kind": "OBJECT",
              "name": "DeleteConsumed",
              "ofType": null
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "deleteExercise",
            "type": {
              "kind": "OBJECT",
              "name": "DeteleExercise",
              "ofType": null
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "deleteProduct",
            "type": {
              "kind": "OBJECT",
              "name": "DeteleProduct",
              "ofType": null
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "user",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "deleteWorkoutPlan",
            "type": {
              "kind": "OBJECT",
              "name": "DeleteWorkoutPlan",
              "ofType": null
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "deleteWorkoutResult",
            "type": {
              "kind": "OBJECT",
              "name": "DeleteWorkoutResult",
              "ofType": null
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "refreshToken",
            "type": {
              "kind": "OBJECT",
              "name": "Refresh",
              "ofType": null
            },
            "args": [
              {
                "name": "refreshToken",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "revokeToken",
            "type": {
              "kind": "OBJECT",
              "name": "Revoke",
              "ofType": null
            },
            "args": [
              {
                "name": "refreshToken",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "tokenAuth",
            "type": {
              "kind": "OBJECT",
              "name": "ObtainJSONWebToken",
              "ofType": null
            },
            "args": [
              {
                "name": "password",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "username",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "updateConsumed",
            "type": {
              "kind": "OBJECT",
              "name": "UpdateConsumed",
              "ofType": null
            },
            "args": [
              {
                "name": "howMany",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "meal",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "updateMeasurement",
            "type": {
              "kind": "OBJECT",
              "name": "UpdateMeasurement",
              "ofType": null
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "user",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "weight",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "updateUser",
            "type": {
              "kind": "OBJECT",
              "name": "UpdateUser",
              "ofType": null
            },
            "args": [
              {
                "name": "carbsDay0",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "carbsDay1",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "carbsDay2",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "carbsDay3",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "carbsDay4",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "carbsDay5",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "carbsDay6",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "fatsDay0",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "fatsDay1",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "fatsDay2",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "fatsDay3",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "fatsDay4",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "fatsDay5",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "fatsDay6",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "proteinsDay0",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "proteinsDay1",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "proteinsDay2",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "proteinsDay3",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "proteinsDay4",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "proteinsDay5",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "proteinsDay6",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "updateWorkoutPlan",
            "type": {
              "kind": "OBJECT",
              "name": "UpdateWorkoutPlan",
              "ofType": null
            },
            "args": [
              {
                "name": "burnedCalories",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "description",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "exercises",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "name",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "updateWorkoutResult",
            "type": {
              "kind": "OBJECT",
              "name": "UpdateWorkoutResult",
              "ofType": null
            },
            "args": [
              {
                "name": "burnedCalories",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "exercises",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "name",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "note",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "when",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "verifyToken",
            "type": {
              "kind": "OBJECT",
              "name": "Verify",
              "ofType": null
            },
            "args": [
              {
                "name": "token",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "ObtainJSONWebToken",
        "fields": [
          {
            "name": "payload",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "refreshExpiresIn",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "refreshToken",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "token",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "ProductType",
        "fields": [
          {
            "name": "barcode",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "carbs",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "consumedSet",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ConsumedType",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "createdAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "ethanol",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "fats",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "fiber",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "isDeleted",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "isExpectingCheck",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "isVerified",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "proteins",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "sodium",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "sugar",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "updatedAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "user",
            "type": {
              "kind": "OBJECT",
              "name": "UserType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Query",
        "fields": [
          {
            "name": "consumedByRangeAndUsername",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "ConsumedType",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "endDate",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "startDate",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "username",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "consumedByWhenAndUsername",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "ConsumedType",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "username",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "when",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "exercisesByName",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "ExerciseType",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "name",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "measurementByWhenAndUsername",
            "type": {
              "kind": "OBJECT",
              "name": "MeasurementType",
              "ofType": null
            },
            "args": [
              {
                "name": "username",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "when",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "measurementsByRangeAndUsername",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "MeasurementType",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "endDate",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "startDate",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "username",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "previousWorkoutResult",
            "type": {
              "kind": "OBJECT",
              "name": "WorkoutResultType",
              "ofType": null
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "productsByName",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "ProductType",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "name",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "userByUsername",
            "type": {
              "kind": "OBJECT",
              "name": "UserType",
              "ofType": null
            },
            "args": [
              {
                "name": "username",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "users",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "UserType",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "workoutPlan",
            "type": {
              "kind": "OBJECT",
              "name": "WorkoutPlanType",
              "ofType": null
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "workoutPlans",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "WorkoutPlanType",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "username",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "workoutResult",
            "type": {
              "kind": "OBJECT",
              "name": "WorkoutResultType",
              "ofType": null
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "workoutResults",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "WorkoutResultType",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "username",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "workoutResultsByRangeAndUsername",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "WorkoutResultType",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "endDate",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "startDate",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "username",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "workoutResultsByWhen",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "WorkoutResultType",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "username",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "when",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Refresh",
        "fields": [
          {
            "name": "payload",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "refreshExpiresIn",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "refreshToken",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "token",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Revoke",
        "fields": [
          {
            "name": "revoked",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "UpdateConsumed",
        "fields": [
          {
            "name": "consumed",
            "type": {
              "kind": "OBJECT",
              "name": "ConsumedType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "UpdateMeasurement",
        "fields": [
          {
            "name": "measurement",
            "type": {
              "kind": "OBJECT",
              "name": "MeasurementType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "UpdateUser",
        "fields": [
          {
            "name": "user",
            "type": {
              "kind": "OBJECT",
              "name": "UserType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "UpdateWorkoutPlan",
        "fields": [
          {
            "name": "workoutPlan",
            "type": {
              "kind": "OBJECT",
              "name": "WorkoutPlanType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "UpdateWorkoutResult",
        "fields": [
          {
            "name": "workoutResult",
            "type": {
              "kind": "OBJECT",
              "name": "WorkoutResultType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "UserType",
        "fields": [
          {
            "name": "activityLevel",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "birth",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "carbsDay0",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "carbsDay1",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "carbsDay2",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "carbsDay3",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "carbsDay4",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "carbsDay5",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "carbsDay6",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "carbsPercentAsSugar",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "coachSet",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "CoachType",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "confirmEmailHash",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "consumedSet",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ConsumedType",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "dateJoined",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "description",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "email",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "exerciseSet",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ExerciseType",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "facebook",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "fatsDay0",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "fatsDay1",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "fatsDay2",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "fatsDay3",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "fatsDay4",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "fatsDay5",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "fatsDay6",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "fiber",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "firstName",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "goal",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "height",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "instagram",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "isActive",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "isCoachAnalyze",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "isConfirmEmailHashExpired",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "isPublic",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "isSportActive",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "isStaff",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "isSuperuser",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "isWaterAdder",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "isWorkoutWatch",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "kindOfDiet",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "lastLogin",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "lastName",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "measurementSet",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "MeasurementType",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "nextCoach",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "numberOfMeals",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "productSet",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ProductType",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "proteinsDay0",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "proteinsDay1",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "proteinsDay2",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "proteinsDay3",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "proteinsDay4",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "proteinsDay5",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "proteinsDay6",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "sex",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "twitter",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "username",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "website",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "workoutplanSet",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "WorkoutPlanType",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "workoutresultSet",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "WorkoutResultType",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Verify",
        "fields": [
          {
            "name": "payload",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "WorkoutPlanType",
        "fields": [
          {
            "name": "burnedCalories",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "createdAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "description",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "exercises",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "isDeleted",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "updatedAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "user",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UserType",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "workoutresultSet",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "WorkoutResultType",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "WorkoutResultType",
        "fields": [
          {
            "name": "burnedCalories",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "createdAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "exercises",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "note",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "updatedAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "user",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UserType",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "when",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "workoutPlan",
            "type": {
              "kind": "OBJECT",
              "name": "WorkoutPlanType",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "SCALAR",
        "name": "Any"
      }
    ],
    "directives": []
  }
} as unknown as IntrospectionQuery;
export const ProductFieldsFragmentDoc = gql`
    fragment ProductFields on ProductType {
  id
  name
  proteins
  carbs
  sugar
  fats
  fiber
  isVerified
  sodium
  ethanol
  barcode
  isExpectingCheck
  isDeleted
  user {
    id
  }
  __typename
}
    `;
export const ConsumedFieldsFragmentDoc = gql`
    fragment ConsumedFields on ConsumedType {
  id
  product {
    ...ProductFields
  }
  user {
    id
  }
  when
  meal
  howMany
  __typename
}
    ${ProductFieldsFragmentDoc}`;
export const ExerciseFieldsFragmentDoc = gql`
    fragment ExerciseFields on ExerciseType {
  id
  name
  user {
    id
  }
  __typename
}
    `;
export const MeasurementFieldsFragmentDoc = gql`
    fragment MeasurementFields on MeasurementType {
  id
  weight
  when
  user {
    id
    username
  }
  __typename
}
    `;
export const BasicUserFieldsFragmentDoc = gql`
    fragment BasicUserFields on UserType {
  id
  username
  __typename
}
    `;
export const UserFieldsFragmentDoc = gql`
    fragment UserFields on UserType {
  id
  username
  numberOfMeals
  fiber
  carbsPercentAsSugar
  proteinsDay0
  carbsDay0
  fatsDay0
  proteinsDay1
  carbsDay1
  fatsDay1
  proteinsDay2
  carbsDay2
  fatsDay2
  proteinsDay3
  carbsDay3
  fatsDay3
  proteinsDay4
  carbsDay4
  fatsDay4
  proteinsDay5
  carbsDay5
  fatsDay5
  proteinsDay6
  carbsDay6
  fatsDay6
  firstName
  lastName
  description
  facebook
  instagram
  twitter
  website
  __typename
}
    `;
export const WorkoutPlanFieldsFragmentDoc = gql`
    fragment WorkoutPlanFields on WorkoutPlanType {
  id
  name
  description
  burnedCalories
  exercises
  user {
    id
    username
  }
  __typename
}
    `;
export const WorkoutResultFieldsFragmentDoc = gql`
    fragment WorkoutResultFields on WorkoutResultType {
  id
  name
  burnedCalories
  exercises
  note
  when
  workoutPlan {
    id
    name
    description
  }
  user {
    id
    username
  }
  __typename
}
    `;
export const TokenAuthDocument = gql`
    mutation tokenAuth($username: String!, $password: String!) {
  tokenAuth(username: $username, password: $password) {
    token
    refreshToken
    payload
    refreshExpiresIn
    __typename
  }
}
    `;

export function useTokenAuthMutation() {
  return Urql.useMutation<TokenAuthMutation, TokenAuthMutationVariables>(TokenAuthDocument);
};
export const RefreshTokenDocument = gql`
    mutation RefreshToken($refreshToken: String!) {
  refreshToken(refreshToken: $refreshToken) {
    token
    payload
    refreshToken
    refreshExpiresIn
    __typename
  }
}
    `;

export function useRefreshTokenMutation() {
  return Urql.useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(RefreshTokenDocument);
};
export const CreateCoachDocument = gql`
    mutation createCoach($id: UUID!, $user: UUID!, $weight: Decimal!, $goal: Decimal!, $kindOfDiet: Int!, $activityLevel: Int!, $isSportActive: Boolean!) {
  createCoach(
    id: $id
    user: $user
    weight: $weight
    goal: $goal
    kindOfDiet: $kindOfDiet
    activityLevel: $activityLevel
    isSportActive: $isSportActive
  ) {
    coach {
      countedProteins
      countedCarbs
      countedFats
    }
  }
}
    `;

export function useCreateCoachMutation() {
  return Urql.useMutation<CreateCoachMutation, CreateCoachMutationVariables>(CreateCoachDocument);
};
export const ConsumedByWhenAndUsernameDocument = gql`
    query consumedByWhenAndUsername($when: Date!, $username: String!) {
  consumedByWhenAndUsername(when: $when, username: $username) {
    ...ConsumedFields
  }
  userByUsername(username: $username) {
    ...UserFields
  }
}
    ${ConsumedFieldsFragmentDoc}
${UserFieldsFragmentDoc}`;

export function useConsumedByWhenAndUsernameQuery(options: Omit<Urql.UseQueryArgs<ConsumedByWhenAndUsernameQueryVariables>, 'query'>) {
  return Urql.useQuery<ConsumedByWhenAndUsernameQuery>({ query: ConsumedByWhenAndUsernameDocument, ...options });
};
export const ConsumedByRangeAndUsernameDocument = gql`
    query consumedByRangeAndUsername($startDate: Date!, $endDate: Date!, $username: String!) {
  consumedByRangeAndUsername(
    startDate: $startDate
    endDate: $endDate
    username: $username
  ) {
    ...ConsumedFields
  }
}
    ${ConsumedFieldsFragmentDoc}`;

export function useConsumedByRangeAndUsernameQuery(options: Omit<Urql.UseQueryArgs<ConsumedByRangeAndUsernameQueryVariables>, 'query'>) {
  return Urql.useQuery<ConsumedByRangeAndUsernameQuery>({ query: ConsumedByRangeAndUsernameDocument, ...options });
};
export const CreateConsumedDocument = gql`
    mutation createConsumed($id: UUID!, $when: Date!, $howMany: Decimal!, $user: UUID!, $product: UUID!, $meal: Int!) {
  createConsumed(
    id: $id
    when: $when
    howMany: $howMany
    user: $user
    product: $product
    meal: $meal
  ) {
    consumed {
      ...ConsumedFields
    }
  }
}
    ${ConsumedFieldsFragmentDoc}`;

export function useCreateConsumedMutation() {
  return Urql.useMutation<CreateConsumedMutation, CreateConsumedMutationVariables>(CreateConsumedDocument);
};
export const UpdateConsumedDocument = gql`
    mutation updateConsumed($id: UUID!, $howMany: Decimal!, $meal: Int!) {
  updateConsumed(id: $id, howMany: $howMany, meal: $meal) {
    consumed {
      ...ConsumedFields
    }
  }
}
    ${ConsumedFieldsFragmentDoc}`;

export function useUpdateConsumedMutation() {
  return Urql.useMutation<UpdateConsumedMutation, UpdateConsumedMutationVariables>(UpdateConsumedDocument);
};
export const DeleteConsumedDocument = gql`
    mutation deleteConsumed($id: UUID!) {
  deleteConsumed(id: $id) {
    consumed {
      id
    }
  }
}
    `;

export function useDeleteConsumedMutation() {
  return Urql.useMutation<DeleteConsumedMutation, DeleteConsumedMutationVariables>(DeleteConsumedDocument);
};
export const DailyByWhenAndUsernameDocument = gql`
    query dailyByWhenAndUsername($when: Date!, $username: String!) {
  consumedByWhenAndUsername(when: $when, username: $username) {
    ...ConsumedFields
  }
  workoutResultsByWhen(when: $when, username: $username) {
    ...WorkoutResultFields
  }
  measurementByWhenAndUsername(when: $when, username: $username) {
    ...MeasurementFields
  }
  userByUsername(username: $username) {
    ...UserFields
  }
}
    ${ConsumedFieldsFragmentDoc}
${WorkoutResultFieldsFragmentDoc}
${MeasurementFieldsFragmentDoc}
${UserFieldsFragmentDoc}`;

export function useDailyByWhenAndUsernameQuery(options: Omit<Urql.UseQueryArgs<DailyByWhenAndUsernameQueryVariables>, 'query'>) {
  return Urql.useQuery<DailyByWhenAndUsernameQuery>({ query: DailyByWhenAndUsernameDocument, ...options });
};
export const DailiesByRangeAndUsernameDocument = gql`
    query dailiesByRangeAndUsername($startDate: Date!, $endDate: Date!, $username: String!) {
  consumedByRangeAndUsername(
    startDate: $startDate
    endDate: $endDate
    username: $username
  ) {
    ...ConsumedFields
  }
  workoutResultsByRangeAndUsername(
    startDate: $startDate
    endDate: $endDate
    username: $username
  ) {
    ...WorkoutResultFields
  }
}
    ${ConsumedFieldsFragmentDoc}
${WorkoutResultFieldsFragmentDoc}`;

export function useDailiesByRangeAndUsernameQuery(options: Omit<Urql.UseQueryArgs<DailiesByRangeAndUsernameQueryVariables>, 'query'>) {
  return Urql.useQuery<DailiesByRangeAndUsernameQuery>({ query: DailiesByRangeAndUsernameDocument, ...options });
};
export const ExercisesByNameDocument = gql`
    query exercisesByName($name: String!) {
  exercisesByName(name: $name) {
    ...ExerciseFields
  }
}
    ${ExerciseFieldsFragmentDoc}`;

export function useExercisesByNameQuery(options: Omit<Urql.UseQueryArgs<ExercisesByNameQueryVariables>, 'query'>) {
  return Urql.useQuery<ExercisesByNameQuery>({ query: ExercisesByNameDocument, ...options });
};
export const CreateExerciseDocument = gql`
    mutation createExercise($id: UUID!, $name: String!, $user: UUID!) {
  createExercise(id: $id, name: $name, user: $user) {
    exercise {
      ...ExerciseFields
    }
  }
}
    ${ExerciseFieldsFragmentDoc}`;

export function useCreateExerciseMutation() {
  return Urql.useMutation<CreateExerciseMutation, CreateExerciseMutationVariables>(CreateExerciseDocument);
};
export const CreateMeasurementDocument = gql`
    mutation createMeasurement($id: UUID!, $weight: Decimal!, $when: Date!, $user: UUID!) {
  createMeasurement(id: $id, weight: $weight, when: $when, user: $user) {
    measurement {
      ...MeasurementFields
    }
  }
}
    ${MeasurementFieldsFragmentDoc}`;

export function useCreateMeasurementMutation() {
  return Urql.useMutation<CreateMeasurementMutation, CreateMeasurementMutationVariables>(CreateMeasurementDocument);
};
export const UpdateMeasurementDocument = gql`
    mutation updateMeasurement($id: UUID!, $weight: Decimal!, $user: UUID!) {
  updateMeasurement(id: $id, weight: $weight, user: $user) {
    measurement {
      ...MeasurementFields
    }
  }
}
    ${MeasurementFieldsFragmentDoc}`;

export function useUpdateMeasurementMutation() {
  return Urql.useMutation<UpdateMeasurementMutation, UpdateMeasurementMutationVariables>(UpdateMeasurementDocument);
};
export const MeasurementsByRangeAndUsernameDocument = gql`
    query measurementsByRangeAndUsername($startDate: Date!, $endDate: Date!, $username: String!) {
  measurementsByRangeAndUsername(
    startDate: $startDate
    endDate: $endDate
    username: $username
  ) {
    ...MeasurementFields
  }
}
    ${MeasurementFieldsFragmentDoc}`;

export function useMeasurementsByRangeAndUsernameQuery(options: Omit<Urql.UseQueryArgs<MeasurementsByRangeAndUsernameQueryVariables>, 'query'>) {
  return Urql.useQuery<MeasurementsByRangeAndUsernameQuery>({ query: MeasurementsByRangeAndUsernameDocument, ...options });
};
export const CreateProductDocument = gql`
    mutation createProduct($id: UUID!, $name: String!, $user: UUID!, $proteins: Decimal, $carbs: Decimal, $sugar: Decimal, $fats: Decimal, $fiber: Decimal, $sodium: Decimal, $ethanol: Decimal, $barcode: Int, $isExpectingCheck: Boolean) {
  createProduct(
    id: $id
    name: $name
    user: $user
    proteins: $proteins
    carbs: $carbs
    sugar: $sugar
    fats: $fats
    fiber: $fiber
    sodium: $sodium
    ethanol: $ethanol
    barcode: $barcode
    isExpectingCheck: $isExpectingCheck
  ) {
    product {
      ...ProductFields
    }
  }
}
    ${ProductFieldsFragmentDoc}`;

export function useCreateProductMutation() {
  return Urql.useMutation<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument);
};
export const DeleteProductDocument = gql`
    mutation deleteProduct($id: UUID!, $user: UUID!) {
  deleteProduct(id: $id, user: $user) {
    product {
      ...ProductFields
    }
  }
}
    ${ProductFieldsFragmentDoc}`;

export function useDeleteProductMutation() {
  return Urql.useMutation<DeleteProductMutation, DeleteProductMutationVariables>(DeleteProductDocument);
};
export const ProductsByNameDocument = gql`
    query productsByName($name: String!) {
  productsByName(name: $name) {
    ...ProductFields
  }
}
    ${ProductFieldsFragmentDoc}`;

export function useProductsByNameQuery(options: Omit<Urql.UseQueryArgs<ProductsByNameQueryVariables>, 'query'>) {
  return Urql.useQuery<ProductsByNameQuery>({ query: ProductsByNameDocument, ...options });
};
export const CreateUserDocument = gql`
    mutation createUser($birth: Date!, $email: String!, $sex: Boolean!, $height: Int!, $username: String!, $password: String!) {
  createUser(
    birth: $birth
    email: $email
    sex: $sex
    height: $height
    username: $username
    password: $password
  ) {
    user {
      ...UserFields
    }
  }
}
    ${UserFieldsFragmentDoc}`;

export function useCreateUserMutation() {
  return Urql.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument);
};
export const ConfirmUserDocument = gql`
    mutation confirmUser($confirmEmailHash: UUID!) {
  confirmUser(confirmEmailHash: $confirmEmailHash) {
    user {
      id
    }
  }
}
    `;

export function useConfirmUserMutation() {
  return Urql.useMutation<ConfirmUserMutation, ConfirmUserMutationVariables>(ConfirmUserDocument);
};
export const UpdateUserDocument = gql`
    mutation updateUser($proteinsDay0: Int, $carbsDay0: Int, $fatsDay0: Int, $proteinsDay1: Int, $carbsDay1: Int, $fatsDay1: Int, $proteinsDay2: Int, $carbsDay2: Int, $fatsDay2: Int, $proteinsDay3: Int, $carbsDay3: Int, $fatsDay3: Int, $proteinsDay4: Int, $carbsDay4: Int, $fatsDay4: Int, $proteinsDay5: Int, $carbsDay5: Int, $fatsDay5: Int, $proteinsDay6: Int, $carbsDay6: Int, $fatsDay6: Int) {
  updateUser(
    proteinsDay0: $proteinsDay0
    carbsDay0: $carbsDay0
    fatsDay0: $fatsDay0
    proteinsDay1: $proteinsDay1
    carbsDay1: $carbsDay1
    fatsDay1: $fatsDay1
    proteinsDay2: $proteinsDay2
    carbsDay2: $carbsDay2
    fatsDay2: $fatsDay2
    proteinsDay3: $proteinsDay3
    carbsDay3: $carbsDay3
    fatsDay3: $fatsDay3
    proteinsDay4: $proteinsDay4
    carbsDay4: $carbsDay4
    fatsDay4: $fatsDay4
    proteinsDay5: $proteinsDay5
    carbsDay5: $carbsDay5
    fatsDay5: $fatsDay5
    proteinsDay6: $proteinsDay6
    carbsDay6: $carbsDay6
    fatsDay6: $fatsDay6
  ) {
    user {
      ...UserFields
    }
  }
}
    ${UserFieldsFragmentDoc}`;

export function useUpdateUserMutation() {
  return Urql.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument);
};
export const UserByUsernameDocument = gql`
    query userByUsername($username: String!) {
  userByUsername(username: $username) {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;

export function useUserByUsernameQuery(options: Omit<Urql.UseQueryArgs<UserByUsernameQueryVariables>, 'query'>) {
  return Urql.useQuery<UserByUsernameQuery>({ query: UserByUsernameDocument, ...options });
};
export const WorkoutPlanDocument = gql`
    query workoutPlan($id: UUID!) {
  workoutPlan(id: $id) {
    ...WorkoutPlanFields
  }
}
    ${WorkoutPlanFieldsFragmentDoc}`;

export function useWorkoutPlanQuery(options: Omit<Urql.UseQueryArgs<WorkoutPlanQueryVariables>, 'query'>) {
  return Urql.useQuery<WorkoutPlanQuery>({ query: WorkoutPlanDocument, ...options });
};
export const WorkoutPlansDocument = gql`
    query workoutPlans($username: String!) {
  workoutPlans(username: $username) {
    ...WorkoutPlanFields
  }
}
    ${WorkoutPlanFieldsFragmentDoc}`;

export function useWorkoutPlansQuery(options: Omit<Urql.UseQueryArgs<WorkoutPlansQueryVariables>, 'query'>) {
  return Urql.useQuery<WorkoutPlansQuery>({ query: WorkoutPlansDocument, ...options });
};
export const CreateWorkoutPlanDocument = gql`
    mutation createWorkoutPlan($id: UUID!, $burnedCalories: Int, $description: String, $name: String) {
  createWorkoutPlan(
    id: $id
    burnedCalories: $burnedCalories
    description: $description
    name: $name
  ) {
    workoutPlan {
      ...WorkoutPlanFields
    }
  }
}
    ${WorkoutPlanFieldsFragmentDoc}`;

export function useCreateWorkoutPlanMutation() {
  return Urql.useMutation<CreateWorkoutPlanMutation, CreateWorkoutPlanMutationVariables>(CreateWorkoutPlanDocument);
};
export const UpdateWorkoutPlanDocument = gql`
    mutation updateWorkoutPlan($id: UUID!, $burnedCalories: Int, $description: String, $name: String, $exercises: JSONString) {
  updateWorkoutPlan(
    id: $id
    burnedCalories: $burnedCalories
    description: $description
    name: $name
    exercises: $exercises
  ) {
    workoutPlan {
      ...WorkoutPlanFields
    }
  }
}
    ${WorkoutPlanFieldsFragmentDoc}`;

export function useUpdateWorkoutPlanMutation() {
  return Urql.useMutation<UpdateWorkoutPlanMutation, UpdateWorkoutPlanMutationVariables>(UpdateWorkoutPlanDocument);
};
export const DeleteWorkoutPlanDocument = gql`
    mutation deleteWorkoutPlan($id: UUID!) {
  deleteWorkoutPlan(id: $id) {
    workoutPlan {
      ...WorkoutPlanFields
    }
  }
}
    ${WorkoutPlanFieldsFragmentDoc}`;

export function useDeleteWorkoutPlanMutation() {
  return Urql.useMutation<DeleteWorkoutPlanMutation, DeleteWorkoutPlanMutationVariables>(DeleteWorkoutPlanDocument);
};
export const WorkoutResultsDocument = gql`
    query workoutResults($username: String!) {
  workoutResults(username: $username) {
    ...WorkoutResultFields
  }
  userByUsername(username: $username) {
    ...BasicUserFields
  }
}
    ${WorkoutResultFieldsFragmentDoc}
${BasicUserFieldsFragmentDoc}`;

export function useWorkoutResultsQuery(options: Omit<Urql.UseQueryArgs<WorkoutResultsQueryVariables>, 'query'>) {
  return Urql.useQuery<WorkoutResultsQuery>({ query: WorkoutResultsDocument, ...options });
};
export const WorkoutResultDocument = gql`
    query workoutResult($id: UUID!) {
  workoutResult(id: $id) {
    ...WorkoutResultFields
  }
  previousWorkoutResult(id: $id) {
    ...WorkoutResultFields
  }
}
    ${WorkoutResultFieldsFragmentDoc}`;

export function useWorkoutResultQuery(options: Omit<Urql.UseQueryArgs<WorkoutResultQueryVariables>, 'query'>) {
  return Urql.useQuery<WorkoutResultQuery>({ query: WorkoutResultDocument, ...options });
};
export const WorkoutResultsByWhenDocument = gql`
    query workoutResultsByWhen($when: Date!, $username: String!) {
  workoutResultsByWhen(when: $when, username: $username) {
    ...WorkoutResultFields
  }
}
    ${WorkoutResultFieldsFragmentDoc}`;

export function useWorkoutResultsByWhenQuery(options: Omit<Urql.UseQueryArgs<WorkoutResultsByWhenQueryVariables>, 'query'>) {
  return Urql.useQuery<WorkoutResultsByWhenQuery>({ query: WorkoutResultsByWhenDocument, ...options });
};
export const WorkoutResultsByRangeAndUsernameDocument = gql`
    query workoutResultsByRangeAndUsername($startDate: Date!, $endDate: Date!, $username: String!) {
  workoutResultsByRangeAndUsername(
    startDate: $startDate
    endDate: $endDate
    username: $username
  ) {
    ...WorkoutResultFields
  }
}
    ${WorkoutResultFieldsFragmentDoc}`;

export function useWorkoutResultsByRangeAndUsernameQuery(options: Omit<Urql.UseQueryArgs<WorkoutResultsByRangeAndUsernameQueryVariables>, 'query'>) {
  return Urql.useQuery<WorkoutResultsByRangeAndUsernameQuery>({ query: WorkoutResultsByRangeAndUsernameDocument, ...options });
};
export const CreateWorkoutResultDocument = gql`
    mutation createWorkoutResult($id: UUID!, $name: String!, $when: Date!, $burnedCalories: Int!, $workoutPlan: UUID!, $exercises: JSONString!) {
  createWorkoutResult(
    id: $id
    name: $name
    when: $when
    burnedCalories: $burnedCalories
    workoutPlan: $workoutPlan
    exercises: $exercises
  ) {
    workoutResult {
      ...WorkoutResultFields
    }
  }
}
    ${WorkoutResultFieldsFragmentDoc}`;

export function useCreateWorkoutResultMutation() {
  return Urql.useMutation<CreateWorkoutResultMutation, CreateWorkoutResultMutationVariables>(CreateWorkoutResultDocument);
};
export const UpdateWorkoutResultDocument = gql`
    mutation updateWorkoutResult($id: UUID!, $burnedCalories: Int, $note: String, $name: String!, $exercises: JSONString!, $when: Date!) {
  updateWorkoutResult(
    id: $id
    burnedCalories: $burnedCalories
    note: $note
    name: $name
    exercises: $exercises
    when: $when
  ) {
    workoutResult {
      ...WorkoutResultFields
    }
  }
}
    ${WorkoutResultFieldsFragmentDoc}`;

export function useUpdateWorkoutResultMutation() {
  return Urql.useMutation<UpdateWorkoutResultMutation, UpdateWorkoutResultMutationVariables>(UpdateWorkoutResultDocument);
};
export const DeleteWorkoutResultDocument = gql`
    mutation deleteWorkoutResult($id: UUID!) {
  deleteWorkoutResult(id: $id) {
    workoutResult {
      ...WorkoutResultFields
    }
  }
}
    ${WorkoutResultFieldsFragmentDoc}`;

export function useDeleteWorkoutResultMutation() {
  return Urql.useMutation<DeleteWorkoutResultMutation, DeleteWorkoutResultMutationVariables>(DeleteWorkoutResultDocument);
};