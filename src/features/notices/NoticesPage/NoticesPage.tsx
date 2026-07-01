import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Spinner } from '../../../components/Spinner/Spinner';
import { useToast } from '../../../hooks/useToast';
import * as guardApi from '../../../api/guard';
import type { MockNotice } from '../../../data/models';
import styles from './NoticesPage.module.css';

export function NoticesPage() {
  const navigate = useNavigate();
  const { show } = useToast();
  
  const [notices, setNotices] = useState<MockNotice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await guardApi.getNotices();
        setNotices(data);
      } catch (error) {
        show('Failed to load notices', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [show]);

  const toggleNotice = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className={styles.container}>
      <header className={styles.appBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className={styles.title}>Notices</h1>
      </header>

      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.centerLoading}>
            <Spinner size={32} />
          </div>
        ) : notices.length === 0 ? (
          <div className={styles.emptyState}>No notices available.</div>
        ) : (
          <div className={styles.list}>
            {notices.map((notice) => {
              const isExpanded = expandedId === notice.id;
              return (
                <div key={notice.id} className={styles.card}>
                  <div 
                    className={styles.cardHeader} 
                    onClick={() => toggleNotice(notice.id)}
                  >
                    <div className={styles.headerLeft}>
                      {notice.isImportant && <span className={styles.importantBadge}>IMPORTANT</span>}
                      <h3 className={styles.noticeTitle}>{notice.title}</h3>
                      <span className={styles.date}>{notice.postedAt}</span>
                    </div>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  
                  {isExpanded && (
                    <div className={`${styles.cardBody} animate-slide-up`}>
                      {notice.body}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
