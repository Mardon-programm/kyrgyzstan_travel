from datetime import timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.core.models import Region, Category, Location, Event
from apps.destinations.models import Destination, DestinationTag, DestinationTagRelation
from apps.itineraries.models import Itinerary, ItineraryDay
from apps.services.models import Guide, Vehicle, YurtCamp
from apps.guide.models import GuideCategory, TravelArticle, FAQ
from apps.tours.models import Tour, TourDate


class Command(BaseCommand):
    help = 'Seed demo data for destinations, tours, and guide content.'

    def handle(self, *args, **options):
        self.stdout.write('Seeding demo data...')

        regions_data = [
            {
                'name': 'Issyk-Kul', 'name_kg': 'Ысык-Көл', 'name_ru': 'Иссык-Куль',
                'slug': 'issyk-kul', 'description': 'Beautiful alpine lake region with wellness resorts and scenic routes.',
                'spots_count': 24, 'order': 1, 'is_active': True,
            },
            {
                'name': 'Naryn', 'name_kg': 'Нарын', 'name_ru': 'Нарын',
                'slug': 'naryn', 'description': 'Highland valleys, nomad culture, and trekking adventures.',
                'spots_count': 18, 'order': 2, 'is_active': True,
            },
            {
                'name': 'Osh', 'name_kg': 'Ош', 'name_ru': 'Ош',
                'slug': 'osh', 'description': 'Ancient trade routes and mountain landscapes in the south.',
                'spots_count': 16, 'order': 3, 'is_active': True,
            },
            {
                'name': 'Chuy', 'name_kg': 'Чүй', 'name_ru': 'Чуй',
                'slug': 'chuy', 'description': 'Close to Bishkek with scenic valleys and heritage sites.',
                'spots_count': 14, 'order': 4, 'is_active': True,
            },
            {
                'name': 'Talas', 'name_kg': 'Талас', 'name_ru': 'Талас',
                'slug': 'talas', 'description': 'Mountain valleys, Manas heritage, and quiet rural routes.',
                'spots_count': 10, 'order': 5, 'is_active': True,
            },
            {
                'name': 'Jalal-Abad', 'name_kg': 'Жалал-Абад', 'name_ru': 'Джалал-Абад',
                'slug': 'jalal-abad', 'description': 'Walnut forests, mountain villages, and warm southern hospitality.',
                'spots_count': 15, 'order': 6, 'is_active': True,
            },
            {
                'name': 'Batken', 'name_kg': 'Баткен', 'name_ru': 'Баткен',
                'slug': 'batken', 'description': 'Distinctive landscapes, apricot orchards, and southern mountain routes.',
                'spots_count': 9, 'order': 7, 'is_active': True,
            },
        ]

        region_map = {}
        for item in regions_data:
            region, created = Region.objects.get_or_create(slug=item['slug'], defaults=item)
            region.name = item['name']
            region.name_kg = item['name_kg']
            region.name_ru = item['name_ru']
            region.description = item['description']
            region.spots_count = item['spots_count']
            region.order = item['order']
            region.is_active = item['is_active']
            region.save()
            region_map[region.slug] = region

        categories_data = [
            {
                'name': 'Trekking', 'name_kg': 'Трейкинг', 'name_ru': 'Трекинг',
                'slug': 'trekking', 'icon': 'Mountain', 'description': 'Mountain routes and scenic hikes.', 'order': 1,
            },
            {
                'name': 'Horse Riding', 'name_kg': 'Атчылык', 'name_ru': 'Верховая езда',
                'slug': 'horse', 'icon': 'Horse', 'description': 'Nomad-style rides and valley trails.', 'order': 2,
            },
            {
                'name': 'Cultural Tours', 'name_kg': 'Маданияттык турлар', 'name_ru': 'Культурные туры',
                'slug': 'cultural', 'icon': 'Landmark', 'description': 'History, heritage, and traditions.', 'order': 3,
            },
            {
                'name': 'Jeep Tours', 'name_kg': 'Джип турлар', 'name_ru': 'Джип-туры',
                'slug': 'jeep', 'icon': 'Car', 'description': 'Off-road trips through mountain valleys.', 'order': 4,
            },
            {
                'name': 'Nature', 'name_kg': 'Жаратылыш', 'name_ru': 'Природа',
                'slug': 'nature', 'icon': 'Leaf', 'description': 'Nature, wildlife, and quiet scenic places.', 'order': 5,
            },
        ]

        category_map = {}
        for item in categories_data:
            category, created = Category.objects.get_or_create(slug=item['slug'], defaults=item)
            category.name = item['name']
            category.name_kg = item['name_kg']
            category.name_ru = item['name_ru']
            category.icon = item['icon']
            category.description = item['description']
            category.order = item['order']
            category.is_active = True
            category.save()
            category_map[category.slug] = category

        destinations_data = [
            {
                'name': 'Lake Issyk-Kul', 'name_kg': 'Ысык-Көл көли', 'name_ru': 'Озеро Иссык-Куль',
                'slug': 'lake-issyk-kul', 'region': 'issyk-kul', 'short_description': 'A stunning alpine lake with beaches, wellness resorts, and dramatic mountain views.',
                'description': 'Issyk-Kul is one of the largest alpine lakes in the world and a favorite for summer escapes, meditative rest, and active adventures.',
                'latitude': '42.500000', 'longitude': '77.000000', 'elevation': 1608,
                'highlights': ['Warm lake', 'Beach resorts', 'Wellness stays'], 'practical_info': {'transport': 'Shared shuttle', 'best_time': 'June-September'},
                'is_featured': True, 'is_active': True, 'order': 1,
            },
            {
                'name': 'Song-Köl', 'name_kg': 'Сон-Көл', 'name_ru': 'Сон-Куль',
                'slug': 'song-kol', 'region': 'naryn', 'short_description': 'A wide mountain lake surrounded by grasslands and quiet yurts.',
                'description': 'Song-Köl is a favorite highland destination with crisp air, wide pastures, and unforgettable stargazing.',
                'latitude': '41.870000', 'longitude': '75.250000', 'elevation': 3016,
                'highlights': ['Highland lake', 'Yurt camp', 'Stargazing'], 'practical_info': {'transport': '4x4 transfer', 'best_time': 'July-August'},
                'is_featured': True, 'is_active': True, 'order': 2,
            },
            {
                'name': 'Ala Archa Gorge', 'name_kg': 'Ала-Арча', 'name_ru': 'Ала-Арча',
                'slug': 'ala-archa-gorge', 'region': 'chuy', 'short_description': 'A dramatic canyon close to Bishkek with unforgettable hiking views.',
                'description': 'Ala Archa is famous for hiking, scenic viewpoints, and easy access from the capital.',
                'latitude': '42.520000', 'longitude': '74.460000', 'elevation': 2200,
                'highlights': ['Weekend hikes', 'Mountain views', 'Wildflowers'], 'practical_info': {'transport': 'Private car', 'best_time': 'May-October'},
                'is_featured': True, 'is_active': True, 'order': 3,
            },
            {
                'name': 'Osh Bazaar', 'name_kg': 'Ош базары', 'name_ru': 'Ошский базар',
                'slug': 'osh-bazaar', 'region': 'osh', 'short_description': 'A lively crossroads of traditions, trade, and local flavors.',
                'description': 'A symbol of southern culture with colorful markets, spices, and handmade goods.',
                'latitude': '40.530000', 'longitude': '72.800000', 'elevation': 1000,
                'highlights': ['Market stroll', 'Handicrafts', 'Local food'], 'practical_info': {'transport': 'City taxi', 'best_time': 'Year-round'},
                'is_featured': False, 'is_active': True, 'order': 4,
            },
        ]

        for item in destinations_data:
            destination, created = Destination.objects.get_or_create(slug=item['slug'], defaults={
                'name': item['name'],
                'name_kg': item['name_kg'],
                'name_ru': item['name_ru'],
                'region': region_map[item['region']],
                'short_description': item['short_description'],
                'description': item['description'],
                'latitude': item['latitude'],
                'longitude': item['longitude'],
                'elevation': item['elevation'],
                'highlights': item['highlights'],
                'practical_info': item['practical_info'],
                'is_featured': item['is_featured'],
                'is_active': item['is_active'],
                'order': item['order'],
            })
            if not created:
                destination.region = region_map[item['region']]
                destination.name = item['name']
                destination.name_kg = item['name_kg']
                destination.name_ru = item['name_ru']
                destination.short_description = item['short_description']
                destination.description = item['description']
                destination.latitude = item['latitude']
                destination.longitude = item['longitude']
                destination.elevation = item['elevation']
                destination.highlights = item['highlights']
                destination.practical_info = item['practical_info']
                destination.is_featured = item['is_featured']
                destination.is_active = item['is_active']
                destination.order = item['order']
                destination.save()

        tours_data = [
            {
                'title': 'Ala Archa Weekend Escape', 'title_kg': 'Ала-Арча жекшемби демалышы', 'title_ru': 'Выходные в Ала-Арче',
                'slug': 'ala-archa-weekend-escape', 'region': 'chuy', 'category': 'trekking',
                'duration_days': 3, 'duration_nights': 2, 'difficulty': 'moderate', 'price': '280.00',
                'currency': 'USD', 'max_group_size': 10, 'min_group_size': 2, 'rating': '4.8',
                'is_featured': True, 'order': 1, 'short_description': 'A fast-paced mountain getaway with hiking, scenic camps, and local food.',
                'description': 'Explore shaded valleys, panoramic ridges, and quiet alpine camps in a compact but memorable weekend trip.',
                'highlights': ['Hike to glacier viewpoints', 'Picnic at the gorge', 'Bishkek transfer'],
                'price_includes': ['Transport', 'Guide', 'Meals'], 'price_excludes': ['Personal gear'],
                'itinerary': [{'day': 1, 'title': 'Arrival and briefing', 'description': 'Meet the team and drive to the gorge.'}],
                'included': ['Guide', 'Transfer', 'Camp basics'], 'not_included': ['Personal equipment'],
                'what_to_bring': ['Water bottle', 'Warm layer', 'Hiking shoes'],
            },
            {
                'title': 'Song-Köl Nomad Experience', 'title_kg': 'Сон-Көл көчмөндөрдүн тажрыйбасы', 'title_ru': 'Кочевой опыт Сон-Куля',
                'slug': 'song-kol-nomad-experience', 'region': 'naryn', 'category': 'horse',
                'duration_days': 4, 'duration_nights': 3, 'difficulty': 'easy', 'price': '420.00',
                'currency': 'USD', 'max_group_size': 8, 'min_group_size': 2, 'rating': '4.9',
                'is_featured': True, 'order': 2, 'short_description': 'Ride across high pastures, stay in a yurt, and enjoy mountain evenings.',
                'description': 'Experience Kyrgyz hospitality, a gentle horse ride, and breathtaking views of the Tian Shan.',
                'highlights': ['Yurt stay', 'Horse route', 'Lake walk'],
                'price_includes': ['Transport', 'Yurt stay', 'Meals'], 'price_excludes': ['Horse rental'],
                'itinerary': [{'day': 1, 'title': 'Transfer to the plateau', 'description': 'Settle in and explore the pasture.'}],
                'included': ['Yurt camp', 'Meals'], 'not_included': ['Alcohol'],
                'what_to_bring': ['Warm clothes', 'Sunglasses', 'Camera'],
            },
            {
                'title': 'Issyk-Kul Beach & Wellness', 'title_kg': 'Ысык-Көл теңизи жана wellness', 'title_ru': 'Пляж и wellness на Иссык-Куле',
                'slug': 'issyk-kul-beach-wellness', 'region': 'issyk-kul', 'category': 'cultural',
                'duration_days': 5, 'duration_nights': 4, 'difficulty': 'light', 'price': '520.00',
                'currency': 'USD', 'max_group_size': 12, 'min_group_size': 2, 'rating': '4.7',
                'is_featured': False, 'order': 3, 'short_description': 'Relax by the lake, explore villages, and enjoy restorative wellness rituals.',
                'description': 'This balanced itinerary blends lakefront relaxation with walks to old villages and local food tastings.',
                'highlights': ['Beach time', 'Village visits', 'Wellness rituals'],
                'price_includes': ['Resort stay', 'Transport', 'Breakfast'], 'price_excludes': ['Spa treatments'],
                'itinerary': [{'day': 1, 'title': 'Lakefront arrival', 'description': 'Settle into the resort and enjoy the shore.'}],
                'included': ['Hotel', 'Breakfast'], 'not_included': ['Lunch and dinner'],
                'what_to_bring': ['Swimwear', 'Sunscreen', 'Flip-flops'],
            },
        ]

        for item in tours_data:
            tour, created = Tour.objects.get_or_create(slug=item['slug'], defaults={
                'title': item['title'],
                'title_kg': item['title_kg'],
                'title_ru': item['title_ru'],
                'region': region_map[item['region']],
                'category': category_map[item['category']],
                'duration_days': item['duration_days'],
                'duration_nights': item['duration_nights'],
                'difficulty': item['difficulty'],
                'max_group_size': item['max_group_size'],
                'min_group_size': item['min_group_size'],
                'price': item['price'],
                'currency': item['currency'],
                'price_includes': item['price_includes'],
                'price_excludes': item['price_excludes'],
                'highlights': item['highlights'],
                'itinerary': item['itinerary'],
                'included': item['included'],
                'not_included': item['not_included'],
                'what_to_bring': item['what_to_bring'],
                'rating': item['rating'],
                'short_description': item['short_description'],
                'description': item['description'],
                'is_featured': item['is_featured'],
                'order': item['order'],
                'is_active': True,
            })
            if not created:
                tour.region = region_map[item['region']]
                tour.category = category_map[item['category']]
                tour.title = item['title']
                tour.title_kg = item['title_kg']
                tour.title_ru = item['title_ru']
                tour.duration_days = item['duration_days']
                tour.duration_nights = item['duration_nights']
                tour.difficulty = item['difficulty']
                tour.max_group_size = item['max_group_size']
                tour.min_group_size = item['min_group_size']
                tour.price = item['price']
                tour.currency = item['currency']
                tour.price_includes = item['price_includes']
                tour.price_excludes = item['price_excludes']
                tour.highlights = item['highlights']
                tour.itinerary = item['itinerary']
                tour.included = item['included']
                tour.not_included = item['not_included']
                tour.what_to_bring = item['what_to_bring']
                tour.rating = item['rating']
                tour.short_description = item['short_description']
                tour.description = item['description']
                tour.is_featured = item['is_featured']
                tour.order = item['order']
                tour.is_active = True
                tour.save()

            for offset in (7, 21, 35):
                start_date = timezone.now().date() + timedelta(days=offset)
                TourDate.objects.get_or_create(
                    tour=tour,
                    start_date=start_date,
                    defaults={
                        'end_date': start_date + timedelta(days=tour.duration_days - 1),
                        'available_spots': tour.max_group_size,
                        'is_guaranteed': True,
                        'is_active': True,
                    },
                )

        guide_categories_data = [
            {'name': 'Travel Basics', 'name_kg': 'Саякаттын негиздери', 'name_ru': 'Основы путешествий', 'slug': 'travel-basics', 'description': 'Planning and first-time travel advice.', 'order': 1},
            {'name': 'Culture', 'name_kg': 'Маданият', 'name_ru': 'Культура', 'slug': 'culture', 'description': 'Local traditions and etiquette.', 'order': 2},
            {'name': 'Nature', 'name_kg': 'Жаратылыш', 'name_ru': 'Природа', 'slug': 'nature', 'description': 'Mountain, glacier, and lake advice.', 'order': 3},
        ]

        guide_category_map = {}
        for item in guide_categories_data:
            category, created = GuideCategory.objects.get_or_create(slug=item['slug'], defaults={
                'name': item['name'],
                'name_kg': item['name_kg'],
                'name_ru': item['name_ru'],
                'description': item['description'],
                'order': item['order'],
                'is_active': True,
            })
            if not created:
                category.name = item['name']
                category.name_kg = item['name_kg']
                category.name_ru = item['name_ru']
                category.description = item['description']
                category.order = item['order']
                category.is_active = True
                category.save()
            guide_category_map[category.slug] = category

        articles_data = [
            {
                'title': 'How to plan a first trip to Kyrgyzstan', 'title_kg': 'Кыргызстанга биринчи саяхатты кантип уюштурууну билүү', 'title_ru': 'Как спланировать первое путешествие в Кыргызстан',
                'slug': 'how-to-plan-a-first-trip-to-kyrgyzstan', 'category': 'travel-basics', 'excerpt': 'Simple guidance for logistics, paperwork, and travel timing.', 'content': 'Start with a clear route, a realistic budget, and a flexible itinerary. Spring and summer are ideal for mountain and lake trips.', 'reading_time': 5, 'is_featured': True, 'published_at': timezone.now(), 'status': 'published', 'tags': ['travel', 'planning'],
            },
            {
                'title': 'Respecting local traditions', 'title_kg': 'Жергиликтүү салт-дәстүрлерди сыйлоо', 'title_ru': 'Уважение к местным традициям',
                'slug': 'respecting-local-traditions', 'category': 'culture', 'excerpt': 'Practical etiquette before you visit villages or homesteads.', 'content': 'Ask before photographing family homes, offer greetings politely, and accept hospitality with gratitude.', 'reading_time': 4, 'is_featured': False, 'published_at': timezone.now(), 'status': 'published', 'tags': ['culture', 'etiquette'],
            },
            {
                'title': 'Best hiking tips for mountain routes', 'title_kg': 'Тоолуу маршруттар үчүн эң мыкты жөөшүү кеңештери', 'title_ru': 'Лучшие советы для горных троп',
                'slug': 'best-hiking-tips-for-mountain-routes', 'category': 'nature', 'excerpt': 'Keep your route safe, flexible, and comfortable in the mountains.', 'content': 'Check the weather, use layered clothing, carry enough water, and always tell someone where you are heading.', 'reading_time': 6, 'is_featured': True, 'published_at': timezone.now(), 'status': 'published', 'tags': ['hiking', 'nature'],
            },
        ]

        for item in articles_data:
            article, created = TravelArticle.objects.get_or_create(slug=item['slug'], defaults={
                'title': item['title'],
                'title_kg': item['title_kg'],
                'title_ru': item['title_ru'],
                'excerpt': item['excerpt'],
                'content': item['content'],
                'category': guide_category_map[item['category']],
                'reading_time': item['reading_time'],
                'is_featured': item['is_featured'],
                'published_at': item['published_at'],
                'status': item['status'],
                'tags': item['tags'],
            })
            if not created:
                article.title = item['title']
                article.title_kg = item['title_kg']
                article.title_ru = item['title_ru']
                article.excerpt = item['excerpt']
                article.content = item['content']
                article.category = guide_category_map[item['category']]
                article.reading_time = item['reading_time']
                article.is_featured = item['is_featured']
                article.published_at = item['published_at']
                article.status = item['status']
                article.tags = item['tags']
                article.save()

        faq_data = [
            {
                'question': 'Do I need a visa for a short trip?', 'question_kg': 'Кыска саякат үчүн виза керекпи?', 'question_ru': 'Нужна ли виза для короткой поездки?',
                'answer': 'Many visitors can enter visa-free or with a visa-on-arrival depending on nationality and travel plan.', 'answer_kg': 'Көпчүлүк саякатчылар мамлекеттин граждандыгына жараша визасыз же визаны жолдо алып келиши мүмкүн.', 'answer_ru': 'Многие путешественники могут въезжать без визы или по визе по прибытии в зависимости от гражданства и маршрута.',
                'category': 'travel-basics', 'order': 1,
            },
            {
                'question': 'What is the best season to visit?', 'question_kg': 'Кайсы мезгил эң жакшы?', 'question_ru': 'Какой сезон лучший для поездки?',
                'answer': 'June to September is the best period for hiking, lakes, and mountain trips in Kyrgyzstan.', 'answer_kg': 'Июньдан сентябрга чейин тоо жолдорун, көлдөрдү жана жаратылыш турларын көрүү үчүн эң ылайыктуу мезгил.', 'answer_ru': 'С июня по сентябрь — лучший период для походов, озер и горных поездок в Кыргызстане.',
                'category': 'nature', 'order': 2,
            },
            {
                'question': 'Can I book a private tour?', 'question_kg': 'Жеке турду брондоо мүмкүнбү?', 'question_ru': 'Могу ли я забронировать частный тур?',
                'answer': 'Yes. Most tours can be adapted for private groups, family trips, or custom itineraries.', 'answer_kg': 'Ооба. Көпчүлүк турлар жеке топторго, үй-бүлөлөргө жана жеке маршруттарга ыңгайлаштырылышы мүмкүн.', 'answer_ru': 'Да. Большинство туров можно адаптировать под частные группы, семейные поездки или индивидуальные маршруты.',
                'category': 'travel-basics', 'order': 3,
            },
        ]

        for item in faq_data:
            faq, created = FAQ.objects.get_or_create(category=guide_category_map[item['category']], question=item['question'], defaults={
                'question_kg': item['question_kg'],
                'question_ru': item['question_ru'],
                'answer': item['answer'],
                'answer_kg': item['answer_kg'],
                'answer_ru': item['answer_ru'],
                'order': item['order'],
                'is_active': True,
            })
            if not created:
                faq.question = item['question']
                faq.question_kg = item['question_kg']
                faq.question_ru = item['question_ru']
                faq.answer = item['answer']
                faq.answer_kg = item['answer_kg']
                faq.answer_ru = item['answer_ru']
                faq.category = guide_category_map[item['category']]
                faq.order = item['order']
                faq.is_active = True
                faq.save()

        # Fill the remaining public catalog tables with repeatable sample content.
        locations_data = [
            ('burana-tower', 'Burana Tower', 'Бурана мунарасы', 'Башня Бурана', 'chuy', 'cultural', '42.7464', '75.2505', 900, 'Historic minaret and archaeological site near Tokmok.'),
            ('jeti-oguz', 'Jeti-Oguz Gorge', 'Жети-Өгүз капчыгайы', 'Ущелье Джети-Огуз', 'issyk-kul', 'trekking', '42.3420', '78.2380', 2200, 'Red sandstone cliffs and mountain trails south of Issyk-Kul.'),
            ('tash-rabat', 'Tash Rabat Caravanserai', 'Таш-Рабат кербен сарайы', 'Караван-сарай Таш-Рабат', 'naryn', 'cultural', '40.8300', '75.3000', 3200, 'Stone caravanserai on a historic route through the Tian Shan.'),
            ('sulaiman-too', 'Sulaiman-Too', 'Сулайман-Тоо', 'Сулайман-Тоо', 'osh', 'cultural', '40.5283', '72.7985', 1110, 'Sacred mountain and UNESCO-listed landmark in Osh.'),
            ('arslanbob-forest', 'Arslanbob Walnut Forest', 'Арстанбап жаңгак токою', 'Ореховый лес Арсланбоб', 'jalal-abad', 'trekking', '41.3370', '72.9300', 1700, 'Mountain village and extensive natural walnut forest.'),
            ('manas-orordo', 'Manas Ordo', 'Манас Ордо', 'Манас Ордо', 'talas', 'cultural', '42.5170', '72.2420', 1300, 'Cultural complex dedicated to the Kyrgyz Manas epic.'),
            ('aigul-tash', 'Aigul-Tash', 'Айгүл-Таш', 'Айгуль-Таш', 'batken', 'nature', '39.9870', '70.9700', 1100, 'Mountain landscape near Batken known for its rare Aigul flower.'),
        ]
        location_map = {}
        for slug, name, name_kg, name_ru, region_slug, category_slug, lat, lon, elevation, description in locations_data:
            location, _ = Location.objects.update_or_create(
                slug=slug,
                defaults={
                    'name': name, 'name_kg': name_kg, 'name_ru': name_ru,
                    'region': region_map[region_slug], 'category': category_map.get(category_slug),
                    'short_description': description, 'description': description,
                    'latitude': lat, 'longitude': lon, 'elevation': elevation,
                    'difficulty': 'easy', 'best_season': 'May-October',
                    'is_featured': slug in {'jeti-oguz', 'tash-rabat', 'sulaiman-too'}, 'is_active': True,
                },
            )
            location_map[slug] = location

        tags = {}
        for name, name_kg, name_ru, color in [
            ('Mountains', 'Тоолор', 'Горы', '#5B7C62'),
            ('Culture', 'Маданият', 'Культура', '#B56B45'),
            ('Nature', 'Жаратылыш', 'Природа', '#4F8068'),
            ('Family', 'Үй-бүлө', 'Для семьи', '#C18B45'),
        ]:
            tag, _ = DestinationTag.objects.update_or_create(
                name=name,
                defaults={'name_kg': name_kg, 'name_ru': name_ru, 'color': color},
            )
            tags[name] = tag

        tag_assignments = {
            'lake-issyk-kul': ['Nature', 'Family'],
            'song-kol': ['Mountains', 'Nature'],
            'ala-archa-gorge': ['Mountains', 'Nature'],
            'osh-bazaar': ['Culture'],
        }
        for slug, tag_names in tag_assignments.items():
            destination = Destination.objects.get(slug=slug)
            for tag_name in tag_names:
                DestinationTagRelation.objects.get_or_create(destination=destination, tag=tags[tag_name])

        itineraries_data = [
            {
                'slug': 'week-in-the-tian-shan', 'title': 'A Week in the Tian Shan',
                'title_kg': 'Теңир-Тоодо бир апта', 'title_ru': 'Неделя в Тянь-Шане',
                'short_description': 'A sample seven-day route linking mountain scenery and cultural stops.',
                'description': 'Start in Bishkek, hike in Ala-Archa, visit Issyk-Kul, and finish with a night near Song-Kol.',
                'duration_days': 7, 'difficulty': 'moderate', 'regions': ['chuy', 'issyk-kul', 'naryn'],
                'categories': ['trekking', 'cultural'], 'tour': 'ala-archa-weekend-escape',
                'price_from': '850.00', 'highlights': ['Ala-Archa hiking', 'Issyk-Kul shoreline', 'Song-Kol high pastures'],
                'days': [
                    ('Bishkek arrival', 'Meet in Bishkek and prepare for the mountain route.', ['City walk', 'Trip briefing']),
                    ('Ala-Archa National Park', 'Spend the day on a mountain trail in the gorge.', ['Hiking', 'Picnic']),
                    ('Burana and Issyk-Kul', 'Visit the Burana archaeological site before driving to the lake.', ['History', 'Lake shore']),
                    ('Issyk-Kul villages', 'Explore the north shore and nearby villages.', ['Local visit', 'Scenic drive']),
                    ('Journey to Song-Kol', 'Travel up to the high pasture and settle into a yurt camp.', ['Mountain drive', 'Yurt stay']),
                    ('Song-Kol', 'Enjoy a flexible day by the lake and pasture.', ['Walk', 'Horse riding']),
                    ('Return to Bishkek', 'Drive back to the capital.', ['Scenic drive']),
                ],
            },
            {
                'slug': 'southern-heritage-route', 'title': 'Southern Heritage Route',
                'title_kg': 'Түштүк мурас жолу', 'title_ru': 'Маршрут наследия юга',
                'short_description': 'A sample five-day route through Osh, Batken, and Jalal-Abad regions.',
                'description': 'Discover southern Kyrgyzstan through mountain scenery, historic sites, and village visits.',
                'duration_days': 5, 'difficulty': 'easy', 'regions': ['osh', 'batken', 'jalal-abad'],
                'categories': ['cultural', 'jeep'], 'tour': 'issyk-kul-beach-wellness',
                'price_from': '620.00', 'highlights': ['Sulaiman-Too', 'Aigul-Tash area', 'Arslanbob forest'],
                'days': [
                    ('Osh', 'Explore the old city and Sulaiman-Too.', ['City walk', 'Historic site']),
                    ('Batken', 'Travel west through the southern valley landscapes.', ['Scenic drive', 'Local market']),
                    ('Aigul-Tash area', 'Visit the mountain landscape around Batken.', ['Nature walk', 'Photography']),
                    ('Arslanbob', 'Travel to the walnut forest region.', ['Village visit', 'Forest walk']),
                    ('Return journey', 'Finish the route with a flexible departure day.', ['Transfer']),
                ],
            },
        ]
        for item in itineraries_data:
            itinerary, _ = Itinerary.objects.update_or_create(
                slug=item['slug'],
                defaults={
                    'title': item['title'], 'title_kg': item['title_kg'], 'title_ru': item['title_ru'],
                    'short_description': item['short_description'], 'description': item['description'],
                    'duration_days': item['duration_days'], 'difficulty': item['difficulty'],
                    'price_from': item['price_from'], 'currency': 'USD',
                    'highlights': item['highlights'], 'day_by_day': [
                        {'day': index, 'title': day[0], 'description': day[1], 'activities': day[2]}
                        for index, day in enumerate(item['days'], start=1)
                    ],
                    'included': ['Ground transport', 'Local guide'],
                    'not_included': ['International flights', 'Personal expenses'],
                    'is_featured': item['slug'] == 'week-in-the-tian-shan', 'is_active': True,
                    'order': 1 if item['slug'] == 'week-in-the-tian-shan' else 2,
                },
            )
            itinerary.regions.set(region_map[slug] for slug in item['regions'])
            itinerary.categories.set(category_map[slug] for slug in item['categories'])
            itinerary.tours.set([Tour.objects.get(slug=item['tour'])])
            for day_number, (title, description, activities) in enumerate(item['days'], start=1):
                ItineraryDay.objects.update_or_create(
                    itinerary=itinerary,
                    day_number=day_number,
                    defaults={
                        'title': title, 'title_ru': title, 'title_kg': title,
                        'description': description, 'activities': activities,
                        'accommodation': 'Local guesthouse or yurt camp',
                        'meals': [],
                    },
                )

        guide, _ = Guide.objects.update_or_create(
            slug='sample-local-guide',
            defaults={
                'first_name': 'Sample', 'last_name': 'Guide',
                'bio': 'Sample catalogue entry. Replace this profile with a real guide before launch.',
                'bio_ru': 'Демонстрационная запись. Перед запуском замените её профилем реального гида.',
                'specializations': ['trekking', 'cultural'], 'languages': ['en', 'ru', 'kg'],
                'experience_years': 0, 'certification': '', 'rating': 0, 'reviews_count': 0,
                'price_per_day': '0.00', 'currency': 'USD', 'is_verified': False,
                'is_active': True, 'is_featured': False,
            },
        )
        guide.regions.set(region_map.values())

        vehicle, _ = Vehicle.objects.update_or_create(
            slug='sample-4x4',
            defaults={
                'name': 'Sample 4x4 vehicle', 'vehicle_type': 'suv',
                'brand': 'Sample', 'model': '4x4', 'seats': 4,
                'fuel_type': 'diesel', 'has_ac': True, 'has_4wd': True,
                'description': 'Sample catalogue entry. Replace with a real vehicle and verified rates before launch.',
                'price_per_day': '0.00', 'price_per_km': '0.00', 'currency': 'USD',
                'includes_driver': True, 'driver_languages': ['en', 'ru'],
                'is_available': True, 'is_active': True,
            },
        )
        vehicle.regions.set(region_map.values())

        YurtCamp.objects.update_or_create(
            slug='sample-yurt-camp',
            defaults={
                'name': 'Sample yurt camp', 'name_kg': 'Үлгү боз үй лагери', 'name_ru': 'Пример юрточного лагеря',
                'short_description': 'Sample catalogue entry; replace with a verified camp listing.',
                'description': 'Demonstration record only. Confirm amenities, contacts, and prices before publishing.',
                'region': region_map['naryn'], 'latitude': '41.870000', 'longitude': '75.250000',
                'elevation': 3016, 'accommodation_type': 'traditional', 'capacity': 4, 'yurts_count': 1,
                'has_shared_bathroom': True, 'has_electricity': False,
                'price_per_night': '0.00', 'currency': 'USD',
                'meals_included': [], 'activities_offered': ['Horse riding', 'Lake walks'],
                'best_season': 'July-August', 'is_cbt': True, 'rating': 0, 'reviews_count': 0,
                'is_featured': False, 'is_active': True, 'order': 1,
            },
        )

        event_start = timezone.now() + timedelta(days=60)
        Event.objects.update_or_create(
            slug='sample-cultural-event',
            defaults={
                'title': 'Sample cultural event', 'title_kg': 'Үлгү маданий иш-чара',
                'title_ru': 'Пример культурного события',
                'short_description': 'Sample event record. Replace with a confirmed event and date before launch.',
                'description': 'Demonstration record only; this is not a real event announcement.',
                'event_type': 'cultural', 'region': region_map['chuy'], 'location': 'Bishkek area',
                'start_date': event_start, 'end_date': event_start + timedelta(days=1),
                'is_recurring': False, 'is_free': True, 'organizer': 'Sample listing',
                'tags': ['sample'], 'is_featured': False, 'is_active': True, 'is_published': True,
            },
        )

        self.stdout.write(self.style.SUCCESS(
            'Demo catalog data seeded. Replace sample service and event entries before launch. '
            'Booking, payment, and visitor review tables are intentionally left empty.'
        ))
