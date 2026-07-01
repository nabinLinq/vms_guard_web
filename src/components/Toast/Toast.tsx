import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToast, type ToastType } from '../../hooks/useToast';
import styles from './Toast.module.css';
import type { JSX } from 'react/jsx-runtime';

const icons: Record<ToastType, JSX.Element> = {
  success: <CheckCircle2 className={styles.iconSuccess} size={20} />,
  error: <AlertCircle className={styles.iconError} size={20} />,
  info: <Info className={styles.iconInfo} size={20} />,
};

export function ToastContainer() {
  const { toasts, remove } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          {icons[toast.type]}
          <span className={styles.message}>{toast.message}</span>
          <button onClick={() => remove(toast.id)} className={styles.closeBtn}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
