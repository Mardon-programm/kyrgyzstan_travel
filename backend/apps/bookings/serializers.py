from rest_framework import serializers
from .models import Booking, Payment
from apps.tours.serializers import TourListSerializer
from apps.tours.models import TourDate


class TourDateSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourDate
        fields = ['id', 'start_date', 'end_date', 'available_spots']


class BookingCreateSerializer(serializers.ModelSerializer):
    tour_date = serializers.PrimaryKeyRelatedField(queryset=TourDate.objects.filter(is_active=True))

    class Meta:
        model = Booking
        fields = ['tour_date', 'first_name', 'last_name', 'email', 'phone', 'guests', 'special_requests']
        read_only_fields = ['total_price', 'currency', 'booking_reference']

    def validate_guests(self, value):
        tour_date = self.initial_data.get('tour_date')
        if tour_date:
            try:
                td = TourDate.objects.get(pk=tour_date)
                if value > td.available_spots:
                    raise serializers.ValidationError(f'Only {td.available_spots} spots available')
                if value < td.tour.min_group_size:
                    raise serializers.ValidationError(f'Minimum group size is {td.tour.min_group_size}')
                if value > td.tour.max_group_size:
                    raise serializers.ValidationError(f'Maximum group size is {td.tour.max_group_size}')
            except TourDate.DoesNotExist:
                pass
        return value

    def create(self, validated_data):
        tour_date = validated_data['tour_date']
        validated_data['tour'] = tour_date.tour
        validated_data['total_price'] = tour_date.tour.price * validated_data['guests']
        validated_data['currency'] = tour_date.tour.currency
        return super().create(validated_data)


class BookingSerializer(serializers.ModelSerializer):
    tour = TourListSerializer(read_only=True)
    tour_date = TourDateSimpleSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'booking_reference', 'tour', 'tour_date', 'first_name', 'last_name',
                  'email', 'phone', 'guests', 'total_price', 'currency', 'status',
                  'payment_status', 'special_requests', 'created_at', 'confirmed_at']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'provider', 'transaction_id', 'amount', 'currency', 'status', 'paid_at']