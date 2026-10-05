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

  return (
    <div className="bg-graphite min-h-screen">
      <section className="relative aspect-[16/9] max-w-7xl mx-auto">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="Kyrgyzstan mountains"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-graphite/90 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">About Kyrgyzstan Travel</h1>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">Your gateway to the untamed heart of Central Asia</p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-graphite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title mb-4">Our Story</h2>
            <p className="section-subtitle mx-auto">Founded in 2009 by a group of passionate Kyrgyz mountaineers and cultural enthusiasts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="space-y-6 text-white/70 leading-relaxed">
              <p>
                Kyrgyzstan Travel was born from a simple idea: to share the incredible beauty of our homeland with the world.
                What started as a small group of friends guiding visitors to Ala-Archa gorge has grown into the country's
                leading adventure tourism company.
              </p>
              <p>
                We believe that travel should be transformative. Every journey we design connects you with the raw nature,
                ancient traditions, and warm hospitality that make Kyrgyzstan unique. From the shores of Issyk-Kul to the
                high pastures of Son-Kul, from the Silk Road caravanserais to the nomadic yurts of Naryn — we know every
                trail, every family, every hidden gem.
              </p>
              <p>
                Today, our team of 50+ local experts continues this mission. We're not just tour operators — we're
                ambassadors of Kyrgyz culture, guardians of the mountains, and your partners in adventure.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80"
                alt="Kyrgyzstan Travel team"
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
            <h2 className="section-title mb-4">Our Values</h2>
            <p className="section-subtitle mx-auto">The principles that guide every journey we create</p>
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
            <h2 className="section-title mb-4">Meet Our Team</h2>
            <p className="section-subtitle mx-auto">Local experts who make your adventure unforgettable</p>
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
          <h2 className="section-title mb-4">Ready for Your Adventure?</h2>
          <p className="section-subtitle mx-auto mb-8">Let us help you discover the untamed heart of Central Asia</p>
          <a href="/tours" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
            Explore Tours
            <span className="w-5 h-5" aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </div>
  );
}