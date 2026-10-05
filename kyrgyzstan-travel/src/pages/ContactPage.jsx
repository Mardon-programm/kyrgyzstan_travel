import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error'
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setSubmitError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
      setSubmitError('Failed to send message. Please try again.');
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: '123 Chuy Avenue, Bishkek 720000, Kyrgyz Republic',
      href: 'https://maps.google.com',
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+996 (312) 97-98-98',
      href: 'tel:+996312979898',
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: 'hello@kyrgyzstantravel.kg',
      href: 'mailto:hello@kyrgyzstantravel.kg',
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: 'Mon–Fri: 9:00–18:00 (GMT+6)\nSat: 10:00–14:00\nSun: Closed',
      href: null,
    },
  ];

  const subjects = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'booking', label: 'Booking Question' },
    { value: 'custom', label: 'Custom Tour Request' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'press', label: 'Press & Media' },
    { value: 'careers', label: 'Careers' },
    { value: 'other', label: 'Other' },
  ];

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
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">Have questions? We'd love to hear from you. Our team typically responds within 24 hours.</p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-graphite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-1 space-y-8">
              {contactInfo.map((item, i) => (
                <div key={i} className="glass-card p-6">
                  <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-terracotta" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/70 whitespace-pre-line">{item.details}</p>
                  {item.href && (
                    <a href={item.href} className="inline-flex items-center gap-1 text-terracotta hover:underline text-sm mt-2">
                      {t('contact.visit')} <span className="w-4 h-4" aria-hidden="true">→</span>
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="lg:col-span-2">
              <div className="glass-card p-8">
                <h2 className="font-display text-2xl font-bold text-white mb-6">{t('contact.sendMessage')}</h2>

                {status === 'success' && (
                  <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-green-500/20 border border-green-500/30 animate-fade-in">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-green-300">{t('contact.successTitle')}</p>
                      <p className="text-green-400 text-sm">{t('contact.successMessage')}</p>
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-500/20 border border-red-500/30 animate-fade-in">
                    <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" aria-hidden="true" />
                    <p className="text-red-300">{submitError || t('contact.errorMessage')}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-xs font-medium text-white/50 mb-1.5">{t('contact.name')}</label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`input-field ${errors.name ? 'border-terracotta/50' : ''}`}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        disabled={status === 'loading'}
                      />
                      {errors.name && <p id="name-error" className="text-terracotta text-xs mt-1" role="alert">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-white/50 mb-1.5">{t('contact.email')}</label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`input-field ${errors.email ? 'border-terracotta/50' : ''}`}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        disabled={status === 'loading'}
                      />
                      {errors.email && <p id="email-error" className="text-terracotta text-xs mt-1" role="alert">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-xs font-medium text-white/50 mb-1.5">{t('contact.subject')}</label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className={`select-field ${errors.subject ? 'border-terracotta/50' : ''}`}
                      aria-invalid={!!errors.subject}
                      aria-describedby={errors.subject ? 'subject-error' : undefined}
                      disabled={status === 'loading'}
                    >
                      <option value="">{t('contact.selectSubject')}</option>
                      {subjects.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                    {errors.subject && <p id="subject-error" className="text-terracotta text-xs mt-1" role="alert">{errors.subject}</p>}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-xs font-medium text-white/50 mb-1.5">{t('contact.message')}</label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`input-field min-h-[150px] resize-y ${errors.message ? 'border-terracotta/50' : ''}`}
                      placeholder={t('contact.messagePlaceholder')}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      disabled={status === 'loading'}
                    />
                    {errors.message && <p id="message-error" className="text-terracotta text-xs mt-1" role="alert">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary w-full sm:w-auto py-4 px-8 text-lg flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                        {t('contact.sending')}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" aria-hidden="true" />
                        {t('contact.send')}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-graphite-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title mb-4">{t('contact.faq')}</h2>
            <p className="section-subtitle mx-auto">{t('contact.faqSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="glass-card p-6">
              <h3 className="font-display text-lg font-bold text-white mb-3">{t('contact.faq1.q')}</h3>
              <p className="text-white/70">{t('contact.faq1.a')}</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-display text-lg font-bold text-white mb-3">{t('contact.faq2.q')}</h3>
              <p className="text-white/70">{t('contact.faq2.a')}</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-display text-lg font-bold text-white mb-3">{t('contact.faq3.q')}</h3>
              <p className="text-white/70">{t('contact.faq3.a')}</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-display text-lg font-bold text-white mb-3">{t('contact.faq4.q')}</h3>
              <p className="text-white/70">{t('contact.faq4.a')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}