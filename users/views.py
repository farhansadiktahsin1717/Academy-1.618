from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.http import HttpResponse, HttpResponseBadRequest
from django.utils.http import urlsafe_base64_decode
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

User = get_user_model()


class ActivateAccountView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request, uid, token):
        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=user_id)
        except Exception:
            return HttpResponseBadRequest('Invalid activation link.')

        if user.is_active:
            return HttpResponse('Account already activated.')

        if not default_token_generator.check_token(user, token):
            return HttpResponseBadRequest('Invalid or expired activation token.')

        user.is_active = True
        user.save(update_fields=['is_active'])
        return HttpResponse('Account activated successfully. You can log in now.')


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'detail': 'refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return Response({'detail': 'invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'detail': 'logout successful'}, status=status.HTTP_205_RESET_CONTENT)
