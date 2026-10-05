import { Calendar, MapPin, Tag, ArrowRight, Clock, Eye, Ticket, Music, Trophy, Coffee } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFeaturedEvents, useUpcomingEvents } from '../hooks/useApi';
import { Link } from 'react-router-dom';

const eventTypeIcons = {
  festival: Music,
  cultural: Trophy,
  sport: Trophy,
  workshop: Coffee,
  market: Tag,
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

export default function EventsSection() {
  const { t } = useTranslation();
  const { data: featuredData, loading: featuredLoading } = useFeaturedEvents();
  const { data: upcomingData, loading: upcomingLoading } = useUpcomingEvents();

  const featuredEvents = featuredData?.results || [];
  const upcomingEvents = upcomingData?.results || [];

  if (featuredLoading && upcomingLoading) {
    return (
      <section id="events" className="py-20 lg:py-32 bg-graphite" aria-labelledby="events-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 id="events-title" className="section-title">{t('events.title')}</h2>
            <p className="section-subtitle mx-auto">{t('events.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <article key={i} className="glass-card p-0 overflow-hidden relative animate-pulse">
                <div className="aspect-[16/10] bg-white/5" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const featuredEventsList = featuredEvents;
  const upcomingEventsList = upcomingEvents.filter(e => !featuredEventsList.some(f => f.id === e.id)).slice(0, 6);

  if (featuredEventsList.length === 0 && upcomingEventsList.length === 0) {
    return null;
  }

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const formatDateTime = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const EventCard = ({ event, isFeatured = false }) => {
    const Icon = eventTypeIcons[event.event_type] || Calendar;
    const isUpcoming = new Date(event.start_date) > new Date();
    const isOngoing = new Date(event.start_date) <= new Date() && new Date(event.end_date) >= new Date();

    return (
      <article className={`glass-card p-0 overflow-hidden relative group animate-slide-up ${isFeatured ? 'ring-2 ring-terracotta/50' : ''}`}>
        <Link to={`/events/${event.slug}`}>
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={event.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'}
              alt={event.title}
              className="w-full h-full object-cover hover-zoom"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-transparent to-transparent" />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur text-white/90 text-xs border border-white/20 flex items-center gap-1">
                <Icon className="w-3 h-3" aria-hidden="true" />
                {t(eventTypeLabels[event.event_type] || event.event_type)}
              </span>
              {event.is_featured && (
                <span className="px-2.5 py-1 rounded-lg bg-gold/20 text-gold text-xs border border-gold/30 flex items-center gap-1">
                  <span data-lucide="star" className="w-3 h-3 fill-current" />
                  {t('common.featured')}
                </span>
              )}
              {event.is_free && (
                <span className="px-2.5 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs border border-green-500/30 flex items-center gap-1">
                  <Ticket className="w-3 h-3" aria-hidden="true" />
                  {t('events.free')}
                </span>
              )}
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <MapPin className="w-4 h-4 text-terracotta" aria-hidden="true" />
                <span>{event.region?.name || event.region}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span>{formatDate(event.start_date)}</span>
              </div>
            </div>
          </div>
        </Link>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-terracotta/20 text-terracotta text-xs">
              {isUpcoming ? t('events.upcoming') : isOngoing ? t('events.ongoing') : t('events.ended')}
            </span>
            {event.tags && event.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="px-2 py-1 rounded bg-white/5 text-white/70 text-xs border border-white/10">#{tag}</span>
            ))}
          </div>
          <h3 className="font-display text-lg font-bold text-white group-hover:text-terracotta transition-colors line-clamp-2">
            {event.title}
          </h3>
          <p className="text-white/60 text-sm line-clamp-2">{event.short_description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 border-t border-white/10 pt-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>{formatDate(event.start_date)} - {formatDate(event.end_date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span>{formatDateTime(event.start_date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>{event.location}</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            {event.price && !event.is_free && (
              <div className="flex items-baseline gap-1">
                <span className="font-display text-lg font-bold text-white">{event.price}</span>
                <span className="text-white/50">/{event.currency}</span>
              </div>
            )}
            <Link to={`/events/${event.slug}`} className="btn-primary px-4 py-2 text-sm">
              {t('events.viewDetails')}
              <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>
    );
  };

  if (!featuredEventsList.length && !upcomingEventsList.length) {
    return null;
  }

  return (
    <section id="events" className="py-20 lg:py-32 bg-graphite-card" aria-labelledby="events-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <h2 id="events-title" className="section-title">{t('events.title')}</h2>
            <p className="section-subtitle">{t('events.subtitle')}</p>
          </div>
          <Link to="/events" className="btn-secondary inline-flex items-center gap-2">
            {t('events.viewAll')}
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>

        {featuredEventsList.length > 0 && (
          <div className="mb-12">
            <h3 className="font-display text-xl font-bold text-white mb-6">{t('events.featured')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEventsList.map((event, index) => (
                <EventCard key={event.id} event={event} isFeatured />
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="font-display text-xl font-bold text-white mb-6">{t('events.upcoming')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEventsList.map((event, index) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/events" className="btn-secondary inline-flex items-center gap-2">
            {t('events.viewAll')}
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}