import graphene
from products.models import Product
from graphene_django import DjangoObjectType
from django.db.models.functions import Length
from django.db.models import Q
from graphql_jwt.decorators import login_required


class ProductType(DjangoObjectType):
    class Meta:
        model = Product


class CreateProduct(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)
        user = graphene.UUID(required=True)
        name = graphene.String(required=True)
        proteins = graphene.Decimal()
        carbs = graphene.Decimal()
        sugar = graphene.Decimal()
        fats = graphene.Decimal()
        fiber = graphene.Decimal()
        sodium = graphene.Decimal()
        ethanol = graphene.Decimal()
        barcode = graphene.Int()
        is_expecting_check = graphene.Boolean()

    product = graphene.Field(ProductType)

    @login_required
    def mutate(self, info, **kwargs):
        kwargs['user'] = info.context.user
        product = Product(**kwargs)
        product.full_clean()
        product.save()
        return CreateProduct(product=product)


class DeteleProduct(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)
        user = graphene.UUID(required=True)

    product = graphene.Field(ProductType)

    @login_required
    def mutate(self, info, id, user):
        product = Product.objects.get(Q(id=id) & Q(user=info.context.user))

        if product:
            product.is_deleted = True
            product.save()

        return product


class Mutation(graphene.ObjectType):
    create_product = CreateProduct.Field()
    delete_product = DeteleProduct.Field()


class Query(graphene.ObjectType):
    products_by_name = graphene.List(
        ProductType,
        name=graphene.String(required=True),
    )

    def resolve_products_by_name(root, info, name):
        return Product.objects.filter(
            Q(name__icontains=name) & 
            Q(is_deleted=False) & 
            (Q(user=info.context.user) | Q(user__isnull=True))
        ).order_by(Length('name').asc())[:10]