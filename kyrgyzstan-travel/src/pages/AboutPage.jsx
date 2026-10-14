import { useTranslation } from 'react-i18next';
import { Mountain, Users, Heart, Globe, Award, Shield } from 'lucide-react';

const stats = [
  { icon: Mountain, label: 'Destinations', value: '50+' },
  { icon: Users, label: 'Happy Travelers', value: '10,000+' },
  { icon: Heart, label: 'Local Partners', value: '200+' },
  { icon: Award, label: 'Years Experience', value: '15+' },
];

const values = [
  { icon: Shield, title: 'Safety First', description: 'Your safety is our top priority. All tours are led by certified guides with extensive local knowledge.' },
  { icon: Heart, title: 'Authentic Experiences', description: 'We connect you with local communities for genuine cultural immersion, not tourist traps.' },
  { icon: Globe, title: 'Sustainable Tourism', description: 'We practice responsible tourism that preserves nature and supports local economies.' },
  { icon: Award, title: 'Expert Guides', description: 'Our guides are locals who know every trail, story, and hidden gem of Kyrgyzstan.' },
];

const team = [
  { name: 'Aiperi Toktogulova', role: 'Founder & CEO', bio: 'Born in Bishkek, Aiperi has 15+ years in adventure tourism across Central Asia.' },
  { name: 'Bakytbek Mamytov', role: 'Head Guide', bio: 'Certified mountain guide with 50+ expeditions to peaks over 7000m.' },
  { name: 'Meerim Asanova', role: 'Operations Manager', bio: 'Ensures every detail of your journey is perfect, from airport pickup to mountain summit.' },
  { name: 'Nurlanbek Uulu', role: 'Cultural Coordinator', bio: 'Connects travelers with nomadic families for authentic yurt stays and cultural exchanges.' },
];

export default function AboutPage() {
  const { t } = useTranslation();

  const stats = [
    { icon: Mountain, label: t('about.stats.destinations'), value: '50+' },
    { icon: Users, label: t('about.stats.travelers'), value: '10,000+' },
    { icon: Heart, label: t('about.stats.partners'), value: '200+' },
    { icon: Award, label: t('about.stats.experience'), value: '15+' },
  ];

  const values = [
    { icon: Shield, title: t('about.values.safety.title'), description: t('about.values.safety.description') },
    { icon: Heart, title: t('about.values.authentic.title'), description: t('about.values.authentic.description') },
    { icon: Globe, title: t('about.values.sustainable.title'), description: t('about.values.sustainable.description') },
    { icon: Award, title: t('about.values.guides.title'), description: t('about.values.guides.description') },
  ];

  const team = [
    { name: t('about.team.aiperi.name'), role: t('about.team.aiperi.role'), bio: t('about.team.aiperi.bio') },
    { name: t('about.team.bakytbek.name'), role: t('about.team.bakytbek.role'), bio: t('about.team.bakytbek.bio') },
    { name: t('about.team.meerim.name'), role: t('about.team.meerim.role'), bio: t('about.team.meerim.bio') },
    { name: t('about.team.nurlanbek.name'), role: t('about.team.nurlanbek.role'), bio: t('about.team.nurlanbek.bio') },
  ];

  return (
    <div className="bg-graphite min-h-screen">
      <section className="relative aspect-[16/9] max-w-7xl mx-auto">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt={t('about.heroAlt')}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-graphite/90 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">{t('about.heroTitle')}</h1>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">{t('about.heroSubtitle')}</p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-graphite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title mb-4">{t('about.storyTitle')}</h2>
            <p className="section-subtitle mx-auto">{t('about.storySubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="space-y-6 text-white/70 leading-relaxed">
              <p>{t('about.storyP1')}</p>
              <p>{t('about.storyP2')}</p>
              <p>{t('about.storyP3')}</p>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80"
                alt={t('about.teamAlt')}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, i) => (
              <div key={i} className="glass-card p-6 text-center animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-terracotta/20 flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-terracotta" aria-hidden="true" />
                </div>
                <p className="font-display text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title mb-4">{t('about.valuesTitle')}</h2>
            <p className="section-subtitle mx-auto">{t('about.valuesSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={i} className="glass-card p-6 text-center animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-terracotta/20 flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-terracotta" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2">{value.title}</h3>
                <p className="text-white/60">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-graphite-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title mb-4">{t('about.teamTitle')}</h2>
            <p className="section-subtitle mx-auto">{t('about.teamSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i} className="glass-card p-6 text-center animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="font-display text-3xl font-bold text-terracotta">{member.name.charAt(0)}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-1">{member.name}</h3>
                <p className="text-terracotta text-sm mb-3">{member.role}</p>
                <p className="text-white/60 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-graphite text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-4">{t('about.ctaTitle')}</h2>
          <p className="section-subtitle mx-auto mb-8">{t('about.ctaSubtitle')}</p>
          <a href="/tours" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
            {t('about.ctaButton')}
            <span className="w-5 h-5" aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </div>
  );
}