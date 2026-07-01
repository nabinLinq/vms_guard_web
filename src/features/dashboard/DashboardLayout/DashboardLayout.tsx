import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bell, QrCode, Plus, CloudOff, Globe } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useGuardSessionStore } from '../../../store/guardSessionStore';
import { useOfflineQueueStore } from '../../../store/offlineQueueStore';
import { GuardCheckInModal } from '../GuardCheckInModal/GuardCheckInModal';
import { CompanyQrModal } from '../CompanyQrModal/CompanyQrModal';
import { HomeTab } from '../HomeTab/HomeTab';
import { IncidentsTab } from '../../incidents/IncidentsTab/IncidentsTab';
import styles from './DashboardLayout.module.css';

// Sub-component to prevent re-rendering the whole layout every minute
function DurationBanner({ checkInTime }: { checkInTime: string | null }) {
  const [duration, setDuration] = useState('');

  useEffect(() => {
    if (!checkInTime) return;
    
    const updateDuration = () => {
      const now = new Date();
      const checkIn = new Date(checkInTime);
      const diffMs = now.getTime() - checkIn.getTime();
      
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      setDuration(`${diffHrs}h ${diffMins}m`);
    };

    updateDuration();
    const interval = setInterval(updateDuration, 60000);
    return () => clearInterval(interval);
  }, [checkInTime]);

  if (!checkInTime) return null;

  return (
    <div className={styles.durationBanner}>
      Checked In Duration: <strong>{duration}</strong>
    </div>
  );
}

type TabKey = 'HOME' | 'INCIDENTS';

export function DashboardLayout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { isCheckedIn, checkInTime } = useGuardSessionStore();
  const queue = useOfflineQueueStore((state) => state.queue);
  
  const [activeTab, setActiveTab] = useState<TabKey>('HOME');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ne' : 'en';
    i18n.changeLanguage(nextLang);
  };


  return (
    <div className={styles.container}>
      {/* Geofencing check-in blocker */}
      <GuardCheckInModal />
      <CompanyQrModal 
        isOpen={isQrModalOpen} 
        onClose={() => setIsQrModalOpen(false)} 
        companyName="Company HQ" 
      />

      {/* Offline Banner */}
      {!navigator.onLine && (
        <div className={styles.offlineBanner}>
          <CloudOff size={16} />
          <span>You're offline — actions will be synced automatically.</span>
        </div>
      )}

      {/* App Bar */}
      <header className={styles.appBar}>
        <div className={styles.appBarLeft}>
          <Link to="/dashboard/profile" className={styles.avatarBtn}>
            <div className={styles.avatar}>
              {user ? getInitials(user.name) : 'G'}
            </div>
          </Link>
          <div className={styles.greeting}>
            <span className={styles.greetingText}>
              {t('dashboard.hi', { name: user?.name?.split(' ')[0] || 'Guard' })}
            </span>
          </div>
        </div>

        <div className={styles.appBarRight}>
          <button className={styles.iconBtn} onClick={toggleLanguage} title="Toggle Language">
            <Globe size={24} />
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', marginLeft: '2px' }}>
              {i18n.language === 'en' ? 'EN' : 'NE'}
            </span>
          </button>
          <button className={styles.iconBtn} onClick={() => setIsQrModalOpen(true)}>
            <QrCode size={24} />
          </button>
          
          <Link to="/dashboard/notices" className={styles.iconBtn}>
            <Bell size={24} />
            <span className={styles.badge}>3</span>
          </Link>
          
          {queue.length > 0 && (
            <div className={styles.syncBadge} title={`${queue.length} pending actions`}>
              <CloudOff size={14} />
              <span>{queue.length}</span>
            </div>
          )}
        </div>
      </header>

      {/* Duration Banner */}
      <DurationBanner checkInTime={checkInTime} />

      {/* Main Content Area */}
      <main className={styles.content}>
        {activeTab === 'HOME' && <HomeTab />}
        {activeTab === 'INCIDENTS' && <IncidentsTab />}
      </main>

      {/* Bottom Navigation */}
      <nav className={styles.bottomNav}>
        <button 
          className={`${styles.navItem} ${activeTab === 'HOME' ? styles.navActive : ''}`}
          onClick={() => setActiveTab('HOME')}
        >
          <div className={styles.navIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <span>Home</span>
        </button>
        
        {/* The center FAB cutout area is handled by CSS, this is the actual button */}
        <div className={styles.fabWrapper}>
          <button 
            className={styles.centerFab}
            onClick={() => navigate('/dashboard/scan')}
          >
            <QrCode size={28} />
          </button>
        </div>

        <button 
          className={`${styles.navItem} ${activeTab === 'INCIDENTS' ? styles.navActive : ''}`}
          onClick={() => setActiveTab('INCIDENTS')}
        >
          <div className={styles.navIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
          </div>
          <span>Incidents</span>
        </button>
      </nav>
    </div>
  );
}
