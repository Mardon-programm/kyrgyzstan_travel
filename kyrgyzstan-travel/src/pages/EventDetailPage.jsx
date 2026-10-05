import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Clock, Tag, ArrowLeft, ArrowRight, Ticket, Music, Trophy, Coffee, Share2, Heart, Eye, MapPin as MapPinIcon } from 'lucide-react';
import { useEvents } from '../hooks/useApi';

const eventTypeIcons = {
  festival: Music,
  cultural: Trophy,
  sport: Trophy,
  workshop: Coffee,
  market: 'Tag',
  other: Calendar,
};

const eventTypeLabels = {
  festival: 'events.types.festival',
  cultural: 'events.types.cultural',
  sport: 'events.types.sport',
  workshop: 'events.types.workshop',
  market: 'events.types.market',
  other: 'events.types.other',
};

export default function EventDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams();

  const { data: event, loading, error } = useEvents({ slug });

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

  if (error || !event) {
    return (
      <div className="py-20 lg:py-32 bg-graphite text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-white/60 mb-4">{t('common.error')}</div>
          <Link to="/events" className="btn-primary">{t('common.back')}</Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const isUpcoming = new Date(event.start_date) > new Date();
  const isOngoing = new Date(event.start_date) <= new Date() && new Date(event.end_date) >= new Date();

  return (
    <article className="bg-graphite min-h-screen">
      <header className="relative aspect-[16/9] max-w-7xl mx-auto">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-graphite/90 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur text-white/90 text-sm border border-white/20 flex items-center gap-1">
                <span data-lucide={eventTypeIcons[event.event_type] || 'Calendar'} className="w-3 h-3" aria-hidden="true" />
                {t(eventTypeLabels[event.event_type] || event.event_type)}
              </span>
              {event.is_featured && (
                <span className="px-3 py-1 rounded-lg bg-gold/20 text-gold text-sm border border-gold/30 flex items-center gap-1">
                  <span data-lucide="star" className="w-3 h-3 fill-current" />
                  {t('common.featured')}
                </span>
              )}
              {event.is_free && (
                <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm border border-green-500/30 flex items-center gap-1">
                  <Ticket className="w-3 h-3" aria-hidden="true" />
                  {t('events.free')}
                </span>
              )}
              {event.tags?.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur text-white/90 text-sm border border-white/20">#{tag}</span>
              ))}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/70">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span>{formatDate(event.start_date)} - {formatDate(event.end_date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" aria-hidden="true" />
                <span>{formatTime(event.start_date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4" aria-hidden="true" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {event.tags?.map((tag) => (
                  <Link key={tag} to={`/events?search=${tag}`} className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur text-white/90 text-sm border border-white/20 hover:bg-white/20">#{tag}</Link>
                ))}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">{event.title}</h1>
              <p className="text-white/70 text-lg leading-relaxed">{event.description}</p>
            </div>

            <div className="border-t border-white/10 pt-8">
              <h2 className="font-display text-2xl font-bold text-white mb-6">{t('events.details')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-terracotta" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">{t('events.dates')}</p>
                      <p className="font-medium text-white">{formatDate(event.start_date)} - {formatDate(event.end_date)}</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-terracotta" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">{t('events.time')}</p>
                      <p className="font-medium text-white">{formatTime(event.start_date)}</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items-center justify-center">
                      <MapPinIcon className="w-6 h-6 text-terracotta" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">{t('events.location')}</p>
                      <p className="font-medium text-white">{event.location}</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items-center justify-center">
                      <Ticket className="w-6 h-6 text-terracotta" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">{t('events.price')}</p>
                      <p className="font-medium text-white">
                        {event.is_free ? t('events.free') : `${event.price} {event.currency}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {event.organizer && (
              <div className="border-t border-white/10 pt-8">
                <h2 className="font-display text-2xl font-bold text-white mb-6">{t('events.organizer')}</h2>
                <div className="glass-card p-6 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-terracotta/20 flex items-center justify-center">
                    <span className="font-display text-2xl font-bold text-terracotta">{event.organizer.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white mb-1">{event.organizer}</h3>
                    {event.organizer_contact && <p className="text-white/60 text-sm">{event.organizer_contact}</p>}
                    {event.website && <a href={event.website} target="_blank" rel="noopener noreferrer" className="text-terracotta hover:underline text-sm mt-1 inline-block">{t('events.visitWebsite')}</a>}
                  </div>
                </div>
              </div>
            )}

            {event.is_recurring && (
              <div className="border-t border-white/10 pt-8">
                <h2 className="font-display text-2xl font-bold text-white mb-6">{t('events.recurring')}</h2>
                <p className="text-white/70">{event.recurrence_rule || t('events.recursYearly')}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 glass-card p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-sm">{t('events.status')}</p>
                  <p className="font-display text-lg font-bold text-white">
                    {isUpcoming ? t('events.upcoming') : isOngoing ? t('events.ongoing') : t('events.ended')}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-4">
                <div className="glass p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">{t('events.dates')}</span>
                    <span className="text-white font-medium">{formatDate(event.start_date)} - {formatDate(event.end_date)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">{t('events.time')}</span>
                    <span className="text-white font-medium">{event.start_date ? formatTime(event.start_date) : 'TBD'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">{t('events.location')}</span>
                    <span className="text-white font-medium">{event.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">{t('events.region')}</span>
                    <span className="text-white font-medium">{event.region?.name || event.region}</span>
                  </div>
                  {event.price && !event.is_free && (
                    <div className="topo-divider" />
                  )}
                  {event.price && !event.is_free && (
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">{t('events.price')}</span>
                      <span className="text-terracotta">{event.price} {event.currency}</span>
                    </div>
                  )}
                  {event.is_free && (
                    <div className="topo-divider" />
                  )}
                  {event.is_free && (
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">{t('events.price')}</span>
                      <span className="text-green-400">{t('events.free')}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Link to="/events" className="btn-secondary flex-1 flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    {t('common.backToEvents')}
                  </Link>
                  <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" aria-hidden="true" />
                    {t('events.addToFavorites')}
                  </button>
                </div>

                <div className="border-t border-white/10 pt-4 flex gap-4">
                  <button className="btn-ghost flex-1 flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" aria-hidden="true" />
                    {t('events.share')}
                  </button>
                  <button className="btn-ghost flex-1 flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" aria-hidden="true" />
                    {t('events.remindMe')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}