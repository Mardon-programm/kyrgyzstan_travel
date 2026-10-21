import { useTranslation } from 'react-i18next';
import { useFeaturedLocations } from '../hooks/useApi';

const badgeStyles = {
  popular: 'badge-terracotta',
  ethno: 'badge-pine',
  scenic: 'badge-gold',
  historic: 'bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs font-medium px-3 py-1 rounded-full',
  epic: 'bg-red-500/20 text-red-400 border-red-500/30 text-xs font-medium px-3 py-1 rounded-full',
};

const normalizeBadgeKey = (badge) => {
  if (!badge) return 'popular';
  const raw = String(badge).trim();
  const clean = raw.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
  if (!clean) return 'popular';
  if (clean in badgeStyles) return clean;
  if (clean.includes('ethno')) return 'ethno';
  if (clean.includes('scenic')) return 'scenic';
  if (clean.includes('historic')) return 'historic';
  if (clean.includes('epic')) return 'epic';
  return 'popular';
};

const normalizeImageUrl = (value) => {
  if (!value) return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';

  const url = String(value).trim();
  if (url.startsWith('http://0.0.0.0/media/')) {
    const candidate = decodeURIComponent(url.replace('http://0.0.0.0/media/', ''));
    if (candidate.startsWith('http')) return candidate;
  }

  if (url.includes('/media/https%3A') || url.includes('/media/http%3A')) {
    const candidate = decodeURIComponent(url.split('/media/')[1]);
    if (candidate.startsWith('http')) return candidate;
  }

  return url;
};

export default function TopLocations() {
  const { t } = useTranslation();
  const { data, loading, error } = useFeaturedLocations();

  if (loading) {
    return (
      <section id="destinations" className="py-20 lg:py-32 bg-graphite" aria-labelledby="top-locations-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 id="top-locations-title" className="section-title">{t('topLocations.title')}</h2>
            <p className="section-subtitle mx-auto">{t('topLocations.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <article key={i} className="glass-card p-0 overflow-hidden relative animate-pulse">
                <div className="aspect-[4/3] bg-white/5" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-white/5 rounded w-3/4" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-white/5 rounded w-16" />
                    <div className="h-6 bg-white/5 rounded w-20" />
                  </div>
                  <div className="h-1 bg-white/5 rounded" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-white/5 rounded" />
                    <div className="h-16 bg-white/5 rounded" />
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
    return (
      <section id="destinations" className="py-20 lg:py-32 bg-graphite" aria-labelledby="top-locations-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white/60 mb-4">{t('common.error')}</div>
        </div>
      </section>
    );
  }

  const locations = data?.results || [];

  return (
    <section id="destinations" className="py-20 lg:py-32 bg-graphite" aria-labelledby="top-locations-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="top-locations-title" className="section-title">{t('topLocations.title')}</h2>
          <p className="section-subtitle mx-auto">{t('topLocations.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {locations.map((location, index) => {
            const badgeKey = normalizeBadgeKey(location.badge ?? location.category?.slug ?? location.category);
            const badgeLabel = t(`topLocations.badges.${badgeKey}`) !== `topLocations.badges.${badgeKey}`
              ? t(`topLocations.badges.${badgeKey}`)
              : (location.badge || location.category?.name || 'Popular');

            return (
              <article
                key={location.id}
                className="group glass-card p-0 overflow-hidden relative animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={normalizeImageUrl(location.image)}
                    alt={`${location.name} landscape`}
                    className="w-full h-full object-cover hover-zoom"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className={badgeStyles[badgeKey] || badgeStyles.popular}>{badgeLabel}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <span className="w-2 h-2 rounded-full bg-terracotta" aria-hidden="true" />
                      <span>{location.region?.name || location.region}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-terracotta transition-colors">
                      {location.name}
                    </h3>
                    <p className="text-white/50 text-sm mt-1">{location.region?.name || location.region}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {location.tags?.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/5 text-white/70 text-xs border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="topo-divider" />

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 rounded-xl bg-white/5">
                      <p className="elevation">{t('topLocations.elevation')}</p>
                      <p className="gps-coords mt-1">{location.elevation ? `${Number(location.elevation).toLocaleString('en-US')}m ASL` : ''}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5">
                      <p className="elevation">{t('topLocations.coordinates')}</p>
                      <p className="gps-coords mt-1 truncate">
                        {location.latitude && location.longitude
                          ? `${Number(location.latitude).toFixed(4)}° N, ${Number(location.longitude).toFixed(4)}° E`
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <a href="/destinations" className="btn-secondary inline-flex items-center gap-2">
            {t('topLocations.exploreAll')}
            <span className="w-5 h-5" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}