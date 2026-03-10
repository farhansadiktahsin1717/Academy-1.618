from django.db import transaction as db_transaction
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from enrollments.models import Enrollment
from payments.models import PaymentTransaction
from payments.serializers import PaymentInitiateSerializer
from payments.services import create_payment


class SSLCommerzInitiateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PaymentInitiateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data

        if Enrollment.objects.filter(student=request.user, course_id=payload['course_id']).exists():
            return Response({'detail': 'You are already enrolled in this course.'}, status=status.HTTP_400_BAD_REQUEST)

        backend_base_url = request.build_absolute_uri('/').rstrip('/')
        transaction, gateway_data = create_payment(
            user=request.user,
            course_id=payload['course_id'],
            customer_name=payload['customer_name'],
            customer_phone=payload['customer_phone'],
            customer_address=payload['customer_address'],
            backend_base_url=backend_base_url,
        )

        payment_url = gateway_data.get('GatewayPageURL')
        if not payment_url:
            transaction.status = PaymentTransaction.STATUS_FAILED
            transaction.save(update_fields=['status', 'updated_at'])
            return Response({'detail': 'Payment gateway initialization failed.'}, status=status.HTTP_502_BAD_GATEWAY)

        return Response(
            {
                'tran_id': transaction.tran_id,
                'payment_url': payment_url,
                'status': transaction.status,
            },
            status=status.HTTP_201_CREATED,
        )


class SSLCommerzCallbackView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    status_mapping = {
        'success': PaymentTransaction.STATUS_SUCCESS,
        'fail': PaymentTransaction.STATUS_FAILED,
        'cancel': PaymentTransaction.STATUS_CANCELLED,
    }

    def post(self, request, callback_type):
        if callback_type not in {'success', 'fail', 'cancel', 'ipn'}:
            return Response({'detail': 'Invalid callback type.'}, status=status.HTTP_400_BAD_REQUEST)

        tran_id = request.data.get('tran_id') or request.query_params.get('tran_id')
        if not tran_id:
            return Response({'detail': 'tran_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payment = PaymentTransaction.objects.select_related('user', 'course').get(tran_id=tran_id)
        except PaymentTransaction.DoesNotExist:
            return Response({'detail': 'Transaction not found'}, status=status.HTTP_404_NOT_FOUND)

        target_status = self.status_mapping.get(callback_type)
        if callback_type == 'ipn':
            gateway_status = (request.data.get('status') or '').lower()
            if gateway_status == 'valid':
                target_status = PaymentTransaction.STATUS_SUCCESS
            elif gateway_status in {'failed', 'invalid_transaction'}:
                target_status = PaymentTransaction.STATUS_FAILED
            elif gateway_status == 'canceled':
                target_status = PaymentTransaction.STATUS_CANCELLED
            else:
                target_status = payment.status

        payment.status = target_status
        payment.gateway_response = request.data.dict() if hasattr(request.data, 'dict') else dict(request.data)
        payment.save(update_fields=['status', 'gateway_response', 'updated_at'])

        if target_status == PaymentTransaction.STATUS_SUCCESS:
            with db_transaction.atomic():
                Enrollment.objects.get_or_create(
                    student=payment.user,
                    course=payment.course,
                    defaults={'amount_paid': payment.amount},
                )

        return Response({'detail': f'Transaction marked as {payment.status}.'}, status=status.HTTP_200_OK)
