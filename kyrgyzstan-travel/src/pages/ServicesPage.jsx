import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, ChevronDown, X, Star, MapPin, Users, Car, Home, Shield, Award, Languages, DollarSign } from 'lucide-react';
import { useGuides, useVehicles, useYurtCamps } from '../hooks/useApi';

export default function ServicesPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('guides');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const { data: guidesData, loading: guidesLoading, error: guidesError, refetch: refetchGuides } = useGuides(filters.guides || {});
  const { data: vehiclesData, loading: vehiclesLoading, error: vehiclesError, refetch: refetchVehicles } = useVehicles(filters.vehicles || {});
  const { data: yurtCampsData, loading: yurtCampsLoading, error: yurtCampsError, refetch: refetchYurtCamps } = useYurtCamps(filters.yurtCamps || {});

  const currentData = activeTab === 'guides' ? guidesData : activeTab === 'vehicles' ? vehiclesData : yurtCampsData;
  const currentLoading = activeTab === 'guides' ? guidesLoading : activeTab === 'vehicles' ? vehiclesLoading : yurtCampsLoading;
  const currentError = activeTab === 'guides' ? guidesError : activeTab === 'vehicles' ? vehiclesError : yurtCampsError;
  const currentRefetch = activeTab === 'guides' ? refetchGuides : activeTab === 'vehicles' ? refetchVehicles : refetchYurtCamps;

  const tabs = [
    { id: 'guides', label: t('services.guides'), icon: Users },
    { id: 'vehicles', label: t('services.vehicles'), icon: Car },
    { id: 'yurt-camps', label: t('services.yurtCamps'), icon: Home },
  ];

  if (currentLoading) {
    return (
      <div className="py-20 lg:py-32 bg-graphite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="section-title mb-4">{t('services.title')}</h1>
            <p className="section-subtitle mx-auto">{t('services.subtitle')}</p>
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

  if (currentError) {
    return (
      <div className="py-20 lg:py-32 bg-graphite text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-white/60 mb-4">{t('common.error')}</div>
          <button onClick={currentRefetch} className="btn-primary">{t('common.retry')}</button>
        </div>
      </div>
    );
  }

  const items = currentData?.results || [];

  return (
    <div className="py-20 lg:py-32 bg-graphite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <h1 className="section-title mb-2">{t('services.title')}</h1>
            <p className="section-subtitle">{t('services.subtitle')}</p>
          </div>

          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-terracotta text-white' : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'}`}
              >
                <tab.icon className="w-4 h-4" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <article
              key={item.id}
              className="glass-card p-0 overflow-hidden relative group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={item.photo || item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'}
                  alt={item.full_name || item.name || item.title}
                  className="w-full h-full object-cover hover-zoom"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {item.is_verified && (
                    <span className="px-2.5 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs border border-green-500/30 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {t('services.verified')}
                    </span>
                  )}
                  {item.is_featured && (
                    <span className="px-2.5 py-1 rounded-lg bg-gold/20 text-gold text-xs border border-gold/30 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {t('services.featured')}
                    </span>
                  )}
                  {item.is_cbt && (
                    <span className="px-2.5 py-1 rounded-lg bg-pine/20 text-pine text-xs border border-pine/30">
                      {t('services.cbt')}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <MapPin className="w-4 h-4 text-terracotta" aria-hidden="true" />
                    <span>{item.region?.name || item.regions?.[0]?.name || item.region}</span>
                  </div>
                  {item.rating && (
                    <div className="flex items-center gap-1 text-white/90 text-sm font-medium">
                      <Star className="w-4 h-4 fill-current text-gold" aria-hidden="true" />
                      <span>{item.rating}</span>
                      <span className="text-white/40">({item.reviews_count})</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-terracotta transition-colors line-clamp-1">
                    {item.full_name || item.name || item.title}
                  </h3>
                  {item.bio && <p className="text-white/60 text-sm mt-1 line-clamp-2">{item.bio}</p>}
                  {item.short_description && <p className="text-white/60 text-sm mt-1 line-clamp-2">{item.short_description}</p>}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 border-t border-white/10 pt-4">
                  {item.experience_years && (
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4" aria-hidden="true" />
                      <span>{item.experience_years} {t('services.yearsExp')}</span>
                    </div>
                  )}
                  {item.languages && item.languages.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Languages className="w-4 h-4" aria-hidden="true" />
                      <span>{item.languages.join(', ')}</span>
                    </div>
                  )}
                  {item.specializations && item.specializations.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4" aria-hidden="true" />
                      <span>{item.specializations.join(', ')}</span>
                    </div>
                  )}
                  {item.vehicle_type && (
                    <div className="flex items-center gap-1.5">
                      <Car className="w-4 h-4" aria-hidden="true" />
                      <span>{item.vehicle_type}</span>
                    </div>
                  )}
                  {item.seats && (
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" aria-hidden="true" />
                      <span>{item.seats} {t('services.seats')}</span>
                    </div>
                  )}
                  {item.accommodation_type && (
                    <div className="flex items-center gap-1.5">
                      <Home className="w-4 h-4" aria-hidden="true" />
                      <span>{item.accommodation_type}</span>
                    </div>
                  )}
                  {item.capacity && (
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" aria-hidden="true" />
                      <span>{item.capacity} {t('services.guests')}</span>
                    </div>
                  )}
                  {item.is_cbt && (
                    <div className="flex items-center gap-1.5">
                      <Home className="w-4 h-4" aria-hidden="true" />
                      <span className="px-2 py-1 rounded bg-pine/20 text-pine text-xs">{t('services.cbt')}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-2xl font-bold text-white">
                      {item.price_per_day || item.price_per_day || item.price_per_night || item.price_per_person || 0}
                    </span>
                    <span className="text-white/50">/{item.currency}</span>
                    <span className="text-white/50 text-sm ml-1">
                      {item.price_per_day ? t('services.perDay') : item.price_per_night ? t('services.perNight') : t('services.perPerson')}
                    </span>
                  </div>
                  <button className="btn-primary px-5 py-2.5 text-sm">
                    {t('services.viewProfile')}
                    <span className="w-4 h-4 ml-1" aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/60 mb-4">{t('common.noResults')}</p>
            <button onClick={() => setFilters({})} className="btn-primary">{t('common.clear')}</button>
          </div>
        )}
      </div>
    </div>
  );
}