import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Compass, MapPin, Search, Sparkles, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

const quickLinks = [
  { key: 'nav.destinations', href: '/destinations', icon: MapPin },
  { key: 'nav.tours', href: '/tours', icon: Compass },
  { key: 'nav.itineraries', href: '/itineraries', icon: Sparkles },
  { key: 'nav.services', href: '/services', icon: Search },
  { key: 'nav.guide', href: '/guide', icon: ArrowRight },
];

export default function SearchModal() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isOpen, query, setQuery, closeSearch } = useSearch();
  const [value, setValue] = useState(query || '');
  const inputRef = useRef(null);

  useEffect(() => {
    setValue(query || '');
  }, [query]);

  useEffect(() => {
    if (!isOpen) return undefined;

    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 100);

    return () => {
      document.body.style.overflow = 'unset';
      window.clearTimeout(focusTimer);
    };
  }, [isOpen]);

  const results = useMemo(() => {
    const searchTerm = value.trim().toLowerCase();
    if (!searchTerm) {
      return quickLinks;
    }

    return quickLinks.filter(({ key, href }) => {
      const linkText = `${t(key)} ${href}`.toLowerCase();
      return linkText.includes(searchTerm);
    });
  }, [t, value]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const destination = results[0];

    if (!destination) {
      closeSearch();
      return;
    }

    navigate(destination.href);
    closeSearch();
    setQuery('');
  };

  const handleSelect = (href) => {
    navigate(href);
    closeSearch();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(event) => event.target === event.currentTarget && closeSearch()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-dialog-title"
    >
      <div className="glass w-full max-w-2xl p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-terracotta/80">{t('nav.search')}</p>
            <h2 id="search-dialog-title" className="font-display text-2xl font-bold text-white mt-1">
              {t('search.title')}
            </h2>
          </div>
          <button
            onClick={closeSearch}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            aria-label={t('common.close')}
          >
            <X className="w-5 h-5 text-white/70" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={t('search.placeholder')}
              className="input-field pl-12 pr-4"
              aria-label={t('search.placeholder')}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="btn-primary px-5 py-2.5">
              {t('search.submit')}
            </button>
          </div>
        </form>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-3">{t('search.quickLinks')}</p>
          {results.length > 0 ? (
            <ul className="space-y-2">
              {results.map(({ key, href, icon: Icon }) => (
                <li key={href}>
                  <button
                    onClick={() => handleSelect(href)}
                    className="w-full flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-terracotta/20 text-terracotta">
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </span>
                      <span>{t(key)}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/40" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-center text-white/60">
              {t('search.noResults')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
