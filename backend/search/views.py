from rest_framework import generics
from products.models import Product
from products.serializers import ProductSeralizer

class SearchListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSeralizer

    def get_queryset(self, *args, **kwargs):
        qs = super().get_queryset(*args, **kwargs)
        q = self.request.GET.get('q')
        results = Product.objects.none()
        if q is not None:
            user = self.request.user
            if not user.is_authenticated: user = None
            results = qs.search(q, user=user)
        return results


