import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Tag, ArrowRight, Clock, Filter, ChevronDown, X, Music, Trophy, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEvents, useUpcomingEvents } from '../hooks/useApi';

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

export default function EventsPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    region: '',
    event_type: '',
    upcoming: 'true',
    free: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data, loading, error, refetch } = useEvents(filters);
  const { data: upcomingData } = useUpcomingEvents();

  const hasActiveFilters = Object.values(filters).some(v => v);

  if (loading) {
    return (
      <div className="py-20 lg:py-32 bg-graphite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="section-title mb-4">{t('events.title')}</h1>
            <p className="section-subtitle mx-auto">{t('events.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 lg:py-32 bg-graphite text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-white/60 mb-4">{t('common.error')}</div>
          <button onClick={refetch} className="btn-primary">{t('common.retry')}</button>
        </div>
      </div>
    );
  }

  const events = data?.results || [];

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const formatDateTime = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const eventTypeIcons = {
    festival: 'Music',
    cultural: 'Trophy',
    sport: 'Trophy',
    workshop: 'Coffee',
    market: 'Tag',
    other: 'Calendar',
  };

  return (
    <div className="py-20 lg:py-32 bg-graphite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <h1 className="section-title mb-2">{t('events.title')}</h1>
            <p className="section-subtitle">{t('events.subtitle')}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${showFilters ? 'bg-terracotta text-white' : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'}`}
            >
              <Filter className="w-4 h-4" aria-hidden="true" />
              <span>{t('common.filter')}</span>
              {Object.values(filters).filter(v => v).length > 0 && <span className="px-2 py-0.5 rounded-full bg-terracotta text-white text-xs">{Object.values(filters).filter(v => v).length}</span>}
            </button>
            <button className="btn-secondary" onClick={() => setFilters({ region: '', event_type: '', upcoming: 'true', free: '' })} disabled={!Object.values(filters).filter(v => v).length}>
              <X className="w-4 h-4 mr-2" />
              {t('common.clear')}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="glass-card p-6 mb-8 animate-slide-down">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">{t('common.region')}</label>
                <select
                  value={filters.region}
                  onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                  className="select-field"
                >
                  <option value="">{t('common.allRegions')}</option>
                  <option value="issyk-kul">{t('regions.issyk-kul')}</option>
                  <option value="naryn">{t('regions.naryn')}</option>
                  <option value="osh">{t('regions.osh')}</option>
                  <option value="chuy">{t('regions.chuy')}</option>
                  <option value="talas">{t('regions.talas')}</option>
                  <option value="jalal-abad">{t('regions.jalal-abad')}</option>
                  <option value="batken">{t('regions.batken')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">{t('events.type')}</label>
                <select
                  value={filters.event_type}
                  onChange={(e) => setFilters({ ...filters, event_type: e.target.value })}
                  className="select-field"
                >
                  <option value="">{t('common.allCategories')}</option>
                  <option value="festival">{t('events.types.festival')}</option>
                  <option value="cultural">{t('events.types.cultural')}</option>
                  <option value="sport">{t('events.types.sport')}</option>
                  <option value="workshop">{t('events.types.workshop')}</option>
                  <option value="market">{t('events.types.market')}</option>
                  <option value="other">{t('events.types.other')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">{t('events.status')}</label>
                <select
                  value={filters.upcoming}
                  onChange={(e) => setFilters({ ...filters, upcoming: e.target.value })}
                  className="select-field"
                >
                  <option value="true">{t('events.upcomingOnly')}</option>
                  <option value="false">{t('events.all')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">{t('events.price')}</label>
                <select
                  value={filters.free}
                  onChange={(e) => setFilters({ ...filters, free: e.target.value })}
                  className="select-field"
                >
                  <option value="">{t('common.all')}</option>
                  <option value="true">{t('events.freeOnly')}</option>
                  <option value="false">{t('events.paidOnly')}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <article
              key={event.id}
              className="glass-card p-0 overflow-hidden relative group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
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
                      <span data-lucide={eventTypeIcons[event.event_type] || 'Calendar'} className="w-3 h-3" aria-hidden="true" />
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
                        <span data-lucide="ticket" className="w-3 h-3" aria-hidden="true" />
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
                    {new Date(event.start_date) > new Date() ? t('events.upcoming') : new Date(event.start_date) <= new Date() && new Date(event.end_date) >= new Date() ? t('events.ongoing') : t('events.ended')}
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
                    <span data-lucide="clock" className="w-4 h-4" aria-hidden="true" />
                    <span>{event.start_date && formatDateTime(event.start_date)}</span>
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
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/60 mb-4">{t('common.noResults')}</p>
            <button onClick={() => setFilters({ region: '', event_type: '', upcoming: 'true', free: '' })} className="btn-primary">{t('common.clear')}</button>
          </div>
        )}
      </div>
    </div>
  );
}