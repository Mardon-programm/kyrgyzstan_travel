import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Users, MapPin, Filter, ChevronDown, X } from 'lucide-react';
import { useTours } from '../hooks/useApi';
import { useBooking } from '../context/BookingContext';

const difficultyLabels = {
  easy: 'tours.difficultyLevels.easy',
  light: 'tours.difficultyLevels.light',
  moderate: 'tours.difficultyLevels.moderate',
  challenging: 'tours.difficultyLevels.challenging',
  extreme: 'tours.difficultyLevels.extreme',
};

export default function ToursPage() {
  const { t } = useTranslation();
  const { openBooking } = useBooking();
  const [filters, setFilters] = useState({
    category: '',
    region: '',
    difficulty: '',
    minPrice: '',
    maxPrice: '',
    sort: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data, loading, error, refetch } = useTours(filters);

  const categories = useMemo(() => {
    if (!data?.results) return [];
    const cats = [...new Set(data.results.map(t => t.category?.slug).filter(Boolean))];
    return cats.map(slug => ({ slug, name: slug.charAt(0).toUpperCase() + slug.slice(1) }));
  }, [data]);

  const regions = useMemo(() => {
    if (!data?.results) return [];
    const regs = [...new Set(data.results.map(t => t.region?.slug).filter(Boolean))];
    return regs.map(slug => ({ slug, name: slug.charAt(0).toUpperCase() + slug.slice(1) }));
  }, [data]);

  const difficulties = ['easy', 'light', 'moderate', 'challenging', 'extreme'];

  const hasActiveFilters = Object.values(filters).some(v => v);

  if (loading) {
    return (
      <div className="py-20 lg:py-32 bg-graphite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="section-title mb-4">{t('tours.title')}</h1>
            <p className="section-subtitle mx-auto">{t('tours.subtitle')}</p>
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
                  <div className="flex justify-between pt-2">
                    <div className="h-8 bg-white/5 rounded w-24" />
                    <div className="h-10 bg-white/5 rounded w-32" />
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

  const tours = data?.results || [];

  return (
    <div className="py-20 lg:py-32 bg-graphite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <h1 className="section-title mb-2">{t('tours.title')}</h1>
            <p className="section-subtitle">{t('tours.subtitle')}</p>
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
            <button className="btn-secondary" onClick={() => setFilters({ category: '', region: '', difficulty: '', minPrice: '', maxPrice: '', sort: '' })} disabled={!hasActiveFilters}>
              <X className="w-4 h-4 mr-2" />
              {t('common.clear')}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="glass-card p-6 mb-8 animate-slide-down">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">{t('tours.category')}</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="select-field"
                >
                  <option value="">{t('common.all')}</option>
                  {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">{t('common.region')}</label>
                <select
                  value={filters.region}
                  onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                  className="select-field"
                >
                  <option value="">{t('common.all')}</option>
                  {regions.map(r => <option key={r.slug} value={r.slug}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">{t('tours.difficulty')}</label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                  className="select-field"
                >
                  <option value="">{t('common.all')}</option>
                  {difficulties.map(d => <option key={d} value={d}>{t(difficultyLabels[d])}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Min Price</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Max Price</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="input-field"
                  placeholder="10000"
                />
              </div>
            </div>
          </div>
        )}

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

        {(!tours || tours.length === 0) && (
          <div className="text-center py-16">
            <p className="text-white/60 mb-4">{t('common.noResults')}</p>
            <button onClick={() => setFilters({ category: '', region: '', difficulty: '', minPrice: '', maxPrice: '', sort: '' })} className="btn-primary">
              {t('common.clear')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}