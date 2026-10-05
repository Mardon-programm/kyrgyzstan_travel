import { Calendar, Users, MapPin, Star, ArrowRight, Mountain, Flame } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTours, useFeaturedTours } from '../hooks/useApi';
import { useBooking } from '../context/BookingContext';

const difficultyLabels = {
  easy: 'tours.difficultyLevels.easy',
  light: 'tours.difficultyLevels.light',
  moderate: 'tours.difficultyLevels.moderate',
  challenging: 'tours.difficultyLevels.challenging',
  extreme: 'tours.difficultyLevels.extreme',
};

export default function ToursActivities() {
  const { t } = useTranslation();
  const { openBooking } = useBooking();
  const { data, loading, error, refetch } = useFeaturedTours();

  if (loading) {
    return (
      <section id="tours" className="py-20 lg:py-32 bg-graphite" aria-labelledby="tours-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 id="tours-title" className="section-title">{t('tours.title')}</h2>
            <p className="section-subtitle mx-auto">{t('tours.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <article key={i} className="glass-card p-0 overflow-hidden relative animate-pulse">
                <div className="aspect-[16/10] bg-white/5" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
                  <div className="flex gap-4">
                    <div className="h-4 bg-white/5 rounded w-20" />
                    <div className="h-4 bg-white/5 rounded w-24" />
                    <div className="h-4 bg-white/5 rounded w-28" />
                  </div>
                  <div className="flex justify-between pt-2">
                    <div className="h-8 bg-white/5 rounded w-24" />
                    <div className="h-10 bg-white/5 rounded w-32" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="tours" className="py-20 lg:py-32 bg-graphite" aria-labelledby="tours-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white/60 mb-4">{t('common.error')}</div>
          <button onClick={refetch} className="btn-primary">{t('common.retry')}</button>
        </div>
      </section>
    );
  }

  const tours = data?.results || [];

  return (
    <section id="tours" className="py-20 lg:py-32 bg-graphite" aria-labelledby="tours-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="tours-title" className="section-title">{t('tours.title')}</h2>
          <p className="section-subtitle mx-auto">{t('tours.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour, index) => (
            <article
              key={tour.id}
              className="glass-card p-0 overflow-hidden relative group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={tour.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'}
                  alt={`${tour.title} tour landscape`}
                  className="w-full h-full object-cover hover-zoom"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {tour.tags?.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur text-white/90 text-xs border border-white/20">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-white/90 text-sm font-medium">
                    <Star className="w-4 h-4 fill-current text-gold" aria-hidden="true" />
                    <span>{tour.rating}</span>
                    <span className="text-white/40">({tour.reviews_count})</span>
                  </div>
                  <span className="badge-terracotta">{t(difficultyLabels[tour.difficulty] || tour.difficulty)}</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-white/50 text-sm mb-1">{tour.region?.name || tour.region}</p>
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-terracotta transition-colors line-clamp-1">
                    {tour.title}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 border-t border-white/10 pt-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    <span>{tour.duration_days} {tour.duration_days === 1 ? 'day' : 'days'} / {tour.duration_nights} {tour.duration_nights === 1 ? 'night' : 'nights'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" aria-hidden="true" />
                    <span>{tour.min_group_size}–{tour.max_group_size} {t('tours.groupSize')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    <span>{t(difficultyLabels[tour.difficulty] || tour.difficulty)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-2xl font-bold text-white">{tour.price}</span>
                    <span className="text-white/50">/{tour.currency}</span>
                  </div>
                  <button
                    onClick={() => openBooking(tour)}
                    className="btn-primary px-5 py-2.5 text-sm"
                  >
                    {t('tours.bookNow')}
                    <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/tours" className="btn-secondary inline-flex items-center gap-2">
            {t('tours.viewAll')}
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}