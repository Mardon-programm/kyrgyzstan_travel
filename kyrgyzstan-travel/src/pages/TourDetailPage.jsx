import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Users, MapPin, Star, ArrowRight, ArrowLeft, Check, ChevronDown, ChevronUp, CreditCard, Loader2, X } from 'lucide-react';
import { useTour } from '../hooks/useApi';
import { useBooking } from '../context/BookingContext';

const difficultyLabels = {
  easy: 'tours.difficultyLevels.easy',
  light: 'tours.difficultyLevels.light',
  moderate: 'tours.difficultyLevels.moderate',
  challenging: 'tours.difficultyLevels.challenging',
  extreme: 'tours.difficultyLevels.extreme',
};

export default function TourDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { openBooking } = useBooking();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedDay, setExpandedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const { data: tour, loading, error, refetch } = useTour(slug);

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

  if (error || !tour) {
    return (
      <div className="py-20 lg:py-32 bg-graphite text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-white/60 mb-4">{t('common.error')}</div>
          <Link to="/tours" className="btn-primary">{t('common.back')}</Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-graphite min-h-screen">
      <div className="relative aspect-[16/9] max-w-7xl mx-auto">
        <img
          src={tour.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'}
          alt={`${tour.title} tour`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-graphite/90 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {tour.tags?.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur text-white/90 text-sm border border-white/20">{tag}</span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <span className="badge-terracotta">{t(difficultyLabels[tour.difficulty] || tour.difficulty)}</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current text-gold" aria-hidden="true" />
                <span>{tour.rating}</span>
                <span className="text-white/40">({tour.reviews_count} {t('common.reviews')})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <p className="text-white/50 text-sm mb-2">{tour.region?.name || tour.region}</p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">{tour.title}</h1>
              <p className="text-white/70 text-lg leading-relaxed">{tour.description || tour.short_description}</p>
            </div>

            <div className="border-t border-white/10 pt-8">
              <h2 className="font-display text-2xl font-bold text-white mb-6">{t('tours.details')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-terracotta" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">{t('tours.duration')}</p>
                      <p className="font-medium text-white">{tour.duration_days} {tour.duration_days === 1 ? 'day' : 'days'} / {tour.duration_nights} {tour.duration_nights === 1 ? 'night' : 'nights'}</p>
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
                      <p className="font-medium text-white">{tour.min_group_size}–{tour.max_group_size} {t('common.people')}</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-terracotta" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">{t('tours.difficulty')}</p>
                      <p className="font-medium text-white">{t(difficultyLabels[tour.difficulty] || tour.difficulty)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <h2 className="font-display text-2xl font-bold text-white mb-6">{t('tours.highlights')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tour.highlights?.map((highlight, i) => (
                  <div key={i} className="glass-card p-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-terracotta/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-5 h-5 text-terracotta" aria-hidden="true" />
                    </div>
                    <span className="text-white/90">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {tour.itinerary && tour.itinerary.length > 0 && (
              <div className="border-t border-white/10 pt-8">
                <h2 className="font-display text-2xl font-bold text-white mb-6">{t('tours.itinerary')}</h2>
                <div className="space-y-4">
                  {tour.itinerary.map((day, index) => (
                    <div key={index} className="glass-card overflow-hidden">
                      <button
                        onClick={() => setExpandedDay(expandedDay === index ? null : index)}
                        className="w-full p-6 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items-center justify-center">
                            <span className="font-display text-xl font-bold text-terracotta">Day {index + 1}</span>
                          </div>
                          <div>
                            <h3 className="font-display text-lg font-bold text-white">{day.title || `Day ${index + 1}`}</h3>
                            <p className="text-white/50 text-sm">{day.location || ''}</p>
                          </div>
                        </div>
                        <span className={expandedDay === index ? 'text-terracotta' : 'text-white/50'}>
                          {expandedDay === index ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                        </span>
                      </button>
                      {expandedDay === index && (
                        <div className="border-t border-white/10 px-6 pb-6">
                          <p className="text-white/70 mb-4">{day.description}</p>
                          {day.activities && day.activities.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-medium text-white/90">{t('tours.activities')}</h4>
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
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tour.included && tour.included.length > 0 && (
              <div className="border-t border-white/10 pt-8">
                <h2 className="font-display text-2xl font-bold text-white mb-6">{t('tours.included')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tour.included.map((item, i) => (
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

            {tour.not_included && tour.not_included.length > 0 && (
              <div className="border-t border-white/10 pt-8">
                <h2 className="font-display text-2xl font-bold text-white mb-6">{t('tours.notIncluded')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tour.not_included.map((item, i) => (
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
                  <p className="text-white/50 text-sm">{t('tours.price.from')}</p>
                  <p className="font-display text-3xl font-bold text-white">${tour.price} <span className="text-white/50 text-lg">/{tour.currency}</span></p>
                  <p className="text-white/50 text-sm mt-1">{t('tours.price.perPerson')}</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-4">
                {tour.dates && tour.dates.length > 0 ? (
                  <>
                    <label className="block text-sm font-medium text-white">{t('booking.form.date')}</label>
                    <select
                      value={selectedDate || ''}
                      onChange={(e) => setSelectedDate(e.target.value || null)}
                      className="select-field"
                    >
                      <option value="">{t('common.selectDate')}</option>
                      {tour.dates
                        .filter(d => d.is_active && d.available_spots > 0)
                        .map((date) => (
                          <option key={date.id} value={date.start_date}>
                            {formatDate(date.start_date)} — {formatDate(date.end_date)} ({date.available_spots} {t('common.spotsLeft')}) {date.is_guaranteed && `✓ ${t('common.guaranteed')}`}
                          </option>
                        ))}
                    </select>
                    {selectedDate && (
                      <div className="glass p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">{t('booking.summary.guests')}</span>
                          <span className="text-white font-medium">2 {t('common.people')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">{t('booking.summary.pricePerPerson')}</span>
                          <span className="text-white font-medium">${tour.price} {tour.currency}</span>
                        </div>
                        <div className="topo-divider" />
                        <div className="flex justify-between text-lg font-bold">
                          <span className="text-white">{t('booking.summary.total')}</span>
                          <span className="text-terracotta">${tour.price * 2} {tour.currency}</span>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => selectedDate && openBooking(tour, tour.dates.find(d => d.start_date === selectedDate))}
                      disabled={!selectedDate}
                      className="btn-primary w-full py-4 text-lg"
                    >
                      {t('tours.bookNow')}
                    </button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto text-white/30 mb-4" />
                    <p className="text-white/60">{t('tours.noDatesAvailable')}</p>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-6">
                <Link to="/tours" className="btn-secondary w-full flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  {t('common.backToTours')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}