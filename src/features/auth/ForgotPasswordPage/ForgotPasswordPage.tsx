import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Phone } from 'lucide-react';
import { Spinner } from '../../../components/Spinner/Spinner';
import * as authApi from '../../../api/auth';
import styles from './ForgotPasswordPage.module.css';

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;

    setIsLoading(true);
    await authApi.requestOtp(phone);
    setIsLoading(false);
    
    navigate('/otp-verification', { state: { phone } });
  };

  return (
    <div className={styles.container}>
      <header className={styles.appBar}>
        <Link to="/login" className={styles.backBtn}>
          <ArrowLeft size={24} />
        </Link>
      </header>

      <div className={styles.content}>
        <h1 className={styles.title}>{t('auth.forgot')}</h1>
        <p className={styles.subtitle}>
          Enter your registered phone number. We will send you an OTP to reset your password.
        </p>

        <form className={styles.form} onSubmit={handleSendOtp}>
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

          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={isLoading || phone.length < 10}
          >
            {isLoading ? <Spinner size={24} color="#fff" /> : t('auth.sendOtp')}
          </button>
        </form>
      </div>
    </div>
  );
}
