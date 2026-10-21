import { useEffect, useState } from 'react';
import { Lock, Mail, User, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { t } = useTranslation();
  const { isAuthModalOpen, closeLogin, login } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthModalOpen) {
      setError('');
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = form.email.trim();
    const password = form.password.trim();
    const name = form.name.trim();

    if (!email || !password) {
      setError(t('auth.validation.required'));
      return;
    }

    if (mode === 'register' && !name) {
      setError(t('auth.validation.nameRequired'));
      return;
    }

    const user = {
      id: Date.now(),
      name: name || email.split('@')[0],
      email,
      role: 'traveler',
    };

    login(user);
    setForm({ name: '', email: '', password: '' });
    setMode('login');
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={(event) => event.target === event.currentTarget && closeLogin()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#171d1a] p-6 shadow-2xl animate-scale-in">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-terracotta/80">{t('auth.kicker')}</p>
            <h2 id="auth-modal-title" className="mt-2 font-display text-2xl font-bold text-white">
              {mode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeLogin}
            className="rounded-xl bg-white/5 p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label={t('common.close')}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/50" htmlFor="auth-name">
                {t('auth.name')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden="true" />
                <input
                  id="auth-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder={t('auth.namePlaceholder')}
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50" htmlFor="auth-email">
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden="true" />
              <input
                id="auth-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50" htmlFor="auth-password">
              {t('auth.password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden="true" />
              <input
                id="auth-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder={t('auth.passwordPlaceholder')}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" className="btn-primary w-full justify-center py-3.5">
            {mode === 'login' ? t('auth.loginButton') : t('auth.registerButton')}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-white/60">
          {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
          <button
            type="button"
            onClick={() => {
              setMode((prev) => (prev === 'login' ? 'register' : 'login'));
              setError('');
            }}
            className="font-medium text-terracotta transition-colors hover:text-terracottaHover"
          >
            {mode === 'login' ? t('auth.registerLink') : t('auth.loginLink')}
          </button>
        </div>
      </div>
    </div>
  );
}
