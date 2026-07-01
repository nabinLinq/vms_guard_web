import { useState } from 'react';
import { FileText, CheckCircle, Clock } from 'lucide-react';
import { IncidentForm } from '../IncidentForm/IncidentForm';
import styles from './IncidentsTab.module.css';

type IncidentStatus = 'UNACK' | 'ACK';

export function IncidentsTab() {
  const [activeTab, setActiveTab] = useState<IncidentStatus>('UNACK');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Mock data for now
  const [incidents, setIncidents] = useState([
    { id: '1', title: 'Suspicious vehicle at North Gate', description: 'White van parked for 2 hours.', time: '10:45 AM', status: 'UNACK' },
    { id: '2', title: 'Lost delivery package', description: 'Package for block B missing.', time: '09:30 AM', status: 'ACK' },
  ]);

  const filtered = incidents.filter(i => i.status === activeTab);

  const handleCreateIncident = (data: { title: string; description: string; priority: string }) => {
    const newIncident = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'UNACK',
    };
    setIncidents([newIncident, ...incidents]);
    setIsFormOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topTabBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'UNACK' ? styles.active : ''}`}
          onClick={() => setActiveTab('UNACK')}
        >
          <Clock size={18} />
          <span>Unverified</span>
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'ACK' ? styles.active : ''}`}
          onClick={() => setActiveTab('ACK')}
        >
          <CheckCircle size={18} />
          <span>Verified</span>
        </button>
      </div>

      <div className={styles.content}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>No incidents found.</div>
        ) : (
          <div className={styles.list}>
            {filtered.map(inc => (
              <div key={inc.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h4>{inc.title}</h4>
                  <span className={styles.time}>{inc.time}</span>
                </div>
                <div className={styles.cardBody}>
                  <span className={`${styles.badge} ${inc.status === 'ACK' ? styles.badgeAck : styles.badgeUnack}`}>
                    {inc.status === 'ACK' ? 'Acknowledged' : 'Pending Review'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button 
        className={styles.fab} 
        aria-label="Report Incident"
        onClick={() => setIsFormOpen(true)}
      >
        <FileText size={24} />
      </button>

      <IncidentForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleCreateIncident} 
      />
    </div>
  );
}
