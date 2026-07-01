import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { Spinner } from '../../../components/Spinner/Spinner';
import { useToast } from '../../../hooks/useToast';
import * as authApi from '../../../api/auth';
import styles from './ResetPasswordPage.module.css';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;
  const { show } = useToast();
  
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin1, setShowPin1] = useState(false);
  const [showPin2, setShowPin2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!phone) {
      navigate('/login');
    }
  }, [phone, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin !== confirmPin) {
      show('Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);
    await authApi.resetPassword(phone, newPin);
    setIsLoading(false);
    
    show('Password reset successfully. Please login.', 'success');
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.container}>
      <header className={styles.appBar}>
        <Link to="/login" className={styles.backBtn}>
          <ArrowLeft size={24} />
        </Link>
      </header>

      <div className={styles.content}>
        <h1 className={styles.title}>Reset Password</h1>
        <p className={styles.subtitle}>
          Create a new password for your account.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>New Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={20} className={styles.inputIcon} />
              <input
                type={showPin1 ? 'text' : 'password'}
                className={styles.input}
                placeholder="••••"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                required
                minLength={4}
              />
              <button 
                type="button" 
                className={styles.eyeBtn}
                onClick={() => setShowPin1(!showPin1)}
              >
                {showPin1 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={20} className={styles.inputIcon} />
              <input
                type={showPin2 ? 'text' : 'password'}
                className={styles.input}
                placeholder="••••"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                required
                minLength={4}
              />
              <button 
                type="button" 
                className={styles.eyeBtn}
                onClick={() => setShowPin2(!showPin2)}
              >
                {showPin2 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={isLoading || !newPin || !confirmPin}
          >
            {isLoading ? <Spinner size={24} color="#fff" /> : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
