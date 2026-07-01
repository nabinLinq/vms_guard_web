import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { Spinner } from '../../../components/Spinner/Spinner';
import { useToast } from '../../../hooks/useToast';
import { useAuthStore } from '../../../store/authStore';
// import * as guardApi from '../../../api/guard'; // Real implementation
import styles from './ChangePasswordPage.module.css';

export function ChangePasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { show } = useToast();
  const { user } = useAuthStore();
  
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  
  const [showPin0, setShowPin0] = useState(false);
  const [showPin1, setShowPin1] = useState(false);
  const [showPin2, setShowPin2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin !== confirmPin) {
      show('New passwords do not match', 'error');
      return;
    }

    setIsLoading(true);
    // Fake API call
    setTimeout(() => {
      setIsLoading(false);
      show('Password changed successfully', 'success');
      navigate('/dashboard/profile', { replace: true });
    }, 800);
  };

  return (
    <div className={styles.container}>
      <header className={styles.appBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className={styles.title}>{t('profile.changePassword')}</h1>
      </header>

      <div className={styles.content}>
        <form className={styles.form} onSubmit={handleSubmit}>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Current Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={20} className={styles.inputIcon} />
              <input
                type={showPin0 ? 'text' : 'password'}
                className={styles.input}
                placeholder="••••"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
                required
                minLength={4}
              />
              <button 
                type="button" 
                className={styles.eyeBtn}
                onClick={() => setShowPin0(!showPin0)}
              >
                {showPin0 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className={styles.divider} />

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
            <label className={styles.label}>Confirm New Password</label>
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
            disabled={isLoading || !currentPin || !newPin || !confirmPin}
          >
            {isLoading ? <Spinner size={24} color="#fff" /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
