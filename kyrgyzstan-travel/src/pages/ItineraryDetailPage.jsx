import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Users, MapPin, Star, ArrowLeft, Check, ArrowRight, Mountain, Footprints, Car, Home, Shield, Utensils, Bed, MapPin as MapPinIcon } from 'lucide-react';
import { useItinerary } from '../hooks/useApi';

const difficultyLabels = {
  easy: 'itineraries.difficulty.easy',
  moderate: 'itineraries.difficulty.moderate',
  challenging: 'itineraries.difficulty.challenging',
  extreme: 'itineraries.difficulty.extreme',
};

export default function ItineraryDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams();

  const { data: itinerary, loading, error } = useItinerary(slug);

  if (loading) {
    return (
      <div className="py-20 lg:py-32 bg-graphite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-pulse">
            <div className="aspect-[16/9] bg-white/5 rounded-2xl mb-8" />
            <div className="h-8 bg-white/5 rounded w-1/2 mx-auto mb-4" />
            <div className="h-4 bg-white/5 rounded w-1/3 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="py-20 lg:py-32 bg-graphite text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-white/60 mb-4">{t('common.error')}</div>
          <Link to="/itineraries" className="btn-primary">{t('common.back')}</Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => new Intl.NumberFormat().format(price);

  return (
    <div className="bg-graphite min-h-screen">
      <div className="relative aspect-[16/9] max-w-7xl mx-auto">
        <img
          src={itinerary.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'}
          alt={`${itinerary.title} itinerary`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-graphite/90 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur text-white/90 text-sm border border-white/20">
                {itinerary.duration_days} {t('itineraries.days')}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur text-white/90 text-sm border border-white/20">
                {t(difficultyLabels[itinerary.difficulty] || itinerary.difficulty)}
              </span>
              {itinerary.categories?.map((cat, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur text-white/90 text-sm border border-white/20">{cat.name}</span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <span className="badge-terracotta">{t(difficultyLabels[itinerary.difficulty] || itinerary.difficulty)}</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current text-gold" aria-hidden="true" />
                <span>{itinerary.price_from} {itinerary.currency} {t('itineraries.from')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <p className="text-white/50 text-sm mb-2">{itinerary.regions?.map(r => r.name).join(', ')}</p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">{itinerary.title}</h1>
              {itinerary.title_kg && <h2 className="text-xl text-white/70 mb-4 font-medium">{itinerary.title_kg}</h2>}
              <p className="text-white/70 text-lg leading-relaxed">{itinerary.description || itinerary.short_description}</p>
            </div>

            <div className="border-t border-white/10 pt-8">
              <h2 className="font-display text-2xl font-bold text-white mb-6">{t('itineraries.details')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-terracotta" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">{t('itineraries.duration')}</p>
                      <p className="font-medium text-white">{itinerary.duration_days} {t('itineraries.days')}</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-terracotta" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">{t('tours.groupSize')}</p>
                      <p className="font-medium text-white">{itinerary.min_group_size}–{itinerary.max_group_size} {t('common.people')}</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items_center justify-center">
                      <Mountain className="w-6 h-6 text-terracotta" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">{t('tours.difficulty')}</p>
                      <p className="font-medium text-white">{t(difficultyLabels[itinerary.difficulty] || itinerary.difficulty)}</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-terracotta" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">{t('itineraries.priceFrom')}</p>
                      <p className="font-medium text-white">${formatPrice(itinerary.price_from)} {itinerary.currency} {t('itineraries.from')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <h2 className="font-display text-2xl font-bold text-white mb-6">{t('itineraries.highlights')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {itinerary.highlights?.map((highlight, i) => (
                  <div key={i} className="glass-card p-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-terracotta/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-5 h-5 text-terracotta" aria-hidden="true" />
                    </div>
                    <span className="text-white/90">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {itinerary.days && itinerary.days.length > 0 && (
              <div className="border-t border-white/10 pt-8">
                <h2 className="font-display text-2xl font-bold text-white mb-6">{t('itineraries.dayByDay')}</h2>
                <div className="space-y-4">
                  {itinerary.days.map((day) => (
                    <div key={day.id} className="glass-card p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl bg-terracotta/20 flex items-center justify-center flex-shrink-0">
                          <span className="font-display text-2xl font-bold text-terracotta">Day {day.day_number}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-xl font-bold text-white">{day.title}</h3>
                          {day.location && <p className="text-white/60 text-sm">{day.location}</p>}
                        </div>
                      </div>
                      <p className="text-white/70 mb-4">{day.description}</p>

                      {day.activities && day.activities.length > 0 && (
                        <div className="space-y-2 mb-4">
                          <h4 className="font-medium text-white/90 flex items-center gap-2">
                            <Footprints className="w-4 h-4 text-terracotta" />
                            {t('itineraries.activities')}
                          </h4>
                          <ul className="space-y-2 pl-4">
                            {day.activities.map((activity, aIndex) => (
                              <li key={aIndex} className="flex items-center gap-2 text-white/80">
                                <span className="w-2 h-2 rounded-full bg-terracotta flex-shrink-0" />
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-6 text-sm text-white/60 border-t border-white/10 pt-4">
                        {day.accommodation && (
                          <div className="flex items-center gap-2">
                            <Bed className="w-4 h-4" aria-hidden="true" />
                            <span>{t('itineraries.accommodation')}: {day.accommodation}</span>
                          </div>
                        )}
                        {day.meals && day.meals.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Utensils className="w-4 h-4" aria-hidden="true" />
                            <span>{t('itineraries.meals')}: {day.meals.join(', ')}</span>
                          </div>
                        )}
                        {day.distance_km && (
                          <div className="flex items-center gap-2">
                            <Footprints className="w-4 h-4" aria-hidden="true" />
                            <span>{day.distance_km} km</span>
                          </div>
                        )}
                        {day.elevation_gain && (
                          <div className="flex items-center gap-2">
                            <Mountain className="w-4 h-4" aria-hidden="true" />
                            <span>+{day.elevation_gain}m</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {itinerary.included && itinerary.included.length > 0 && (
              <div className="border-t border-white/10 pt-8">
                <h2 className="font-display text-2xl font-bold text-white mb-6">{t('tours.included')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {itinerary.included.map((item, i) => (
                    <div key={i} className="glass-card p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-400" aria-hidden="true" />
                      </div>
                      <span className="text-white/90">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {itinerary.not_included && itinerary.not_included.length > 0 && (
              <div className="border-t border-white/10 pt-8">
                <h2 className="font-display text-2xl font-bold text-white mb-6">{t('tours.notIncluded')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {itinerary.not_included.map((item, i) => (
                    <div key={i} className="glass-card p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <X className="w-5 h-5 text-red-400" aria-hidden="true" />
                      </div>
                      <span className="text-white/90">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 glass-card p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-sm">{t('itineraries.priceFrom')}</p>
                  <p className="font-display text-3xl font-bold text-white">${formatPrice(itinerary.price_from)} <span className="text-white/50 text-lg">/{itinerary.currency}</span></p>
                  <p className="text-white/50 text-sm mt-1">{t('itineraries.perPerson')}</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-4">
                <div className="glass-card p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">{t('itineraries.duration')}</span>
                    <span className="text-white font-medium">{itinerary.duration_days} {t('itineraries.days')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">{t('tours.groupSize')}</span>
                    <span className="text-white font-medium">{itinerary.min_group_size}–{itinerary.max_group_size} {t('common.people')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">{t('tours.difficulty')}</span>
                    <span className="text-white font-medium">{t(difficultyLabels[itinerary.difficulty] || itinerary.difficulty)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">{t('itineraries.regions')}</span>
                    <span className="text-white font-medium">{itinerary.regions?.map(r => r.name).join(', ')}</span>
                  </div>
                </div>

                <Link to={`/booking/${itinerary.slug}`} className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2">
                  {t('itineraries.bookNow')}
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
              </div>

              <div className="border-t border-white/10 pt-6">
                <Link to="/itineraries" className="btn-secondary w-full flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  {t('common.backToItineraries')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}