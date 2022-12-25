import graphene
from graphene_django import DjangoObjectType
from consumed.models import Consumed
from graphql_jwt.decorators import login_required
from products.models import Product
from django.db.models import Q
from django.contrib.auth import get_user_model


class ConsumedType(DjangoObjectType):
    class Meta:
        model = Consumed


class CreateConsumed(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)
        when = graphene.Date(required=True)
        user = graphene.UUID(required=True)
        product = graphene.UUID(required=True)
        how_many = graphene.Decimal(required=True)
        meal = graphene.Int(required=True)

    consumed = graphene.Field(ConsumedType)

    @login_required
    def mutate(self, info, **kwargs):
        kwargs['user'] = info.context.user
        kwargs['product'] = Product.objects.get(id=kwargs['product'])
        consumed = Consumed(**kwargs)
        consumed.full_clean()
        consumed.save()
        return CreateConsumed(consumed=consumed)


class UpdateConsumed(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)
        how_many = graphene.Decimal(required=True)
        meal = graphene.Int(required=True)

    consumed = graphene.Field(ConsumedType)

    @login_required
    def mutate(self, info, id, how_many, meal):
        consumed = Consumed.objects.get(Q(id=id) & Q(user=info.context.user))
        if consumed:
            consumed.how_many = how_many
            consumed.meal = meal
            consumed.save()
        return UpdateConsumed(consumed=consumed)


class DeleteConsumed(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)

    consumed = graphene.Field(ConsumedType)

    @login_required
    def mutate(self, info, id):
        return Consumed.objects.get(Q(id=id) & Q(user=info.context.user)).delete()


class Mutation(graphene.ObjectType):
    create_consumed = CreateConsumed.Field()
    update_consumed = UpdateConsumed.Field()
    delete_consumed = DeleteConsumed.Field()


class Query(graphene.ObjectType):
    consumed_by_when_and_username = graphene.List(
        ConsumedType,
        when=graphene.Date(required=True),
        username=graphene.String(required=True),
    )

    consumed_by_range_and_username = graphene.List(
        ConsumedType,
        start_date=graphene.Date(required=True),
        end_date=graphene.Date(required=True),
        username=graphene.String(required=True),
    )

    def resolve_consumed_by_when_and_username(root, info, when, username):
        user = get_user_model().objects.get(username=username)
        return Consumed.objects.filter(when=when, user=user).order_by('meal')

    def resolve_consumed_by_range_and_username(root, info, start_date, end_date, username):
        user = get_user_model().objects.get(username=username)
        return Consumed.objects.filter(when__range=[start_date, end_date], user=user).order_by('meal')
