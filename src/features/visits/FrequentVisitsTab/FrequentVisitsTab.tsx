import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VisitCard } from '../../../components/VisitCard/VisitCard';
import { Spinner } from '../../../components/Spinner/Spinner';
import { useToast } from '../../../hooks/useToast';
import * as visitsApi from '../../../api/visits';
import type { MockVisit } from '../../../data/models';
import styles from './FrequentVisitsTab.module.css';

export function FrequentVisitsTab() {
  const navigate = useNavigate();
  const { show } = useToast();
  
  const [visitors, setVisitors] = useState<MockVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await visitsApi.getFrequentVisitors();
        setVisitors(data);
      } catch (error) {
        show('Failed to load frequent visitors', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [show]);

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Regular Visitors</h3>

      <div className={styles.listContainer}>
        {isLoading ? (
          <div className={styles.centerLoading}>
            <Spinner size={32} />
          </div>
        ) : (
          <div className={styles.list}>
            {visitors.length === 0 ? (
              <div className={styles.emptyState}>No frequent visitors found.</div>
            ) : (
              visitors.map(visit => (
                <VisitCard 
                  key={visit.id} 
                  visit={visit} 
                  showCheckout={false}
                  onClick={() => navigate(`/dashboard/visit/${visit.id}`)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
