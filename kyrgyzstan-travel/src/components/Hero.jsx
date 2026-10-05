import { MapPin, Calendar, Users, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRegions, useCategories } from '../hooks/useApi';

export default function Hero({ onSearch }) {
  const { t } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState(2);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const regionRef = useRef(null);
  const categoryRef = useRef(null);

  const { data: regionsData, loading: regionsLoading } = useRegions();
  const { data: categoriesData, loading: categoriesLoading } = useCategories();

  const regions = regionsData?.results || [];
  const categories = categoriesData?.results || [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (regionRef.current && !regionRef.current.contains(event.target)) {
        setIsRegionOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (regions.length > 0 && !selectedRegion) {
      setSelectedRegion(regions[0]);
    }
  }, [regions, selectedRegion]);

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRegion && selectedCategory) {
      onSearch?.({
        region: selectedRegion,
        category: selectedCategory,
        dates,
        guests,
      });
    }
  };

  const Select = ({ label, icon, value, options, isOpen, setIsOpen, onSelect, ref, name, placeholder, loading, optionLabel, optionIcon }) => {
    if (!value && options.length > 0) return null;

    return (
      <div className="relative" ref={ref}>
        <label className="block text-xs font-medium text-white/50 mb-1.5">{label}</label>
        <button
          onClick={() => !loading && setIsOpen(!isOpen)}
          disabled={loading}
          className="w-full flex items-center gap-3 px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-left text-white hover:border-white/20 transition-all focus:outline-none focus:border-terracotta/50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={label}
        >
          <span className="text-xl">{icon}</span>
          <span className="flex-1 truncate">{value?.[optionLabel || 'name'] || t('common.loading')}</span>
          <ChevronDown className={`w-5 h-5 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
        {isOpen && (
          <ul className="absolute top-full left-0 right-0 mt-2 glass-card py-2 animate-slide-down z-20" role="listbox">
            {options.map((opt) => (
              <li key={opt.id} role="option">
                <button
                  onClick={() => {
                    onSelect(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    value?.id === opt.id
                      ? 'bg-terracotta/20 text-terracotta'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{opt[optionIcon] || opt.icon || opt.emoji || ''}</span>
                  <span>{opt[optionLabel || 'name']}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  if (regionsLoading || categoriesLoading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center pt-16 lg:pt-20 overflow-hidden" aria-labelledby="hero-title">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
            alt="Tien Shan mountains landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-graphite/90 via-graphite/70 to-graphite/95" />
          <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'var(--tw-bg-image)' }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="w-12 h-12 mx-auto border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 lg:pt-20 overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="Tien Shan mountains landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-graphite/90 via-graphite/70 to-graphite/95" />
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'var(--tw-bg-image)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terracotta/20 border border-terracotta/30 text-terracotta text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>{t('hero.badge')}</span>
          </div>

          <h1 id="hero-title" className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-slide-up gradient-text">
            {t('hero.title')}
          </h1>

          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '100ms' }}>
            {t('hero.subtitle')}
          </p>

          <form onSubmit={handleSubmit} className="glass-card p-4 sm:p-6 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '200ms' }} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Select
                label={t('hero.search.region')}
                icon="🗺️"
                value={selectedRegion}
                options={regions}
                isOpen={isRegionOpen}
                setIsOpen={setIsRegionOpen}
                onSelect={setSelectedRegion}
                ref={regionRef}
                name="region"
                optionLabel="name"
                optionIcon="emoji"
                loading={regionsLoading}
              />

              <Select
                label={t('hero.search.activity')}
                icon="🎯"
                value={selectedCategory}
                options={categories}
                isOpen={isCategoryOpen}
                setIsOpen={setIsCategoryOpen}
                onSelect={setSelectedCategory}
                ref={categoryRef}
                name="category"
                optionLabel="name"
                optionIcon="icon"
                loading={categoriesLoading}
              />

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">{t('hero.search.dates')}</label>
                <input
                  type="date"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  className="input-field"
                  placeholder="Select dates"
                  min={new Date().toISOString().split('T')[0]}
                  aria-label={t('hero.search.dates')}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">{t('hero.search.guests')}</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="select-field"
                  aria-label={t('hero.search.guests')}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 text-lg">
              <span>{t('hero.search.submit')}</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </form>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/50 text-sm animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-terracotta" aria-hidden="true" />
              <span>{t('hero.meta.coordinates')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold" aria-hidden="true" />
              <span>{t('hero.meta.bestSeason')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-pine" aria-hidden="true" />
              <span>{t('hero.meta.groupSize')}</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
          <ChevronDown className="w-8 h-8 text-white/30 hover:text-white/60 transition-colors" />
        </div>
      </div>
    </section>
  );
}