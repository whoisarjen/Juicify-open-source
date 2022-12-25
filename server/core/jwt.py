from calendar import timegm
from datetime import datetime
import json
from django.utils.translation import gettext as _
from graphql_jwt.settings import jwt_settings

def jwt_payload(user, context=None):
    username = user.get_username()

    if hasattr(username, "pk"):
        username = username.pk

    exp = datetime.utcnow() + jwt_settings.JWT_EXPIRATION_DELTA

    payload = {
        user.USERNAME_FIELD: username,
        'id': str(user.id),
        'numberOfMeals': user.number_of_meals,
        'proteinsDay0': user.proteins_day_0,
        'carbsDay0': user.carbs_day_0,
        'fatsDay0': user.fats_day_0,
        'proteinsDay1': user.proteins_day_1,
        'carbsDay1': user.carbs_day_1,
        'fatsDay1': user.fats_day_1,
        'proteinsDay2': user.proteins_day_2,
        'carbsDay2': user.carbs_day_2,
        'fatsDay2': user.fats_day_2,
        'proteinsDay3': user.proteins_day_3,
        'carbsDay3': user.carbs_day_3,
        'fatsDay3': user.fats_day_3,
        'proteinsDay4': user.proteins_day_4,
        'carbsDay4': user.carbs_day_4,
        'fatsDay4': user.fats_day_4,
        'proteinsDay5': user.proteins_day_5,
        'carbsDay5': user.carbs_day_5,
        'fatsDay5': user.fats_day_5,
        'proteinsDay6': user.proteins_day_6,
        'carbsDay6': user.carbs_day_6,
        'fatsDay6': user.fats_day_6,
        'nextCoach': user.next_coach.isoformat(),
        'isCoachAnalyze': user.is_coach_analyze,
        'height': user.height,
        'birth': user.birth.isoformat(),
        "exp": timegm(exp.utctimetuple()),
    }

    if jwt_settings.JWT_ALLOW_REFRESH:
        payload["origIat"] = timegm(datetime.utcnow().utctimetuple())

    if jwt_settings.JWT_AUDIENCE is not None:
        payload["aud"] = jwt_settings.JWT_AUDIENCE

    if jwt_settings.JWT_ISSUER is not None:
        payload["iss"] = jwt_settings.JWT_ISSUER

    return payload