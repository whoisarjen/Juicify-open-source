from users.models import CustomUser
from graphene_django import DjangoObjectType
import graphene
import graphql_jwt
from django.contrib.auth.hashers import make_password
from django.core.mail import EmailMessage
from django.conf import settings
from django.template.loader import render_to_string

class UserType(DjangoObjectType):
    class Meta:
        model = CustomUser
        exclude = (
            'password',
        )


class CreateUser(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        birth = graphene.Date(required=True)
        height = graphene.Int(required=True)
        sex = graphene.Boolean(required=True)

    user = graphene.Field(UserType)

    def mutate(self, info, **kwargs):
        user = CustomUser(**kwargs)
        user.password = make_password(kwargs['password'])
        user.is_active = False
        user.full_clean()
        user.save()

        template = render_to_string('emails/register.html', {
            'username': user.username,
            'confirm_email_hash': user.confirm_email_hash,
        })

        email = EmailMessage(
            'Register confirmation to Juicify.app',
            template,
            settings.EMAIL_HOST_USER,
            [user.email, 'kamilow97@gmail.com'],
        )

        email.fail_silently = False
        email.send()

        return CreateUser(user=user)


class ConfirmUser(graphene.Mutation):
    class Arguments:
        confirm_email_hash = graphene.UUID(required=True)

    user = graphene.Field(UserType)

    def mutate(self, info, confirm_email_hash):
        user = CustomUser.objects.get(confirm_email_hash=confirm_email_hash)
        user.is_active = True
        user.is_confirm_email_hash_expired = True
        user.save()

        return ConfirmUser(user=user)


class UpdateUser(graphene.Mutation):
    class Arguments:
        proteins_day_0 = graphene.Int()
        carbs_day_0 = graphene.Int()
        fats_day_0 = graphene.Int()
        proteins_day_1 = graphene.Int()
        carbs_day_1 = graphene.Int()
        fats_day_1 = graphene.Int()
        proteins_day_2 = graphene.Int()
        carbs_day_2 = graphene.Int()
        fats_day_2 = graphene.Int()
        proteins_day_3 = graphene.Int()
        carbs_day_3 = graphene.Int()
        fats_day_3 = graphene.Int()
        proteins_day_4 = graphene.Int()
        carbs_day_4 = graphene.Int()
        fats_day_4 = graphene.Int()
        proteins_day_5 = graphene.Int()
        carbs_day_5 = graphene.Int()
        fats_day_5 = graphene.Int()
        proteins_day_6 = graphene.Int()
        carbs_day_6 = graphene.Int()
        fats_day_6 = graphene.Int()

    user = graphene.Field(UserType)

    def mutate(self, info, **kwargs):
        CustomUser.objects.filter(username=info.context.user).update(**kwargs)
        return UpdateUser(user=CustomUser.objects.get(username=info.context.user))

class Query(graphene.ObjectType):
    users = graphene.List(UserType)
    user_by_username = graphene.Field(
        UserType,
        username=graphene.String(required=True),
    )

    def resolve_user_by_username(root, info, username):
        return CustomUser.objects.get(username=username)

    def resolve_users(root, info, **kwargs):
        return CustomUser.objects.all()

class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    confirm_user = ConfirmUser.Field()
    update_user = UpdateUser.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    revoke_token = graphql_jwt.Revoke.Field()

schema = graphene.Schema(mutation=Mutation)