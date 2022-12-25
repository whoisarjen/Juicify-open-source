import graphene
import users.schema
import products.schema
import consumed.schema
import exercises.schema
import workout_plans.schema
import workout_results.schema
import measurements.schema
import coach.schema

class Query(
    users.schema.Query,
    products.schema.Query,
    consumed.schema.Query,
    exercises.schema.Query,
    workout_plans.schema.Query,
    workout_results.schema.Query,
    measurements.schema.Query,
    graphene.ObjectType
):
    pass

class Mutation(
    users.schema.Mutation,
    products.schema.Mutation,
    consumed.schema.Mutation,
    exercises.schema.Mutation,
    workout_plans.schema.Mutation,
    workout_results.schema.Mutation,
    measurements.schema.Mutation,
    coach.schema.Mutation,
    graphene.ObjectType
):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)