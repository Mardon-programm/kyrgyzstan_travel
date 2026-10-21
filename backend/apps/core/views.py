from django.contrib.auth import authenticate, get_user_model
from django.utils import timezone
from rest_framework import filters, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .models import Region, Category, Location, Review, Event
from .serializers import (
    EventSerializer,
    LocationDetailSerializer,
    LocationListSerializer,
    RegionSerializer,
    CategorySerializer,
    ReviewSerializer,
    UserLoginSerializer,
    UserRegisterSerializer,
    UserSerializer,
)

User = get_user_model()


class AuthRegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
        }, status=status.HTTP_201_CREATED)


class AuthLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email'].lower().strip()
        password = serializer.validated_data['password']

        user = authenticate(request, username=email, password=password)
        if not user:
            user = User.objects.filter(email=email).first()
            if user and user.check_password(password):
                user = authenticate(request, username=user.username, password=password)

        if not user:
            return Response({'detail': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
        }, status=status.HTTP_200_OK)


class AuthLogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.auth:
            request.auth.delete()
        return Response({'detail': 'Logged out successfully.'}, status=status.HTTP_200_OK)


class AuthMeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class RegionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Region.objects.filter(is_active=True)
    serializer_class = RegionSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'name_kg', 'name_ru']
    ordering_fields = ['order', 'name', 'spots_count']


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'name_kg', 'name_ru']
    ordering_fields = ['order', 'name']


class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Location.objects.filter(is_active=True).select_related('region', 'category')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['region__slug', 'category__slug', 'difficulty', 'is_featured']
    search_fields = ['name', 'name_kg', 'name_ru', 'description']
    ordering_fields = ['name', 'elevation', 'created_at']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LocationDetailSerializer
        return LocationListSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        featured = self.request.query_params.get('featured')
        if featured is not None:
            queryset = queryset.filter(is_featured=featured.lower() == 'true')
        return queryset


class ReviewViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Review.objects.filter(is_approved=True).select_related('tour', 'destination', 'guide')
    serializer_class = ReviewSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tour__slug', 'destination__slug', 'guide__slug', 'rating', 'is_featured']
    search_fields = ['author_name', 'title', 'comment']
    ordering_fields = ['rating', 'created_at', 'helpful_count']
    lookup_field = 'id'

    def get_queryset(self):
        queryset = super().get_queryset()
        tour_type = self.request.query_params.get('tour_type')
        if tour_type:
            queryset = queryset.filter(tour_type=tour_type)
        return queryset


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.filter(is_active=True, is_published=True).select_related('region')
    serializer_class = EventSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['region__slug', 'event_type', 'is_featured', 'is_free', 'is_recurring']
    search_fields = ['title', 'title_kg', 'title_ru', 'description', 'location', 'organizer']
    ordering_fields = ['start_date', 'end_date', 'is_featured']
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = super().get_queryset()
        upcoming = self.request.query_params.get('upcoming')
        ongoing = self.request.query_params.get('ongoing')
        event_type = self.request.query_params.get('event_type')

        if upcoming is not None and upcoming.lower() == 'true':
            queryset = queryset.filter(start_date__gte=timezone.now())
        if ongoing is not None and ongoing.lower() == 'true':
            from django.utils import timezone
            now = timezone.now()
            queryset = queryset.filter(start_date__lte=now, end_date__gte=now)
        if event_type:
            queryset = queryset.filter(event_type=event_type)

        return queryset