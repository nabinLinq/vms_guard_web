import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Briefcase, Phone, FileText } from 'lucide-react';
import { Spinner } from '../../../components/Spinner/Spinner';
import { useToast } from '../../../hooks/useToast';
import { useOfflineQueueStore } from '../../../store/offlineQueueStore';
import * as visitsApi from '../../../api/visits';
import styles from './WalkInPage.module.css';

interface WalkInPageProps {
  hideHeader?: boolean;
  onSuccess?: () => void;
}

export function WalkInPage({ hideHeader = false, onSuccess }: WalkInPageProps = {}) {
  const navigate = useNavigate();
  const { show } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    visitorName: '',
    visitorPhone: '',
    visitorCompany: '',
    purposeType: 'MEETING',
    purposeNote: '',
    hostId: '',
    sendSms: false,
    sendEmail: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.visitorName || !formData.visitorPhone || !formData.hostId) {
      show('Please fill required fields', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await visitsApi.submitWalkin(formData);
      show('Walk-in visitor registered', 'success');
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      useOfflineQueueStore.getState().enqueue({
        type: 'WALKIN_SUBMIT',
        payload: formData
      });
      show('Walk-in registration queued offline', 'info');
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard', { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.container} ${hideHeader ? styles.tabMode : ''}`}>
      {!hideHeader && (
        <header className={styles.appBar}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <h1 className={styles.title}>Walk-In Registration</h1>
        </header>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>VISITOR DETAILS</h2>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Full Name *</label>
            <div className={styles.inputWrapper}>
              <User size={18} className={styles.icon} />
              <input
                type="text"
                name="visitorName"
                className={styles.input}
                value={formData.visitorName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Phone Number *</label>
            <div className={styles.inputWrapper}>
              <Phone size={18} className={styles.icon} />
              <input
                type="tel"
                name="visitorPhone"
                className={styles.input}
                value={formData.visitorPhone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Company / From</label>
            <div className={styles.inputWrapper}>
              <Briefcase size={18} className={styles.icon} />
              <input
                type="text"
                name="visitorCompany"
                className={styles.input}
                value={formData.visitorCompany}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>VISIT DETAILS</h2>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Assign Host *</label>
            <div className={styles.inputWrapper}>
              <select
                name="hostId"
                className={styles.select}
                value={formData.hostId}
                onChange={handleChange}
                required
              >
                <option value="">Select Host</option>
                <option value="h001">Sita Sharma</option>
                <option value="h002">Rajesh Adhikari</option>
                <option value="h003">Manisha Thapa</option>
                <option value="h004">Admin Dept</option>
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Purpose *</label>
            <div className={styles.inputWrapper}>
              <select
                name="purposeType"
                className={styles.select}
                value={formData.purposeType}
                onChange={handleChange}
                required
              >
                <option value="MEETING">Meeting</option>
                <option value="DELIVERY">Delivery</option>
                <option value="PERSONAL">Personal</option>
                <option value="INTERVIEW">Interview</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Purpose Note</label>
            <div className={styles.inputWrapper}>
              <FileText size={18} className={styles.iconTop} />
              <textarea
                name="purposeNote"
                className={styles.textarea}
                value={formData.purposeNote}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>QR DELIVERY</h2>
          
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="sendSms"
              checked={formData.sendSms}
              onChange={handleChange}
            />
            Send QR Code via SMS
          </label>
          
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="sendEmail"
              checked={formData.sendEmail}
              onChange={handleChange}
            />
            Send QR Code via Email
          </label>
        </section>

        <div className={styles.footer}>
          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? <Spinner size={24} color="#fff" /> : 'Submit Walk-In'}
          </button>
        </div>

      </form>
    </div>
  );
}
