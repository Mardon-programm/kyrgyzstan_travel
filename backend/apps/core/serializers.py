from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import Region, Category, Location, Review, Event

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'first_name', 'last_name']

    def get_name(self, obj):
        return (obj.get_full_name() or obj.email.split('@')[0]).strip() or 'Traveler'


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password', 'first_name', 'last_name']
        read_only_fields = ['id']

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('This email is already registered.')
        return value

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        name = validated_data.pop('name', '').strip()
        password = validated_data.pop('password')
        email = validated_data.pop('email').lower().strip()

        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')

        if name:
            parts = name.split(maxsplit=1)
            if not first_name:
                first_name = parts[0]
            if len(parts) > 1 and not last_name:
                last_name = parts[1]

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ['id', 'name', 'name_kg', 'name_ru', 'slug', 'description', 'image',
                  'latitude', 'longitude', 'spots_count', 'is_active']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'name_kg', 'name_ru', 'slug', 'icon', 'description', 'is_active']


class LocationListSerializer(serializers.ModelSerializer):
    region = RegionSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    elevation_display = serializers.ReadOnlyField()
    coordinates = serializers.ReadOnlyField()

    class Meta:
        model = Location
        fields = ['id', 'name', 'name_kg', 'name_ru', 'slug', 'short_description',
                  'image', 'region', 'category', 'elevation', 'elevation_display',
                  'latitude', 'longitude', 'coordinates', 'difficulty',
                  'is_featured', 'is_active']


class LocationDetailSerializer(serializers.ModelSerializer):
    region = RegionSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    elevation_display = serializers.ReadOnlyField()
    coordinates = serializers.ReadOnlyField()

    class Meta:
        model = Location
        fields = ['id', 'name', 'name_kg', 'name_ru', 'slug', 'short_description',
                  'description', 'image', 'gallery', 'region', 'category',
                  'elevation', 'elevation_display', 'latitude', 'longitude',
                  'coordinates', 'difficulty', 'best_season', 'is_featured', 'is_active',
                  'created_at', 'updated_at']


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'author_name', 'author_avatar', 'rating', 'title', 'comment',
                  'is_featured', 'helpful_count', 'created_at']


class EventSerializer(serializers.ModelSerializer):
    region = RegionSerializer(read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'title', 'title_kg', 'title_ru', 'slug', 'short_description',
                  'description', 'image', 'gallery', 'event_type', 'region',
                  'location', 'latitude', 'longitude', 'start_date', 'end_date',
                  'is_recurring', 'recurrence_rule', 'price', 'currency', 'is_free',
                  'organizer', 'organizer_contact', 'website', 'tags',
                  'is_featured', 'is_active', 'is_published', 'start_date', 'end_date']