import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Filter, ChevronDown, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDestinations, useRegions } from '../hooks/useApi';

export default function DestinationsPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ region: '', category: '' });
  const [showFilters, setShowFilters] = useState(false);

  const { data: destinationsData, loading: destLoading, error: destError } = useDestinations(filters);
  const { data: regionsData, loading: regLoading } = useRegions();

  const hasActiveFilters = Object.values(filters).some(v => v);

  if (destLoading || regLoading) {
    return (
      <div className="py-20 lg:py-32 bg-graphite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="section-title mb-4">{t('destinations.title')}</h1>
            <p className="section-subtitle mx-auto">{t('destinations.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

  if (destError) {
    return (
      <div className="py-20 lg:py-32 bg-graphite text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-white/60 mb-4">{t('common.error')}</div>
        </div>
      </div>
    );
  }

  const destinations = destinationsData?.results || [];
  const regions = regionsData?.results || [];

  return (
    <div className="py-20 lg:py-32 bg-graphite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <h1 className="section-title mb-2">{t('destinations.title')}</h1>
            <p className="section-subtitle">{t('destinations.subtitle')}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${showFilters ? 'bg-terracotta text-white' : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'}`}
            >
              <Filter className="w-4 h-4" aria-hidden="true" />
              <span>{t('common.filter')}</span>
              {hasActiveFilters && <span className="px-2 py-0.5 rounded-full bg-terracotta text-white text-xs">{Object.values(filters).filter(v => v).length}</span>}
            </button>
            <button className="btn-secondary" onClick={() => setFilters({ region: '', category: '' })} disabled={!hasActiveFilters}>
              <X className="w-4 h-4 mr-2" />
              {t('common.clear')}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="glass-card p-6 mb-8 animate-slide-down">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">{t('common.region')}</label>
                <select
                  value={filters.region}
                  onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                  className="select-field"
                >
                  <option value="">{t('common.allRegions')}</option>
                  {regions.map(r => <option key={r.slug} value={r.slug}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">{t('common.category')}</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="select-field"
                >
                  <option value="">{t('common.allCategories')}</option>
                  <option value="lakes">{t('destinationsMap.categories.lakes')}</option>
                  <option value="gorges">{t('destinationsMap.categories.gorges')}</option>
                  <option value="history">{t('destinationsMap.categories.history')}</option>
                  <option value="yurts">{t('destinationsMap.categories.yurts')}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination, index) => (
            <article
              key={destination.id}
              className="glass-card p-0 overflow-hidden relative group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Link to={`/destinations/${destination.slug}`}>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={destination.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'}
                    alt={`${destination.name} destination`}
                    className="w-full h-full object-cover hover-zoom"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {destination.tags?.map((tag) => (
                      <span key={tag.id} className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur text-white/90 text-xs border border-white/20">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <MapPin className="w-4 h-4 text-terracotta" aria-hidden="true" />
                      <span>{destination.region?.name || destination.region}</span>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-white/50 text-sm mb-1">{destination.region?.name || destination.region}</p>
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-terracotta transition-colors line-clamp-1">
                    {destination.name}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {destination.tags?.map((tag) => (
                    <span key={tag.id} className="px-2.5 py-1 rounded-lg bg-white/5 text-white/70 text-xs border border-white/10">
                      {tag.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <MapPin className="w-4 h-4 text-terracotta" aria-hidden="true" />
                    <span>{destination.elevation ? `${destination.elevation.toLocaleString()}m` : ''}</span>
                  </div>
                  <Link to={`/destinations/${destination.slug}`} className="btn-primary px-4 py-2 text-sm">
                    {t('common.viewDetails')}
                    <span className="w-4 h-4 ml-1" aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {destinations.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/60 mb-4">{t('common.noResults')}</p>
            <button onClick={() => setFilters({ region: '', category: '' })} className="btn-primary">{t('common.clear')}</button>
          </div>
        )}
      </div>
    </div>
  );
}