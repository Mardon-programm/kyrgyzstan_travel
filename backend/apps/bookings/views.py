from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone
from .models import Booking, Payment
from .serializers import BookingCreateSerializer, BookingSerializer, PaymentSerializer


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