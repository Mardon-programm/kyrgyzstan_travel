import json
import urllib.parse
import urllib.request

from decouple import config
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone
from .models import Booking, Payment
from .serializers import BookingCreateSerializer, BookingSerializer, PaymentSerializer


def send_booking_to_telegram(booking):
    token = config('TELEGRAM_BOT_TOKEN', default='')
    chat_id = config('TELEGRAM_CHAT_ID', default='')

    if not token or not chat_id:
        return False

    message = (
        '<b>Новая заявка на тур</b>\n\n'
        f'<b>ФИО:</b> {booking.first_name} {booking.last_name}\n'
        f'<b>Тур:</b> {booking.tour.title}\n'
        f'<b>Дата:</b> {booking.tour_date.start_date} - {booking.tour_date.end_date}\n'
        f'<b>Гостей:</b> {booking.guests}\n'
        f'<b>Email:</b> {booking.email}\n'
        f'<b>Телефон:</b> {booking.phone}\n'
        f'<b>Комментарий:</b> {booking.special_requests or "—"}\n\n'
        f'<b>Ссылка:</b> {booking.booking_reference}'
    )

    payload = {
        'chat_id': chat_id,
        'text': message,
        'parse_mode': 'HTML',
    }

    data = urllib.parse.urlencode(payload).encode('utf-8')
    request = urllib.request.Request(
        f'https://api.telegram.org/bot{token}/sendMessage',
        data=data,
        method='POST',
        headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )

    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            response_body = json.loads(response.read().decode('utf-8'))
        return bool(response_body.get('ok'))
    except Exception:
        return False


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.select_related('tour', 'tour_date').all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'payment_status', 'tour__slug']
    search_fields = ['booking_reference', 'first_name', 'last_name', 'email']
    ordering_fields = ['created_at', 'total_price']
    lookup_field = 'booking_reference'

    def get_serializer_class(self):
        if self.action == 'create':
            return BookingCreateSerializer
        return BookingSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        send_booking_to_telegram(booking)
        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def confirm(self, request, booking_reference=None):
        booking = self.get_object()
        if booking.status == 'pending':
            booking.status = 'confirmed'
            booking.confirmed_at = timezone.now()
            booking.save()
            # Decrease available spots
            booking.tour_date.available_spots -= booking.guests
            booking.tour_date.save()
        return Response(BookingSerializer(booking).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, booking_reference=None):
        booking = self.get_object()
        if booking.status in ['pending', 'confirmed']:
            booking.status = 'cancelled'
            booking.cancelled_at = timezone.now()
            # Return spots if confirmed
            if booking.status == 'confirmed':
                booking.tour_date.available_spots += booking.guests
                booking.tour_date.save()
            booking.save()
        return Response(BookingSerializer(booking).data)


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Payment.objects.select_related('booking').all()
    serializer_class = PaymentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'provider']