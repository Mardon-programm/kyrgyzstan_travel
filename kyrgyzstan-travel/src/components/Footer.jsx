import { Mountain, Mail, Phone, MapPin, Users, MessageSquare, Globe, Play, ArrowUpRight, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: t('footer.links.about'), href: '/about' },
      { label: t('footer.links.team'), href: '/team' },
      { label: t('footer.links.careers'), href: '/careers' },
      { label: t('footer.links.press'), href: '/press' },
      { label: t('footer.links.blog'), href: '/blog' },
    ],
    support: [
      { label: t('footer.links.help'), href: '/help' },
      { label: t('footer.links.contact'), href: '/contact' },
      { label: t('footer.links.faq'), href: '/faq' },
      { label: t('footer.links.terms'), href: '/terms' },
      { label: t('footer.links.privacy'), href: '/privacy' },
    ],
    destinations: [
      { label: 'Issyk-Kul', href: '/destinations/issyk-kul' },
      { label: 'Naryn', href: '/destinations/naryn' },
      { label: 'Osh', href: '/destinations/osh' },
      { label: 'Chuy', href: '/destinations/chuy' },
      { label: t('footer.destinations'), href: '/destinations' },
    ],
    activities: [
      { label: 'Trekking', href: '/tours?category=trekking' },
      { label: 'Horse Riding', href: '/tours?category=horse' },
      { label: 'Cultural Tours', href: '/tours?category=cultural' },
      { label: 'Jeep Tours', href: '/tours?category=jeep' },
      { label: 'Mountaineering', href: '/tours?category=extreme' },
    ],
  };

  const socialLinks = [
    { label: 'Facebook', icon: Users, href: 'https://facebook.com' },
    { label: 'Instagram', icon: MessageSquare, href: 'https://instagram.com' },
    { label: 'Twitter', icon: Globe, href: 'https://twitter.com' },
    { label: 'YouTube', icon: Play, href: 'https://youtube.com' },
  ];

  return (
    <footer className="bg-graphite-card border-t border-white/10" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta to-terracottaHover flex items-center justify-center">
                <Mountain className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <span className="font-display text-xl font-bold text-white">Kyrgyzstan Travel</span>
            </div>
            <p className="text-white/50 text-sm mb-6 max-w-xs">{t('footer.description')}</p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-terracotta/20 hover:border-terracotta/50 transition-all"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Company links">
            <h3 className="font-medium text-white mb-4">{t('footer.company')}</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/60 hover:text-white text-sm transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Support links">
            <h3 className="font-medium text-white mb-4">{t('footer.support')}</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/60 hover:text-white text-sm transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

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