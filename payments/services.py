import uuid
from decimal import Decimal

import requests
from decouple import config

from courses.models import Course
from payments.models import PaymentTransaction


def get_sslcommerz_gateway():
    is_sandbox = str(config('SSLCOMMERZ_SANDBOX', default='true')).strip().lower() in {'1', 'true', 'yes', 'on'}
    if is_sandbox:
        return 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
    return 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'


def create_payment(user, course_id, customer_name, customer_phone, customer_address, backend_base_url):
    course = Course.objects.get(id=course_id)
    tran_id = f'ACD-{uuid.uuid4().hex[:16].upper()}'
    amount = Decimal(course.price)

    transaction = PaymentTransaction.objects.create(
        user=user,
        course=course,
        tran_id=tran_id,
        amount=amount,
        customer_name=customer_name,
        customer_phone=customer_phone,
        customer_address=customer_address,
        customer_email=user.email,
    )

    store_id = config('SSLCOMMERZ_STORE_ID', default='testbox')
    store_passwd = config('SSLCOMMERZ_STORE_PASSWORD', default='qwerty')

    payload = {
        'store_id': store_id,
        'store_passwd': store_passwd,
        'total_amount': str(amount),
        'currency': 'BDT',
        'tran_id': tran_id,
        'success_url': f'{backend_base_url}/api/v1/payments/callback/success/',
        'fail_url': f'{backend_base_url}/api/v1/payments/callback/fail/',
        'cancel_url': f'{backend_base_url}/api/v1/payments/callback/cancel/',
        'ipn_url': f'{backend_base_url}/api/v1/payments/callback/ipn/',
        'emi_option': 0,
        'cus_name': customer_name,
        'cus_email': user.email,
        'cus_add1': customer_address,
        'cus_phone': customer_phone,
        'shipping_method': 'NO',
        'product_name': course.title,
        'product_category': course.department,
        'product_profile': 'general',
    }

    response = requests.post(get_sslcommerz_gateway(), data=payload, timeout=20)
    response.raise_for_status()
    data = response.json()

    transaction.gateway_response = data
    transaction.save(update_fields=['gateway_response', 'updated_at'])

    return transaction, data
