import graphene
from .models import Exercise
from graphene_django import DjangoObjectType
from django.db.models.functions import Length
from django.db.models import Q
from graphql_jwt.decorators import login_required


class ExerciseType(DjangoObjectType):
    class Meta:
        model = Exercise


class CreateExercise(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)
        user = graphene.UUID(required=True)
        name = graphene.String(required=True)

    exercise = graphene.Field(ExerciseType)

    @login_required
    def mutate(self, info, **kwargs):
        kwargs['user'] = info.context.user
        exercise = Exercise(**kwargs)
        exercise.full_clean()
        exercise.save()
        return CreateExercise(exercise=exercise)


class DeteleExercise(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)

    Exercise = graphene.Field(ExerciseType)

    @login_required
    def mutate(self, info, id):
        Exercise = Exercise.objects.get(Q(id=id) & Q(user=info.context.user))

        if Exercise:
            Exercise.is_deleted = True
            Exercise.save()

        return Exercise


class Mutation(graphene.ObjectType):
    create_Exercise = CreateExercise.Field()
    delete_Exercise = DeteleExercise.Field()


class Query(graphene.ObjectType):
    exercises_by_name = graphene.List(
        ExerciseType,
        name=graphene.String(required=True),
    )

    def resolve_exercises_by_name(root, info, name):
        return Exercise.objects.filter(
            Q(name__icontains=name) & 
            Q(is_deleted=False) & 
            (Q(user=info.context.user) | Q(user__isnull=True))
        ).order_by(Length('name').asc())[:10]