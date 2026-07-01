import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Spinner } from '../../../components/Spinner/Spinner';
import * as authApi from '../../../api/auth';
import styles from './OtpVerificationPage.module.css';

export function OtpVerificationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!phone) {
      navigate('/login');
    }
    
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [phone, navigate]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) return;

    setIsLoading(true);
    const success = await authApi.verifyOtp(phone, otpString);
    setIsLoading(false);
    
    if (success) {
      navigate('/reset-password', { state: { phone, otp: otpString } });
    } else {
      // In a real app we'd show an error toast here
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setTimer(30);
    await authApi.requestOtp(phone);
  };

  return (
    <div className={styles.container}>
      <header className={styles.appBar}>
        <Link to="/forgot-password" className={styles.backBtn}>
          <ArrowLeft size={24} />
        </Link>
      </header>

      <div className={styles.content}>
        <h1 className={styles.title}>{t('auth.verifyOtp')}</h1>
        <p className={styles.subtitle}>
          We have sent a 6-digit verification code to <strong>{phone}</strong>.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.otpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                className={styles.otpInput}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>

          <div className={styles.resendContainer}>
            <span className={styles.resendText}>Didn't receive the code? </span>
            <button 
              type="button" 
              className={styles.resendBtn} 
              onClick={handleResend}
              disabled={timer > 0}
            >
              {timer > 0 ? `Resend in 00:${timer.toString().padStart(2, '0')}` : 'Resend Code'}
            </button>
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={isLoading || otp.join('').length < 6}
          >
            {isLoading ? <Spinner size={24} color="#fff" /> : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  );
}
