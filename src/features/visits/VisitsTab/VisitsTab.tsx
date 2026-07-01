import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VisitCard } from '../../../components/VisitCard/VisitCard';
import { Spinner } from '../../../components/Spinner/Spinner';
import { useToast } from '../../../hooks/useToast';
import { useOfflineQueueStore } from '../../../store/offlineQueueStore';
import * as visitsApi from '../../../api/visits';
import type { MockVisit } from '../../../data/models';
import styles from './VisitsTab.module.css';

type SubTab = 'INSIDE' | 'WAITING';

export function VisitsTab() {
  const navigate = useNavigate();
  const { show } = useToast();
  // We use useOfflineQueueStore.getState() directly in handlers, so we don't need to subscribe here
  
  const [activeTab, setActiveTab] = useState<SubTab>('INSIDE');
  const [insideVisits, setInsideVisits] = useState<MockVisit[]>([]);
  const [waitingVisits, setWaitingVisits] = useState<MockVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [inside, waiting] = await Promise.all([
        visitsApi.getInsideVisits(),
        visitsApi.getWaitingVisits()
      ]);
      setInsideVisits(inside);
      setWaitingVisits(waiting);
    } catch (error) {
      show('Failed to load visits', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckout = async (visitId: string) => {
    // Optimistic UI update
    setInsideVisits(prev => 
      prev.map(v => v.id === visitId ? { ...v, status: 'CHECKED_OUT' } : v)
    );
    
    try {
      await visitsApi.checkoutVisit(visitId);
      show('Visitor checked out', 'success');
      // Reload data to reflect true state
      loadData();
    } catch (error) {
      // Offline queue handles retry
      useOfflineQueueStore.getState().enqueue({
        type: 'VISIT_CHECKOUT',
        payload: { visitId }
      });
      show('Checkout queued offline', 'info');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.subTabBar}>
        <button 
          className={`${styles.subTab} ${activeTab === 'INSIDE' ? styles.active : ''}`}
          onClick={() => setActiveTab('INSIDE')}
        >
          INSIDE
          <span className={styles.countBadge}>{insideVisits.length}</span>
        </button>
        <button 
          className={`${styles.subTab} ${activeTab === 'WAITING' ? styles.active : ''}`}
          onClick={() => setActiveTab('WAITING')}
        >
          WAITING
          <span className={styles.countBadge}>{waitingVisits.length}</span>
        </button>
      </div>

      <div className={styles.listContainer}>
        {isLoading ? (
          <div className={styles.centerLoading}>
            <Spinner size={32} />
          </div>
        ) : (
          <>
            {activeTab === 'INSIDE' && insideVisits.length === 0 && (
              <div className={styles.emptyState}>No visitors inside.</div>
            )}
            
            {activeTab === 'WAITING' && waitingVisits.length === 0 && (
              <div className={styles.emptyState}>No waiting visitors.</div>
            )}

            <div className={styles.list}>
              {(activeTab === 'INSIDE' ? insideVisits : waitingVisits).map(visit => (
                <VisitCard 
                  key={visit.id} 
                  visit={visit} 
                  showCheckout={true}
                  onCheckout={handleCheckout}
                  onClick={() => navigate(`/dashboard/visit/${visit.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
