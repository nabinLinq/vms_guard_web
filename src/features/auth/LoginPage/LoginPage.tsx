import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Lock, Phone } from 'lucide-react';
import { useAuthStore, mockLogin } from '../../../store/authStore';
import { Spinner } from '../../../components/Spinner/Spinner';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !pin) return;

    setIsLoading(true);
    // Simulate API call for Phase 1
    setTimeout(() => {
      mockLogin(); // sets token in zustand
      setIsLoading(false);
      navigate('/dashboard', { replace: true });
    }, 800);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logoCircle}>
          <Lock size={32} color="var(--color-primary)" />
        </div>
        <h1 className={styles.title}>VMS Guard</h1>
        <p className={styles.subtitle}>{t('auth.guardAccess')}</p>
      </div>

      <form className={styles.form} onSubmit={handleLogin}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>{t('auth.phone')}</label>
          <div className={styles.inputWrapper}>
            <Phone size={20} className={styles.inputIcon} />
            <input
              type="tel"
              className={styles.input}
              placeholder="98XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>{t('auth.password')}</label>
          <div className={styles.inputWrapper}>
            <Lock size={20} className={styles.inputIcon} />
            <input
              type={showPin ? 'text' : 'password'}
              className={styles.input}
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
            />
            <button 
              type="button" 
              className={styles.eyeBtn}
              onClick={() => setShowPin(!showPin)}
            >
              {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className={styles.forgotRow}>
          <Link to="/forgot-password" className={styles.forgotLink}>
            {t('auth.forgot')}
          </Link>
        </div>

        <button 
          type="submit" 
          className={styles.submitBtn} 
          disabled={isLoading || !phone || !pin}
        >
          {isLoading ? <Spinner size={24} color="#fff" /> : t('auth.login')}
        </button>
      </form>
    </div>
  );
}
