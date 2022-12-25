import graphene
from .models import WorkoutResult
from graphene_django import DjangoObjectType
from django.db.models import Q
from graphql_jwt.decorators import login_required
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from workout_plans.models import WorkoutPlan


class WorkoutResultType(DjangoObjectType):
    class Meta:
        model = WorkoutResult


class CreateWorkoutResult(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)
        name = graphene.String(required=True)
        when = graphene.Date(required=True)
        burned_calories = graphene.Int(required=True)
        workout_plan = graphene.UUID(required=True)
        exercises = graphene.JSONString(required=True)

    workoutResult = graphene.Field(WorkoutResultType)

    @login_required
    def mutate(self, info, **kwargs):
        kwargs['user'] = info.context.user
        kwargs['workout_plan'] = WorkoutPlan.objects.get(id=kwargs['workout_plan'])
        workoutResult = WorkoutResult(**kwargs)
        workoutResult.full_clean()
        workoutResult.save()
        return CreateWorkoutResult(workoutResult=workoutResult)


class UpdateWorkoutResult(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)
        burned_calories = graphene.Int()
        exercises = graphene.JSONString(required=True)
        name = graphene.String(required=True)
        note = graphene.String()
        when = graphene.Date(required=True)

    workoutResult = graphene.Field(WorkoutResultType)

    @login_required
    def mutate(self, info, **kwargs):
        try:
            WorkoutResult.objects.filter(Q(id=kwargs['id']) & Q(user=info.context.user)).update(**kwargs)
        except ObjectDoesNotExist:
            pass
        return UpdateWorkoutResult(workoutResult=WorkoutResult.objects.get(id=kwargs['id']))


class DeleteWorkoutResult(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)

    workoutResult = graphene.Field(WorkoutResultType)

    @login_required
    def mutate(self, info, id):
        return WorkoutResult.objects.filter(Q(id=id) & Q(user=info.context.user)).delete()


class Mutation(graphene.ObjectType):
    create_workout_result = CreateWorkoutResult.Field()
    update_workout_result = UpdateWorkoutResult.Field()
    delete_workout_result = DeleteWorkoutResult.Field()


class Query(graphene.ObjectType):
    workout_result = graphene.Field(
        WorkoutResultType,
        id=graphene.UUID(required=True),
    )

    previous_workout_result = graphene.Field(
        WorkoutResultType,
        id=graphene.UUID(required=True),
    )

    workout_results = graphene.List(
        WorkoutResultType,
        username=graphene.String(required=True),
    )

    workout_results_by_when = graphene.List(
        WorkoutResultType,
        when=graphene.Date(required=True),
        username=graphene.String(required=True),
    )

    workout_results_by_range_and_username = graphene.List(
        WorkoutResultType,
        start_date=graphene.Date(required=True),
        end_date=graphene.Date(required=True),
        username=graphene.String(required=True),
    )

    def resolve_workout_result(root, info, id):
        return WorkoutResult.objects.get(id=id)

    def resolve_previous_workout_result(root, info, id):
        workout_result = WorkoutResult.objects.get(id=id)
        previous_workout_result = WorkoutResult.objects.filter(
            Q(when__lt=workout_result.when) &
            Q(user=workout_result.user) &
            Q(workout_plan=workout_result.workout_plan)
        ).order_by('-when')

        if previous_workout_result.exists():
            return previous_workout_result[0]

        return None

    def resolve_workout_results(root, info, username):
        user = get_user_model().objects.get(username=username)
        return WorkoutResult.objects.filter(user=user).order_by('-when')

    def resolve_workout_results_by_when(root, info, when, username):
        user = get_user_model().objects.get(username=username)
        return WorkoutResult.objects.filter(Q(user=user) & Q(when=when)).order_by('-when')

    def resolve_workout_results_by_range_and_username(root, info, start_date, end_date, username):
        user = get_user_model().objects.get(username=username)
        return WorkoutResult.objects.filter(Q(user=user) & Q(when__range=[start_date, end_date])).order_by('-when')