import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, LogOut, Shield, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useGuardSessionStore } from '../../../store/guardSessionStore';
import { Modal } from '../../../components/Modal/Modal';
import { useState } from 'react';
import styles from './GuardProfilePage.module.css';

export function GuardProfilePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isCheckedIn, checkInTime, checkOut } = useGuardSessionStore();
  
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const handleLanguageToggle = () => {
    const nextLang = i18n.language === 'en' ? 'ne' : 'en';
    i18n.changeLanguage(nextLang);
  };

  const handleCheckout = async () => {
    await checkOut();
    setIsCheckoutModalOpen(false);
  };

  const confirmLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  return (
    <div className={styles.container}>
      <header className={styles.appBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className={styles.title}>{t('profile.title')}</h1>
      </header>

      <div className={styles.content}>
        
        {/* Avatar Section */}
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <h2 className={styles.name}>{user.name}</h2>
          <div className={styles.activeBadge}>
            <Shield size={14} /> Active Personnel
          </div>
        </div>

        {/* Check-In Status */}
        {isCheckedIn && checkInTime && (
          <div className={styles.statusCard}>
            <div className={styles.statusLabel}>Currently Checked In</div>
            <div className={styles.statusTime}>
              Since {new Date(checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
        )}

        {/* Personal Details */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>{t('profile.personal')}</h3>
          <div className={styles.card}>
            <div className={styles.row}>
              <span className={styles.label}>{t('profile.badge')}</span>
              <span className={styles.value}>{user.badgeNumber}</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.row}>
              <span className={styles.label}>{t('profile.email')}</span>
              <span className={styles.value}>{user.email}</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.row}>
              <span className={styles.label}>{t('profile.phone')}</span>
              <span className={styles.value}>{user.phone}</span>
            </div>
          </div>
        </section>

        {/* Assignment Details */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>{t('profile.assignment')}</h3>
          <div className={styles.card}>
            <div className={styles.row}>
              <span className={styles.label}>{t('profile.type')}</span>
              <span className={styles.value}>{user.guardType}</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.row}>
              <span className={styles.label}>{t('profile.shift')}</span>
              <span className={styles.value}>{user.shiftName}</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.row}>
              <span className={styles.label}>{t('profile.location')}</span>
              <span className={styles.value}>{user.locationName}</span>
            </div>
          </div>
        </section>

        {/* Account Settings */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>{t('profile.account')}</h3>
          <div className={styles.card}>
            <button className={styles.actionRow} onClick={handleLanguageToggle}>
              <span className={styles.label}>{t('profile.language')}</span>
              <div className={styles.actionRight}>
                <span className={styles.value}>{i18n.language === 'en' ? 'English' : 'नेपाली'}</span>
                <ChevronRight size={18} color="var(--color-text-secondary)" />
              </div>
            </button>
            <div className={styles.divider} />
            <Link to="/dashboard/change-password" className={styles.actionRow}>
              <span className={styles.label}>{t('profile.changePassword')}</span>
              <ChevronRight size={18} color="var(--color-text-secondary)" />
            </Link>
          </div>
        </section>

        {/* Danger Zone */}
        <div className={styles.dangerZone}>
          {isCheckedIn && (
            <button 
              className={styles.checkoutBtn} 
              onClick={() => setIsCheckoutModalOpen(true)}
            >
              {t('profile.checkout')}
            </button>
          )}
          <button className={styles.logoutBtn} onClick={() => setIsLogoutModalOpen(true)}>
            <LogOut size={18} />
            {t('profile.logout')}
          </button>
        </div>
      </div>

      <Modal 
        isOpen={isCheckoutModalOpen} 
        onClose={() => setIsCheckoutModalOpen(false)}
        title="Check Out Shift"
      >
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
          Are you sure you want to check out of your current shift? You will need to verify your location again to check back in.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }}
            onClick={() => setIsCheckoutModalOpen(false)}
          >
            Cancel
          </button>
          <button 
            style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'var(--color-status-out)', border: 'none', color: 'white' }}
            onClick={handleCheckout}
          >
            Check Out
          </button>
        </div>
      </Modal>

      <Modal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)}
        title="Log Out"
      >
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
          Are you sure you want to log out?
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }}
            onClick={() => setIsLogoutModalOpen(false)}
          >
            Cancel
          </button>
          <button 
            style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'var(--color-status-out)', border: 'none', color: 'white' }}
            onClick={confirmLogout}
          >
            Log Out
          </button>
        </div>
      </Modal>

    </div>
  );
}
