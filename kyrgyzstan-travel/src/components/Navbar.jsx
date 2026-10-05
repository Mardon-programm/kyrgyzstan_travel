import { Menu, X, Search, User, Globe, Mountain } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { key: 'nav.destinations', href: '/destinations' },
  { key: 'nav.tours', href: '/tours' },
  { key: 'nav.itineraries', href: '/itineraries' },
  { key: 'nav.services', href: '/services' },
  { key: 'nav.guide', href: '/guide' },
  { key: 'nav.about', href: '/about' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const { openSearch } = useSearch();
  const { user, openLogin } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-graphite/80 backdrop-blur-md border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta to-terracottaHover flex items-center justify-center">
              <Mountain className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <span className="font-display text-xl font-bold text-white hidden sm:block">
              Kyrgyzstan Travel
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="text-white/70 hover:text-white font-medium text-sm transition-colors"
              >
                {t(item.key)}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium"
                aria-expanded={isLangOpen}
                aria-haspopup="listbox"
              >
                <span className="text-lg">{languages.find(l => l.code === currentLanguage)?.flag}</span>
                <span>{currentLanguage.toUpperCase()}</span>
                <Globe className="w-4 h-4 text-white/50" aria-hidden="true" />
              </button>
              {isLangOpen && (
                <ul
                  className="absolute right-0 mt-2 w-40 glass-card py-2 animate-slide-down"
                  role="listbox"
                >
                  {languages.map((lang) => (
                    <li key={lang.code} role="option">
                      <button
                        onClick={() => {
                          changeLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                          currentLanguage === lang.code
                            ? 'bg-terracotta/20 text-terracotta'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              onClick={openSearch}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:bg-terracotta/10 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-white/70 hover:text-white" aria-hidden="true" />
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => {}}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium"
                  aria-expanded={false}
                  aria-haspopup="listbox"
                >
                  <div className="w-8 h-8 rounded-full bg-terracotta/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-terracotta" aria-hidden="true" />
                  </div>
                  <span className="hidden sm:block">{user.name || user.email}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={openLogin}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:bg-terracotta/10 transition-colors"
                aria-label="Profile"
              >
                <User className="w-5 h-5 text-white/70 hover:text-white" aria-hidden="true" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>

        <div
          id="mobile-menu"
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="py-6 space-y-4 animate-slide-down">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t(item.key)}
              </a>
            ))}
            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setIsMenuOpen(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    currentLanguage === lang.code
                      ? 'bg-terracotta text-white'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {lang.flag} {lang.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}