from decimal import Decimal
import graphene
from graphene_django import DjangoObjectType
from .models import Coach
from graphql_jwt.decorators import login_required
from datetime import date
from django.contrib.auth import get_user_model

ACTIVITY_LEVELS = [
    1.2,
    1.375,
    1.55,
    1.715,
    1.9,
]

def get_age(birthdate):
    today = date.today()
    age = today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))
    return age

class CoachType(DjangoObjectType):
    class Meta:
        model = Coach

class CreateCoach(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)
        user = graphene.UUID(required=True)
        weight = graphene.Decimal(required=True)
        goal = graphene.Decimal(required=True)
        kind_of_diet = graphene.Int(required=True)
        activity_level = graphene.Int(required=True)
        is_sport_active = graphene.Boolean(required=True)

    coach = graphene.Field(CoachType)

    @login_required
    def mutate(self, info, **kwargs):
        kwargs['is_coach_analyze'] = False

        sex = info.context.user.sex
        height = info.context.user.height
        age = get_age(info.context.user.birth)

        goal = kwargs['goal']
        is_sport_active = kwargs['is_sport_active']
        kind_of_diet = kwargs['kind_of_diet']

        weight = kwargs['weight']

        activity_level = ACTIVITY_LEVELS[kwargs['activity_level']]

        if sex:
            bmr = Decimal('9.99') * weight + Decimal('6.25') * height - Decimal('4.92') * age + Decimal('5')
            calories = round(bmr * Decimal(activity_level)) + (goal / Decimal('100') * weight) * Decimal('7800') / Decimal('30')
        else:
            bmr = Decimal('9.99') * weight + Decimal('6.25') * height - Decimal('4.92') * age - Decimal('161')
            calories = round(bmr * Decimal(activity_level)) + (goal / Decimal('100') * weight) * Decimal('7800') / Decimal('30')

        proteins, carbs, fats = select_diet(kind_of_diet, age, is_sport_active, weight, calories)

        kwargs['bmr'] = bmr
        kwargs['calories'] = calories
        kwargs['user'] = info.context.user
        kwargs['is_coach_analyze'] = False
        kwargs['counted_proteins'] = proteins
        kwargs['counted_carbs'] = carbs
        kwargs['counted_fats'] = fats

        get_user_model().objects.filter(username=info.context.user).update(
            proteins_day_0 = Decimal(proteins),
            carbs_day_0 = Decimal(carbs),
            fats_day_0 = Decimal(fats),
            proteins_day_1 = Decimal(proteins),
            carbs_day_1 = Decimal(carbs),
            fats_day_1 = Decimal(fats),
            proteins_day_2 = Decimal(proteins),
            carbs_day_2 = Decimal(carbs),
            fats_day_2 = Decimal(fats),
            proteins_day_3 = Decimal(proteins),
            carbs_day_3 = Decimal(carbs),
            fats_day_3 = Decimal(fats),
            proteins_day_4 = Decimal(proteins),
            carbs_day_4 = Decimal(carbs),
            fats_day_4 = Decimal(fats),
            proteins_day_5 = Decimal(proteins),
            carbs_day_5 = Decimal(carbs),
            fats_day_5 = Decimal(fats),
            proteins_day_6 = Decimal(proteins),
            carbs_day_6 = Decimal(carbs),
            fats_day_6 = Decimal(fats),
            goal=goal,
            kind_of_diet=kind_of_diet,
            is_sport_active=is_sport_active,
            activity_level=activity_level,
            is_coach_analyze=True,
        )

        coach = Coach(**kwargs)
        coach.full_clean()
        coach.save()
        return CreateCoach(coach=coach)


class Mutation(graphene.ObjectType):
    create_coach = CreateCoach.Field()

def select_diet(kind_of_diet, age, is_extra_proteins, weight, calories):
    if kind_of_diet:
        return create_ketogenic_diet(age, is_extra_proteins, weight, calories)
    else:
        return create_balanced_diet(age, is_extra_proteins, weight, calories)

def create_balanced_diet(age, is_extra_proteins, weight, calories):
    age = float(age)
    weight = float(weight)
    calories = float(calories)

    proteins = 0
    carbs = 0
    fats = calories * 0.25

    if is_extra_proteins:
        proteins = 1.6 * weight * 4
    else:
        if age < 18:
            proteins = 0.8 * weight * 4
        elif age < 40:
            proteins = 1.1 * weight * 4
        elif age < 65:
            proteins = 1.3 * weight * 4
        else:
            proteins = 1.5 * weight * 4

    carbs = calories - fats - proteins

    if carbs < 160:
        proteins += carbs - 160
        carbs = 160

    proteins = round(proteins / 4)
    carbs = round(carbs / 4)
    fats = round(fats / 9)

    return proteins, carbs, fats

def create_ketogenic_diet(age, is_extra_proteins, weight, calories):
    age = float(age)
    weight = float(weight)
    calories = float(calories)

    proteins = 0
    carbs = calories * 0.05 / 4
    fats = 0

    # At least 40g carbs per day
    if (carbs * 4) < 160:
        carbs = 160

    if is_extra_proteins:
        proteins = 1.6 * weight * 4
    else:
        if age < 18:
            proteins = 0.8 * weight * 4
        elif age < 40:
            proteins = 1.1 * weight * 4
        elif age < 65:
            proteins = 1.3 * weight * 4
        else:
            proteins = 1.5 * weight * 4

    fats = calories - carbs - proteins

    if fats < (calories * 0.7):
        if age < 18:
            proteins = 0.8 * weight * 4
        elif age < 40:
            proteins = 1.1 * weight * 4
        elif age < 65:
            proteins = 1.3 * weight * 4
        else:
            proteins = 1.5 * weight * 4

        fats = calories - carbs - proteins

    proteins = round(proteins / 4)
    carbs = round(carbs / 4)
    fats = round(fats / 9)

    return proteins, carbs, fats
