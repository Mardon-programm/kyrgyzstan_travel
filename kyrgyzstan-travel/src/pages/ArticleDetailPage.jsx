import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Clock, Eye, Tag, Share2, ArrowRight, BookOpen } from 'lucide-react';
import { useGuideArticle } from '../hooks/useApi';

export default function ArticleDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams();

  const { data: article, loading, error } = useGuideArticle(slug);

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

  if (error || !article) {
    return (
      <div className="py-20 lg:py-32 bg-graphite text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-white/60 mb-4">{t('common.error')}</div>
          <Link to="/guide" className="btn-primary">{t('common.back')}</Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <article className="bg-graphite min-h-screen">
      <header className="relative aspect-[16/9] max-w-7xl mx-auto">
        <img
          src={article.featured_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-graphite/90 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {article.category && (
                <Link to={`/guide?category=${article.category.slug}`} className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur text-white/90 text-sm border border-white/20 hover:bg-white/20">
                  {article.category.name}
                </Link>
              )}
              {article.is_featured && (
                <span className="px-3 py-1 rounded-lg bg-gold/20 text-gold text-sm border border-gold/30 flex items-center gap-1">
                  <span data-lucide="star" className="w-3 h-3 fill-current" />
                  {t('common.featured')}
                </span>
              )}
              {article.tags?.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur text-white/90 text-sm border border-white/20">#{tag}</span>
              ))}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/70">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span>{formatDate(article.published_at || article.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" aria-hidden="true" />
                <span>{article.reading_time} {t('guide.minRead')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" aria-hidden="true" />
                <span>{article.views_count} {t('guide.views')}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="prose prose-invert max-w-none">
          <div className="mb-8" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {article.gallery && article.gallery.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-white mb-6">{t('guide.gallery')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {article.gallery.map((img, i) => (
                <img key={i} src={img} alt={`${article.title} - ${i + 1}`} className="rounded-xl w-full h-64 object-cover hover:scale-105 transition-transform" loading="lazy" />
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-white/50 text-sm">{t('guide.tags')}</span>
            <div className="flex flex-wrap gap-2">
              {article.tags?.map((tag) => (
                <Link key={tag} to={`/guide?search=${tag}`} className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur text-white/90 text-sm border border-white/20 hover:bg-white/20">#{tag}</Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/guide" className="btn-secondary inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              {t('common.backToGuide')}
            </Link>
            <button className="btn-primary inline-flex items-center gap-2">
              <Share2 className="w-4 h-4" aria-hidden="true" />
              {t('guide.share')}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}