import graphene
from .models import WorkoutPlan
from graphene_django import DjangoObjectType
from django.db.models import Q
from graphql_jwt.decorators import login_required
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist


class WorkoutPlanType(DjangoObjectType):
    class Meta:
        model = WorkoutPlan


class CreateWorkoutPlan(graphene.Mutation):
    class Arguments:
        id = graphene.UUID()
        name = graphene.String()
        description = graphene.String()
        burned_calories = graphene.Int()

    workoutPlan = graphene.Field(WorkoutPlanType)

    @login_required
    def mutate(self, info, **kwargs):
        kwargs['user'] = info.context.user
        workoutPlan = WorkoutPlan(**kwargs)
        workoutPlan.full_clean()
        workoutPlan.save()
        return CreateWorkoutPlan(workoutPlan=workoutPlan)


class UpdateWorkoutPlan(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)
        name = graphene.String()
        description = graphene.String()
        burned_calories = graphene.Int()
        exercises = graphene.JSONString()

    workoutPlan = graphene.Field(WorkoutPlanType)

    @login_required
    def mutate(self, info, **kwargs):
        try:
            WorkoutPlan.objects.filter(Q(id=kwargs['id']) & Q(user=info.context.user)).update(**kwargs)
        except ObjectDoesNotExist:
            pass
        return UpdateWorkoutPlan(workoutPlan=WorkoutPlan.objects.get(id=kwargs['id']))


class DeleteWorkoutPlan(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)

    workoutPlan = graphene.Field(WorkoutPlanType)

    @login_required
    def mutate(self, info, id):
        return WorkoutPlan.objects.filter(Q(id=id) & Q(user=info.context.user)).delete()


class Mutation(graphene.ObjectType):
    create_workout_plan = CreateWorkoutPlan.Field()
    update_workout_plan = UpdateWorkoutPlan.Field()
    delete_workout_plan = DeleteWorkoutPlan.Field()


class Query(graphene.ObjectType):
    workout_plan = graphene.Field(
        WorkoutPlanType,
        id=graphene.UUID(required=True),
    )

    workout_plans = graphene.List(
        WorkoutPlanType,
        username=graphene.String(required=True),
    )

    def resolve_workout_plan(root, info, id):
        return WorkoutPlan.objects.get(Q(id=id) & Q(is_deleted=False))

    def resolve_workout_plans(root, info, username):
        user = get_user_model().objects.get(username=username)
        return WorkoutPlan.objects.filter(Q(user=user) & Q(is_deleted=False)).order_by('-id')