from django.urls import path

from payments.views import SSLCommerzCallbackView, SSLCommerzInitiateView

urlpatterns = [
    path('initiate/', SSLCommerzInitiateView.as_view(), name='payments-initiate'),
    path('callback/<str:callback_type>/', SSLCommerzCallbackView.as_view(), name='payments-callback'),
]
