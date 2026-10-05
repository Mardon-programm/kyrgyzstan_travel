import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, Star, ArrowLeft, Check, Mountain, Users, Droplets, Landmark, Home } from 'lucide-react';
import { useDestinations } from '../hooks/useApi';

const categoryIcons = {
  lakes: Droplets,
  gorges: Mountain,
  history: Landmark,
  yurts: Home,
};

export default function DestinationDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams();

  const { data: destination, loading, error } = useDestinations({ slug });

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

  if (error || !destination) {
    return (
      <div className="py-20 lg:py-32 bg-graphite text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-white/60 mb-4">{t('common.error')}</div>
          <Link to="/destinations" className="btn-primary">{t('common.back')}</Link>
        </div>
      </div>
    );
  }

  const formatElevation = (elev) => elev ? `${elev.toLocaleString()}m ASL` : '';

  return (
    <div className="bg-graphite min-h-screen">
      <div className="relative aspect-[16/9] max-w-7xl mx-auto">
        <img
          src={destination.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'}
          alt={`${destination.name} destination`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-graphite/90 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {destination.tags?.map((tag) => (
                <span key={tag.id} className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur text-white/90 text-sm border border-white/20">{tag.name}</span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-terracotta" aria-hidden="true" />
                {destination.region?.name || destination.region}
              </span>
              {destination.elevation && (
                <span className="flex items-center gap-1">
                  <Mountain className="w-4 h-4 text-gold" aria-hidden="true" />
                  {formatElevation(destination.elevation)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <p className="text-white/50 text-sm mb-2">{destination.region?.name || destination.region}</p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">{destination.name}</h1>
              {destination.name_kg && <h2 className="text-xl text-white/70 mb-4 font-medium">{destination.name_kg}</h2>}
              <p className="text-white/70 text-lg leading-relaxed">{destination.description || destination.short_description}</p>
            </div>

            {destination.highlights && destination.highlights.length > 0 && (
              <div className="border-t border-white/10 pt-8">
                <h2 className="font-display text-2xl font-bold text-white mb-6">{t('destinations.highlights')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destination.highlights.map((highlight, i) => (
                    <div key={i} className="glass-card p-4 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-terracotta/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-5 h-5 text-terracotta" aria-hidden="true" />
                      </div>
                      <span className="text-white/90">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {destination.practical_info && Object.keys(destination.practical_info).length > 0 && (
              <div className="border-t border-white/10 pt-8">
                <h2 className="font-display text-2xl font-bold text-white mb-6">{t('destinations.practicalInfo')}</h2>
                <div className="space-y-4">
                  {Object.entries(destination.practical_info).map(([key, value]) => (
                    <div key={key} className="glass-card p-4">
                      <h3 className="font-medium text-white mb-2 capitalize">{key}</h3>
                      <p className="text-white/70">{Array.isArray(value) ? value.join(', ') : value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 glass-card p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-terracotta" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-white/50 text-sm">{t('destinations.coordinates')}</p>
                  <p className="font-mono text-sm text-white/80">
                    {destination.latitude && destination.longitude
                      ? `${Number(destination.latitude).toFixed(4)}° N, ${Number(destination.longitude).toFixed(4)}° E`
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                  <Mountain className="w-6 h-6 text-gold" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-white/50 text-sm">{t('destinations.elevation')}</p>
                  <p className="font-medium text-white">{formatElevation(destination.elevation)}</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <Link to="/destinations" className="btn-secondary w-full flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  {t('common.backToDestinations')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}