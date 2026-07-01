import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { Spinner } from '../../../components/Spinner/Spinner';
import { StatusBadge } from '../../../components/StatusBadge/StatusBadge';
import { useToast } from '../../../hooks/useToast';
import { useOfflineQueueStore } from '../../../store/offlineQueueStore';
import * as visitsApi from '../../../api/visits';
import type { MockVisit } from '../../../data/models';
import styles from './VisitDetailPage.module.css';

export function VisitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show } = useToast();
  
  const [visit, setVisit] = useState<MockVisit | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In Phase 1, we just scan through our mock arrays. 
    // In Phase 2, this will be `await visitsApi.getVisitById(id)`.
    const fetchVisit = async () => {
      try {
        const [inside, waiting, freq] = await Promise.all([
          visitsApi.getInsideVisits(),
          visitsApi.getWaitingVisits(),
          visitsApi.getFrequentVisitors()
        ]);
        
        const found = [...inside, ...waiting, ...freq].find(v => v.id === id);
        if (found) setVisit(found);
        else show('Visit not found', 'error');
      } catch (e) {
        show('Error loading visit', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchVisit();
  }, [id, show]);

  const handleCheckout = async () => {
    if (!visit) return;
    
    // Optimistic
    setVisit({ ...visit, status: 'CHECKED_OUT', endTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) });
    
    try {
      await visitsApi.checkoutVisit(visit.id);
      show('Checked out successfully', 'success');
    } catch (e) {
      useOfflineQueueStore.getState().enqueue({
        type: 'VISIT_CHECKOUT',
        payload: { visitId: visit.id }
      });
      show('Checkout queued offline', 'info');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size={32} />
      </div>
    );
  }

  if (!visit) {
    return (
      <div className={styles.container}>
        <header className={styles.appBar}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
        </header>
        <div className={styles.error}>Visit not found.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.appBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className={styles.title}>Visit Detail</h1>
      </header>

      <div className={styles.content}>
        <div className={styles.statusSection}>
          <StatusBadge status={visit.status} />
        </div>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>VISITOR DETAILS</h2>
          <div className={styles.profileRow}>
            <div className={styles.avatar}>
              {visit.visitorPhotoUrl ? (
                <img src={visit.visitorPhotoUrl} alt={visit.visitorName} />
              ) : (
                <User size={32} color="var(--color-text-muted)" />
              )}
            </div>
            <div className={styles.profileInfo}>
              <h3 className={styles.name}>{visit.visitorName}</h3>
              <div className={styles.company}>{visit.visitorCompany || 'Personal'}</div>
            </div>
          </div>
          
          <div className={styles.infoRow}>
            <Phone size={18} className={styles.icon} />
            <a href={`tel:${visit.visitorPhone}`} className={styles.link}>{visit.visitorPhone}</a>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>VISIT INFOS</h2>
          
          <div className={styles.grid}>
            <div className={styles.gridItem}>
              <div className={styles.label}><Tag size={14}/> Type</div>
              <div className={styles.value}>{visit.type}</div>
            </div>
            <div className={styles.gridItem}>
              <div className={styles.label}><User size={14}/> Purpose</div>
              <div className={styles.value}>{visit.purposeType}</div>
            </div>
            <div className={styles.gridItem}>
              <div className={styles.label}><Calendar size={14}/> Date</div>
              <div className={styles.value}>{visit.scheduledDate}</div>
            </div>
            <div className={styles.gridItem}>
              <div className={styles.label}><MapPin size={14}/> Host</div>
              <div className={styles.value}>{visit.host.name}</div>
            </div>
            <div className={styles.gridItem}>
              <div className={styles.label}><Clock size={14}/> Check In</div>
              <div className={styles.value}>{visit.startTime || '—'}</div>
            </div>
            <div className={styles.gridItem}>
              <div className={styles.label}><Clock size={14}/> Check Out</div>
              <div className={styles.value}>{visit.endTime || '—'}</div>
            </div>
          </div>
        </section>

        {visit.status === 'CHECKED_IN' && (
          <button className={styles.checkoutBtn} onClick={handleCheckout}>
            Check Out Visitor
          </button>
        )}
      </div>
    </div>
  );
}
