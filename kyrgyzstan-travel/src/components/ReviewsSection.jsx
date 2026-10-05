import { Star, ArrowRight, ArrowLeft, Quote, User, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFeaturedReviews } from '../hooks/useApi';
import { Link } from 'react-router-dom';

export default function ReviewsSection() {
  const { t } = useTranslation();
  const { data, loading, error } = useFeaturedReviews();

  if (loading) {
    return (
      <section id="reviews" className="py-20 lg:py-32 bg-graphite-card" aria-labelledby="reviews-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 id="reviews-title" className="section-title">{t('reviews.title')}</h2>
            <p className="section-subtitle mx-auto">{t('reviews.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
      </section>
    );
  }

  if (error) {
    return null;
  }

  const reviews = data?.results || [];

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section id="reviews" className="py-20 lg:py-32 bg-graphite-card" aria-labelledby="reviews-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <h2 id="reviews-title" className="section-title">{t('reviews.title')}</h2>
            <p className="section-subtitle">{t('reviews.subtitle')}</p>
          </div>
          <Link to="/reviews" className="btn-secondary inline-flex items-center gap-2">
            {t('reviews.viewAll')}
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <article
                key={review.id}
                className="glass-card p-6 relative group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Quote className="w-10 h-10 text-terracotta/30 mb-4" aria-hidden="true" />
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
                      {review.author_avatar ? (
                        <img src={review.author_avatar} alt={review.author_name} className="w-full h-full rounded-full" />
                      ) : (
                        <User className="w-5 h-5 text-terracotta" aria-hidden="true" />
                      )}
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
        </div>
      </div>
    </section>
  );
}