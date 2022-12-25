import graphene
from graphene_django import DjangoObjectType
from .models import Measurement
from graphql_jwt.decorators import login_required
from django.db.models import Q
from django.contrib.auth import get_user_model
from decimal import Decimal


class MeasurementType(DjangoObjectType):
    class Meta:
        model = Measurement


class CreateMeasurement(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)
        when = graphene.Date(required=True)
        weight = graphene.Decimal(required=True)
        user = graphene.UUID(required=True)

    measurement = graphene.Field(MeasurementType)

    @login_required
    def mutate(self, info, **kwargs):
        kwargs['user'] = info.context.user
        kwargs['weight'] = Decimal(round(kwargs['weight'], 1))
        print(kwargs['weight'])
        measurement = Measurement(**kwargs)
        measurement.full_clean()
        measurement.save()
        return CreateMeasurement(measurement=measurement)


class UpdateMeasurement(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)
        weight = graphene.Decimal(required=True)
        user = graphene.UUID(required=True)

    measurement = graphene.Field(MeasurementType)

    @login_required
    def mutate(self, info, id, weight, user):
        measurement = Measurement.objects.get(Q(id=id) & Q(user=info.context.user))
        if measurement:
            measurement.weight = Decimal(round(weight, 1))
            measurement.save()
        return UpdateMeasurement(measurement=measurement)


class Mutation(graphene.ObjectType):
    create_Measurement = CreateMeasurement.Field()
    update_Measurement = UpdateMeasurement.Field()


class Query(graphene.ObjectType):
    measurement_by_when_and_username = graphene.Field(
        MeasurementType,
        when=graphene.Date(required=True),
        username=graphene.String(required=True),
    )

    measurements_by_range_and_username = graphene.List(
        MeasurementType,
        start_date=graphene.Date(required=True),
        end_date=graphene.Date(required=True),
        username=graphene.String(required=True),
    )

    def resolve_measurement_by_when_and_username(root, info, when, username):
        user = get_user_model().objects.get(username=username)
        return Measurement.objects.get(when=when, user=user)

    def resolve_measurements_by_range_and_username(root, info, start_date, end_date, username):
        user = get_user_model().objects.get(username=username)
        return Measurement.objects.filter(Q(user=user) & Q(when__range=[start_date, end_date])).order_by('-when')
