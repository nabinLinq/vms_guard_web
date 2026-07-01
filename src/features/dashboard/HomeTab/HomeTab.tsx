import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, UserCheck, UserPlus } from 'lucide-react';
import { VisitsTab } from '../../visits/VisitsTab/VisitsTab';
import { FrequentVisitsTab } from '../../visits/FrequentVisitsTab/FrequentVisitsTab';
import { WalkInPage } from '../../walkin/WalkInPage/WalkInPage';
import styles from './HomeTab.module.css';

type SubTab = 'VISITORS' | 'FREQ' | 'WALKIN';

export function HomeTab() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<SubTab>('VISITORS');

  return (
    <div className={styles.container}>
      <div className={styles.topTabBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'VISITORS' ? styles.active : ''}`}
          onClick={() => setActiveTab('VISITORS')}
        >
          <Users size={18} />
          <span>{t('dashboard.visitorTab', 'Visitors')}</span>
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'FREQ' ? styles.active : ''}`}
          onClick={() => setActiveTab('FREQ')}
        >
          <UserCheck size={18} />
          <span>{t('dashboard.freqTab', 'Freq. Visitors')}</span>
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'WALKIN' ? styles.active : ''}`}
          onClick={() => setActiveTab('WALKIN')}
        >
          <UserPlus size={18} />
          <span>Walk-In</span>
        </button>
      </div>
      
      <div className={styles.content}>
        {activeTab === 'VISITORS' && <VisitsTab />}
        {activeTab === 'FREQ' && <FrequentVisitsTab />}
        {activeTab === 'WALKIN' && <WalkInPage hideHeader onSuccess={() => setActiveTab('VISITORS')} />}
      </div>
    </div>
  );
}
