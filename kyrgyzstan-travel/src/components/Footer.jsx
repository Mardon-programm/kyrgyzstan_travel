import { Mountain, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    destinations: [
      { label: t('regions.issyk-kul'), href: '/destinations/issyk-kul' },
      { label: t('regions.naryn'), href: '/destinations/naryn' },
      { label: t('regions.osh'), href: '/destinations/osh' },
      { label: t('regions.chuy'), href: '/destinations/chuy' },
      { label: t('footer.destinations'), href: '/destinations' },
    ],
    activities: [
      { label: t('categories.trekking'), href: '/tours?category=trekking' },
      { label: t('categories.horse'), href: '/tours?category=horse' },
      { label: t('categories.cultural'), href: '/tours?category=cultural' },
      { label: t('categories.jeep'), href: '/tours?category=jeep' },
      { label: t('categories.mountaineering'), href: '/tours?category=extreme' },
    ],
  };

  return (
    <footer className="bg-graphite-card border-t border-white/10" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta to-terracottaHover flex items-center justify-center">
                <Mountain className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <span className="font-display text-xl font-bold text-white">{t('brand')}</span>
            </div>
            <p className="text-white/50 text-sm mb-6 max-w-xs">{t('footer.description')}</p>
          </div>

          <nav aria-label="Destinations links">
            <h3 className="font-medium text-white mb-4">{t('footer.destinations')}</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.destinations.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/60 hover:text-white text-sm transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Activities links">
            <h3 className="font-medium text-white mb-4">{t('footer.activities')}</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.activities.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/60 hover:text-white text-sm transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="topo-divider mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="flex items-center gap-3 text-white/60 text-sm">
            <MapPin className="w-5 h-5 text-terracotta flex-shrink-0" aria-hidden="true" />
            <address className="not-italic max-w-xs">{t('footer.contact.address')}</address>
          </div>
          <div className="flex items-center gap-3 text-white/60 text-sm">
            <Phone className="w-5 h-5 text-gold flex-shrink-0" aria-hidden="true" />
            <a href="tel:+996312979898" className="hover:text-white transition-colors">{t('footer.contact.phone')}</a>
          </div>
          <div className="flex items-center gap-3 text-white/60 text-sm">
            <Mail className="w-5 h-5 text-pine flex-shrink-0" aria-hidden="true" />
            <a href="mailto:hello@kyrgyzstantravel.kg" className="hover:text-white transition-colors">{t('footer.contact.email')}</a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-white/40 text-sm">{t('footer.copyright', { year: currentYear })}</p>
          <p className="text-white/40 text-sm flex items-center gap-2">{t('footer.madeWith')}</p>
          <a href="#" className="flex items-center gap-1 text-white/40 hover:text-white text-sm transition-colors">
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            {t('footer.backToTop')}
          </a>
        </div>
      </div>
    </footer>
  );
}