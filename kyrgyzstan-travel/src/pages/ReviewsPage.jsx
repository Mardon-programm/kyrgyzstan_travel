import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Users, MapPin, Filter, ChevronDown, X, Star, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReviews } from '../hooks/useApi';

export default function ReviewsPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    tour_type: '',
    rating: '',
    sort: '-created_at',
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data, loading, error, refetch } = useReviews(filters);

  const hasActiveFilters = Object.values(filters).some(v => v);

  if (loading) {
    return (
      <div className="py-20 lg:py-32 bg-graphite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="section-title mb-4">{t('reviews.title')}</h1>
            <p className="section-subtitle mx-auto">{t('reviews.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <article key={i} className="glass-card p-6 animate-pulse">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-5 h-5 fill-current text-white/10" />
                  ))}
                </div>
                <div className="h-4 bg-white/5 rounded w-3/4 mb-4" />
                <div className="h-4 bg-white/5 rounded w-full mb-2" />
                <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-white/5" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/5 rounded w-24" />
                    <div className="h-3 bg-white/5 rounded w-20 mt-1" />
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

  const reviews = data?.results || [];

  return (
    <div className="py-20 lg:py-32 bg-graphite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <h1 className="section-title mb-2">{t('reviews.title')}</h1>
            <p className="section-subtitle">{t('reviews.subtitle')}</p>
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
            <button className="btn-secondary" onClick={() => setFilters({ tour_type: '', rating: '', sort: '-created_at' })} disabled={!Object.values(filters).some(v => v)}>
              <X className="w-4 h-4 mr-2" />
              {t('common.clear')}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="glass-card p-6 mb-8 animate-slide-down">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">{t('reviews.type')}</label>
                <select
                  value={filters.tour_type}
                  onChange={(e) => setFilters({ ...filters, tour_type: e.target.value })}
                  className="select-field"
                >
                  <option value="">{t('common.all')}</option>
                  <option value="tour">{t('reviews.types.tour')}</option>
                  <option value="destination">{t('reviews.types.destination')}</option>
                  <option value="guide">{t('reviews.types.guide')}</option>
                  <option value="general">{t('reviews.types.general')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">{t('reviews.rating')}</label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                  className="select-field"
                >
                  <option value="">{t('common.all')}</option>
                  <option value="5">{t('reviews.fiveStars')}</option>
                  <option value="4">{t('reviews.fourStars')}</option>
                  <option value="3">{t('reviews.threeStars')}</option>
                  <option value="2">{t('reviews.twoStars')}</option>
                  <option value="1">{t('reviews.oneStar')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">{t('common.sort')}</label>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                  className="select-field"
                >
                  <option value="-created_at">{t('reviews.newest')}</option>
                  <option value="created_at">{t('reviews.oldest')}</option>
                  <option value="-rating">{t('reviews.highestRated')}</option>
                  <option value="rating">{t('reviews.lowestRated')}</option>
                  <option value="-helpful_count">{t('reviews.mostHelpful')}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <article
              key={review.id}
              className="glass-card p-6 relative group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 fill-current ${s <= review.rating ? 'text-gold' : 'text-white/10'}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-2">{review.title || t('reviews.untitled')}</h3>
              <p className="text-white/70 mb-4 line-clamp-3">{review.comment}</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-terracotta/20 flex items-center justify-center">
                    <img src={review.author_avatar} alt={review.author_name} className="w-full h-full rounded-full" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{review.author_name}</p>
                    <p className="text-white/50 text-xs">{review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/60 mb-4">{t('common.noResults')}</p>
            <button onClick={() => setFilters({ tour_type: '', rating: '', sort: '-created_at' })} className="btn-primary">{t('common.clear')}</button>
          </div>
        )}
      </div>
    </div>
  );
}