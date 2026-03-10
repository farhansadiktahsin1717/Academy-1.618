from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('product', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PaymentTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tran_id', models.CharField(max_length=120, unique=True)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                (
                    'status',
                    models.CharField(
                        choices=[
                            ('pending', 'Pending'),
                            ('success', 'Success'),
                            ('failed', 'Failed'),
                            ('cancelled', 'Cancelled'),
                        ],
                        default='pending',
                        max_length=20,
                    ),
                ),
                ('customer_name', models.CharField(max_length=120)),
                ('customer_phone', models.CharField(max_length=20)),
                ('customer_address', models.TextField()),
                ('customer_email', models.EmailField(max_length=254)),
                ('gateway_response', models.JSONField(blank=True, default=dict)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                (
                    'course',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='payment_transactions',
                        to='product.course',
                    ),
                ),
                (
                    'user',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='payment_transactions',
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={'ordering': ['-created_at']},
        ),
    ]
