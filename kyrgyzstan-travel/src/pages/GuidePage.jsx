import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, ChevronDown, X, BookOpen, HelpCircle, Search, ChevronRight, ChevronDown as ChevronDownIcon, Clock, Eye, Tag } from 'lucide-react';
import { useGuideCategories, useGuideArticles, useFAQs } from '../hooks/useApi';

export default function GuidePage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('articles');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const { data: categoriesData, loading: categoriesLoading } = useGuideCategories();
  const { data: articlesData, loading: articlesLoading, error: articlesError, refetch: refetchArticles } = useGuideArticles({ category: selectedCategory, search: searchQuery });
  const { data: faqsData, loading: faqsLoading, error: faqsError } = useFAQs({ category: selectedCategory });

  const categories = categoriesData?.results || [];
  const articles = articlesData?.results || [];
  const faqs = faqsData?.results || [];

  const tabs = [
    { id: 'articles', label: t('guide.articles'), icon: BookOpen, count: articlesData?.count || 0 },
    { id: 'faqs', label: t('guide.faqs'), icon: HelpCircle, count: faqsData?.count || 0 },
  ];

  const hasActiveFilters = selectedCategory || searchQuery;

  if (articlesLoading && activeTab === 'articles') {
    return (
      <div className="py-20 lg:py-32 bg-graphite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="section-title mb-4">{t('guide.title')}</h1>
            <p className="section-subtitle mx-auto">{t('guide.subtitle')}</p>
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

  if (faqsLoading && activeTab === 'faqs') {
    return (
      <div className="py-20 lg:py-32 bg-graphite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="section-title mb-4">{t('guide.title')}</h1>
            <p className="section-subtitle mx-auto">{t('guide.subtitle')}</p>
          </div>
          <div className="space-y-4 max-w-3xl mx-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <article key={i} className="glass-card p-6 animate-pulse">
                <div className="h-6 bg-white/5 rounded w-3/4 mb-4" />
                <div className="h-4 bg-white/5 rounded w-full mb-2" />
                <div className="h-4 bg-white/5 rounded w-3/4" />
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 lg:py-32 bg-graphite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="section-title mb-4">{t('guide.title')}</h1>
          <p className="section-subtitle mx-auto">{t('guide.subtitle')}</p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('guide.searchPlaceholder')}
              className="input-field pl-12 pr-4"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-6">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!selectedCategory ? 'bg-terracotta text-white' : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'}`}
            >
              {t('guide.allCategories')}
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat.slug ? 'bg-terracotta text-white' : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'}`}
              >
                {cat.icon && <span className="mr-1" data-lucide={cat.icon} />}
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mb-8" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-terracotta text-white' : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'}`}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              <tab.icon className="w-4 h-4" aria-hidden="true" />
              <span>{tab.label}</span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/50 text-xs">{tab.count}</span>
            </button>
          ))}
        </div>

        {activeTab === 'articles' && (
          <>
            {articles.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 mx-auto text-white/30 mb-4" />
                <p className="text-white/60 mb-4">{t('guide.noArticles')}</p>
                <button onClick={() => { setSelectedCategory(''); setSearchQuery(''); }} className="btn-primary">{t('common.clear')}</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                  <article
                    key={article.id}
                    className="glass-card p-0 overflow-hidden relative group animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={article.featured_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'}
                        alt={article.title}
                        className="w-full h-full object-cover hover-zoom"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {article.category && (
                          <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur text-white/90 text-xs border border-white/20">
                            {article.category.name}
                          </span>
                        )}
                        {article.is_featured && (
                          <span className="px-2.5 py-1 rounded-lg bg-gold/20 text-gold text-xs border border-gold/30 flex items-center gap-1">
                            <span data-lucide="star" className="w-3 h-3 fill-current" />
                            {t('common.featured')}
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <Clock className="w-4 h-4" aria-hidden="true" />
                          <span>{article.reading_time} {t('guide.minRead')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <Eye className="w-4 h-4" aria-hidden="true" />
                          <span>{article.views_count}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      {article.category && (
                        <span className="px-2 py-1 rounded bg-terracotta/20 text-terracotta text-xs">{article.category.name}</span>
                      )}
                      <h3 className="font-display text-lg font-bold text-white group-hover:text-terracotta transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-white/60 text-sm line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div className="flex items-center gap-2 text-xs text-white/50">
                          <Tag className="w-3 h-3" />
                          {article.tags?.slice(0, 3).join(', ')}
                        </div>
                        <span className="text-terracotta hover:underline text-sm">{t('guide.readMore')}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'faqs' && (
          <>
            {faqs.length === 0 ? (
              <div className="text-center py-16">
                <HelpCircle className="w-16 h-16 mx-auto text-white/30 mb-4" />
                <p className="text-white/60 mb-4">{t('guide.noFAQs')}</p>
                <button onClick={() => setSelectedCategory('')} className="btn-primary">{t('common.clear')}</button>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="glass-card overflow-hidden">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full p-6 flex items-center justify-between text-left"
                    >
                      <div className="flex-1 pr-4">
                        <p className="font-medium text-white text-lg">{faq.question}</p>
                      </div>
                      <ChevronDownIcon
                        className={`w-5 h-5 text-white/50 transition-transform ${expandedFAQ === faq.id ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="border-t border-white/10 px-6 pb-6">
                        <p className="text-white/70">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}