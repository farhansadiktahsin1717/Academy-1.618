from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

from api.views import api_root_view
from users.views import ActivateAccountView

schema_view = get_schema_view(
    openapi.Info(
        title='Academy 1.618 API',
        default_version='v1',
        description='Django REST API for Academy 1.618 online school platform',
        contact=openapi.Contact(email='support@academy1618.com'),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_root_view, name='api-root'),
    path('activate/<uid>/<token>/', ActivateAccountView.as_view(), name='account-activate'),
    path('api/v1/', include('api.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

if settings.DEBUG and 'debug_toolbar' in settings.INSTALLED_APPS:
    import debug_toolbar

    urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
