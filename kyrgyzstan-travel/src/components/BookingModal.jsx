import { X, Calendar, Users, MapPin, CheckCircle, Loader2, CreditCard, Mail, Phone } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useBookingCreate } from '../hooks/useApi';

export default function BookingModal({ isOpen, onClose, tour, tourDate, onSubmit }) {
  const { t } = useTranslation();
  const { createBooking, loading: submitting } = useBookingCreate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    guests: 2,
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const modalRef = useRef(null);
  const focusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => focusRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        date: tourDate?.start_date || '',
        guests: 2,
        notes: '',
      });
      setErrors({});
      setSubmitSuccess(false);
    }
  }, [isOpen, tourDate]);

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = t('booking.validation.firstNameRequired');
      if (!formData.lastName.trim()) newErrors.lastName = t('booking.validation.lastNameRequired');
      if (!formData.email.trim()) newErrors.email = t('booking.validation.emailRequired');
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t('booking.validation.emailInvalid');
      if (!formData.phone.trim()) newErrors.phone = t('booking.validation.phoneRequired');
    }
    if (currentStep === 2) {
      if (!formData.date) newErrors.date = t('booking.validation.dateRequired');
      else if (new Date(formData.date) < new Date().setHours(0,0,0,0)) newErrors.date = t('booking.validation.dateFuture');
      if (formData.guests < 1) newErrors.guests = t('booking.validation.guestsMin');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;

    setIsSubmitting(true);
    try {
      const bookingData = {
        tour_date: tourDate?.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        guests: formData.guests,
        special_requests: formData.notes,
      };
      await createBooking(bookingData);
      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  const totalPrice = tour && tourDate ? (tour.price * formData.guests).toFixed(2) : '0';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      <div
        ref={modalRef}
        className="glass w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 id="booking-title" className="font-display text-2xl font-bold text-white">
              {submitSuccess ? t('booking.confirmed') : t('booking.title', { title: tour?.title || '' })}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              aria-label={t('common.close')}
            >
              <X className="w-5 h-5 text-white/70" aria-hidden="true" />
            </button>
          </div>

          {submitSuccess ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2">{t('booking.success.title')}</h3>
              <p className="text-white/60 mb-6" dangerouslySetInnerHTML={{ __html: t('booking.success.message', { email: formData.email }) }} />
              <button onClick={onClose} className="btn-primary">{t('booking.success.backToTours')}</button>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-8" role="tablist" aria-label="Booking steps">
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    disabled
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      s < step
                        ? 'bg-terracotta text-white'
                        : s === step
                        ? 'bg-white/10 border border-terracotta text-terracotta'
                        : 'bg-white/5 border border-white/10 text-white/40'
                    }`}
                    role="tab"
                    aria-selected={s === step}
                  >
                    {s < step && <CheckCircle className="w-4 h-4" aria-hidden="true" />}
                    <span>{t('common.step', { step: s })}</span>
                    {s === 1 && <span>{t('booking.steps.details')}</span>}
                    {s === 2 && <span>{t('booking.steps.dates')}</span>}
                    {s === 3 && <span>{t('booking.steps.confirm')}</span>}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {step === 1 && (
                  <div className="space-y-4 animate-slide-up" role="tabpanel" aria-label="Personal details">
                    <h3 className="font-medium text-white mb-4">{t('booking.form.firstName')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-xs font-medium text-white/50 mb-1.5">{t('booking.form.firstName')}</label>
                        <input
                          ref={focusRef}
                          id="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="input-field"
                          aria-invalid={!!errors.firstName}
                          aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                        />
                        {errors.firstName && (
                          <p id="firstName-error" className="text-terracotta text-xs mt-1" role="alert">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-xs font-medium text-white/50 mb-1.5">{t('booking.form.lastName')}</label>
                        <input
                          id="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="input-field"
                          aria-invalid={!!errors.lastName}
                          aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                        />
                        {errors.lastName && (
                          <p id="lastName-error" className="text-terracotta text-xs mt-1" role="alert">{errors.lastName}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-white/50 mb-1.5">{t('booking.form.email')}</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" aria-hidden="true" />
                        <input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="input-field pl-12"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                      </div>
                      {errors.email && (
                        <p id="email-error" className="text-terracotta text-xs mt-1" role="alert">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-medium text-white/50 mb-1.5">{t('booking.form.phone')}</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" aria-hidden="true" />
                        <input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="input-field pl-12"
                          placeholder="+996 XXX XX XXXX"
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? 'phone-error' : undefined}
                        />
                      </div>
                      {errors.phone && (
                        <p id="phone-error" className="text-terracotta text-xs mt-1" role="alert">{errors.phone}</p>
                      )}
                    </div>
                    <div className="flex justify-end pt-4">
                      <button type="button" onClick={handleNext} className="btn-primary">
                        {t('booking.form.continue')}
                        <span className="w-4 h-4 ml-1" aria-hidden="true">→</span>
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-slide-up" role="tabpanel" aria-label="Travel dates">
                    <h3 className="font-medium text-white mb-4">{t('booking.form.date')}</h3>
                    <div>
                      <label htmlFor="date" className="block text-xs font-medium text-white/50 mb-1.5">{t('booking.form.date')}</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" aria-hidden="true" />
                        <input
                          id="date"
                          type="date"
                          min={today}
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="input-field pl-12"
                          aria-invalid={!!errors.date}
                          aria-describedby={errors.date ? 'date-error' : undefined}
                        />
                      </div>
                      {errors.date && (
                        <p id="date-error" className="text-terracotta text-xs mt-1" role="alert">{errors.date}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="guests" className="block text-xs font-medium text-white/50 mb-1.5">{t('booking.form.guests')}</label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" aria-hidden="true" />
                        <select
                          id="guests"
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                          className="select-field pl-12"
                          aria-invalid={!!errors.guests}
                          aria-describedby={errors.guests ? 'guests-error' : undefined}
                        >
                          {[1,2,3,4,5,6,7,8,9,10,11,12].map((n) => (
                            <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                          ))}
                        </select>
                      </div>
                      {errors.guests && (
                        <p id="guests-error" className="text-terracotta text-xs mt-1" role="alert">{errors.guests}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="notes" className="block text-xs font-medium text-white/50 mb-1.5">{t('booking.form.notes')}</label>
                      <textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="input-field min-h-[100px] resize-y"
                        placeholder={t('booking.form.notesPlaceholder')}
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button type="button" onClick={handleBack} className="btn-secondary flex-1">{t('booking.form.back')}</button>
                      <button type="button" onClick={handleNext} className="btn-primary flex-1">
                        {t('booking.form.review')}
                        <span className="w-4 h-4 ml-1" aria-hidden="true">→</span>
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4 animate-slide-up" role="tabpanel" aria-label="Confirm booking">
                    <h3 className="font-medium text-white mb-4">{t('booking.steps.confirm')}</h3>

                    <div className="glass p-4 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">{t('booking.summary.tour')}</span>
                        <span className="text-white font-medium">{tour?.title}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">{t('booking.summary.date')}</span>
                        <span className="text-white font-medium">{formData.date ? new Date(formData.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : t('common.notSelected')}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">{t('booking.summary.guests')}</span>
                        <span className="text-white font-medium">{formData.guests}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">{t('booking.summary.pricePerPerson')}</span>
                        <span className="text-white font-medium">${tour?.price || 0} {tour?.currency}</span>
                      </div>
                      <div className="topo-divider" />
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span className="text-white">{t('booking.summary.total')}</span>
                        <span className="text-terracotta">${totalPrice} {tour?.currency}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        className="mt-1 w-4 h-4 accent-terracotta border-white/20 rounded focus:ring-terracotta"
                      />
                      <label htmlFor="terms" className="text-sm text-white/70" dangerouslySetInnerHTML={{ __html: t('booking.form.terms') }} />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button type="button" onClick={handleBack} className="btn-secondary flex-1">{t('booking.form.back')}</button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                            {t('booking.form.processing')}
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5" aria-hidden="true" />
                            {t('booking.form.pay', { amount: totalPrice })}
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-center text-xs text-white/40">
                      Secure payment powered by Stripe. Your data is encrypted.
                    </p>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}