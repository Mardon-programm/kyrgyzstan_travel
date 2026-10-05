import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mountain, Home, Compass, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-graphite flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-terracotta/20 flex items-center justify-center">
          <Mountain className="w-12 h-12 text-terracotta" aria-hidden="true" />
        </div>

        <h1 className="font-display text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl text-white/70 mb-4">{t('notfound.title')}</h2>
        <p className="text-white/50 mb-8">{t('notfound.message')}</p>

        <div className="space-y-4">
          <Link to="/" className="btn-primary inline-flex items-center gap-2 w-full sm:w-auto">
            <Home className="w-5 h-5" aria-hidden="true" />
            {t('notfound.home')}
          </Link>
          <Link to="/destinations" className="btn-secondary inline-flex items-center gap-2 w-full sm:w-auto">
            <Compass className="w-5 h-5" aria-hidden="true" />
            {t('notfound.destinations')}
          </Link>
          <Link to="/tours" className="btn-secondary inline-flex items-center gap-2 w-full sm:w-auto">
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            {t('notfound.tours')}
          </Link>
        </div>
      </div>
    </div>
  );
}