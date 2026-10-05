import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Users, MapPin, Filter, ChevronDown, X, Star, ArrowRight, Mountain, Footprints, Car, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useItineraries } from '../hooks/useApi';

const difficultyLabels = {
  easy: 'itineraries.difficulty.easy',
  moderate: 'itineraries.difficulty.moderate',
  challenging: 'itineraries.difficulty.challenging',
  extreme: 'itineraries.difficulty.extreme',
};

const difficultyIcons = {
  easy: Footprints,
  moderate: Mountain,
  challenging: Mountain,
  extreme: Mountain,
};

export default function ItinerariesPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    region: '',
    category: '',
    difficulty: '',
    minPrice: '',
    maxPrice: '',
    minDuration: '',
    maxDuration: '',
    sort: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data, loading, error, refetch } = useItineraries(filters);

  const hasActiveFilters = useMemo(() => Object.values(filters).some(v => v), [filters]);

  if (loading) {
    return (
      <div className="py-20 lg:py-32 bg-graphite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="section-title mb-4">{t('itineraries.title')}</h1>
            <p className="section-subtitle mx-auto">{t('itineraries.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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

  const itineraries = data?.results || [];

  return (
    <div className="py-20 lg:py-32 bg-graphite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <h1 className="section-title mb-2">{t('itineraries.title')}</h1>
            <p className="section-subtitle">{t('itineraries.subtitle')}</p>
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
            <button className="btn-secondary" onClick={() => setFilters({ region: '', category: '', difficulty: '', minPrice: '', maxPrice: '', minDuration: '', maxDuration: '', sort: '' })} disabled={!hasActiveFilters}>
              <X className="w-4 h-4 mr-2" />
              {t('common.clear')}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="glass-card p-6 mb-8 animate-slide-down">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
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
                <label className="block text-xs font-medium text-white/50 mb-1.5">{t('common.category')}</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="select-field"
                >
                  <option value="">{t('common.allCategories')}</option>
                  <option value="trekking">{t('categories.trekking')}</option>
                  <option value="horse">{t('categories.horse')}</option>
                  <option value="jeep">{t('categories.jeep')}</option>
                  <option value="cultural">{t('categories.cultural')}</option>
                  <option value="mountaineering">{t('categories.mountaineering')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">{t('itineraries.difficulty')}</label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                  className="select-field"
                >
                  <option value="">{t('common.all')}</option>
                  <option value="easy">{t(difficultyLabels.easy)}</option>
                  <option value="moderate">{t(difficultyLabels.moderate)}</option>
                  <option value="challenging">{t(difficultyLabels.challenging)}</option>
                  <option value="extreme">{t(difficultyLabels.extreme)}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Min Price (USD)</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Max Price (USD)</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="input-field"
                  placeholder="10000"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Min Days</label>
                <input
                  type="number"
                  value={filters.minDuration}
                  onChange={(e) => setFilters({ ...filters, minDuration: e.target.value })}
                  className="input-field"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Max Days</label>
                <input
                  type="number"
                  value={filters.maxDuration}
                  onChange={(e) => setFilters({ ...filters, maxDuration: e.target.value })}
                  className="input-field"
                  placeholder="21"
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((itinerary, index) => (
            <article
              key={itinerary.id}
              className="glass-card p-0 overflow-hidden relative group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Link to={`/itineraries/${itinerary.slug}`}>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={itinerary.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'}
                    alt={`${itinerary.title} itinerary`}
                    className="w-full h-full object-cover hover-zoom"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur text-white/90 text-xs border border-white/20">
                      {itinerary.duration_days} {t('itineraries.days')}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur text-white/90 text-xs border border-white/20">
                      {t(difficultyLabels[itinerary.difficulty] || itinerary.difficulty)}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <MapPin className="w-4 h-4 text-terracotta" aria-hidden="true" />
                      <span>{itinerary.regions?.[0]?.name || itinerary.regions?.[0]}</span>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-white/50 text-sm mb-1">{itinerary.categories?.map(c => c.name).join(', ') || t('itineraries.multiCategory')}</p>
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-terracotta transition-colors line-clamp-1">
                    {itinerary.title}
                  </h3>
                </div>

                <p className="text-white/60 line-clamp-2">{itinerary.short_description}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 border-t border-white/10 pt-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    <span>{itinerary.duration_days} {t('itineraries.days')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" aria-hidden="true" />
                    <span>{itinerary.min_group_size}–{itinerary.max_group_size} {t('tours.groupSize')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mountain className="w-4 h-4" aria-hidden="true" />
                    <span>{t(difficultyLabels[itinerary.difficulty] || itinerary.difficulty)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-2xl font-bold text-white">{itinerary.price_from}</span>
                    <span className="text-white/50">/{itinerary.currency}</span>
                    <span className="text-white/50 text-sm ml-1">{t('itineraries.from')}</span>
                  </div>
                  <Link to={`/itineraries/${itinerary.slug}`} className="btn-primary px-5 py-2.5 text-sm">
                    {t('itineraries.viewDetails')}
                    <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {itineraries.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/60 mb-4">{t('common.noResults')}</p>
            <button onClick={() => setFilters({ region: '', category: '', difficulty: '', minPrice: '', maxPrice: '', minDuration: '', maxDuration: '', sort: '' })} className="btn-primary">{t('common.clear')}</button>
          </div>
        )}
      </div>
    </div>
  );
}