import { User, Repeat } from 'lucide-react';
import type { MockVisit } from '../../data/models';
import styles from './VisitCard.module.css';

interface VisitCardProps {
  visit: MockVisit;
  showCheckout: boolean;
  onCheckout?: (id: string) => void;
  onClick?: () => void;
}

export function VisitCard({ visit, showCheckout, onCheckout, onClick }: VisitCardProps) {
  const isCheckedIn = visit.status === 'CHECKED_IN';
  
  let statusText = visit.status;
  let statusColor = 'var(--color-status-waiting)';
  
  if (isCheckedIn) {
    statusText = 'IN';
    statusColor = 'var(--color-status-inside)';
  } else if (visit.status === 'CHECKED_OUT') {
    statusText = 'OUT';
    statusColor = 'var(--color-status-out)';
  } else if (visit.status === 'APPROVED' || visit.status === 'PENDING') {
    statusText = 'N A';
  }

  // Calculate duration if checked in
  let durationText = '';
  if (isCheckedIn && visit.startTime) {
    try {
      const [hours, minutes] = visit.startTime.split(':').map(Number);
      const now = new Date();
      let startDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
      if (startDateTime > now) {
        startDateTime.setDate(startDateTime.getDate() - 1);
      }
      const diffMs = now.getTime() - startDateTime.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const h = Math.floor(diffMins / 60);
      const m = diffMins % 60;
      durationText = h > 0 ? `${h}h ${m}m` : `${m}m`;
    } catch {
      durationText = visit.startTime;
    }
  }

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.avatarContainer}>
        {visit.visitorPhotoUrl ? (
          <img src={visit.visitorPhotoUrl} alt={visit.visitorName} className={styles.avatar} />
        ) : (
          <div className={styles.avatarFallback}>
            <User size={24} color="var(--color-text-muted)" />
          </div>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{visit.visitorName}</span>
          {visit.type === 'FREQUENT' && <Repeat size={14} className={styles.repeatIcon} />}
        </div>
        <div className={styles.company}>{visit.visitorCompany || 'N/A'}</div>
        <div className={styles.host}>{visit.host.name}</div>
      </div>

      <div className={styles.actions}>
        {isCheckedIn && durationText && (
          <div className={styles.duration}>{durationText}</div>
        )}
        
        {showCheckout && isCheckedIn ? (
          <button 
            className={styles.checkoutBtn} 
            onClick={(e) => {
              e.stopPropagation();
              onCheckout?.(visit.id);
            }}
          >
            OUT
          </button>
        ) : (
          <div className={styles.statusBadge} style={{ backgroundColor: statusColor }}>
            {statusText}
          </div>
        )}
      </div>
    </div>
  );
}
