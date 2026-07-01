import { QRCodeCanvas } from 'qrcode.react';
import { Modal } from '../../../components/Modal/Modal';
import styles from './CompanyQrModal.module.css';

interface CompanyQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
}

export function CompanyQrModal({ isOpen, onClose, companyName }: CompanyQrModalProps) {
  // In a real scenario, this would be a URL pointing to the public visitor portal 
  // with the company ID in the query params or path.
  const checkInUrl = `https://vms.com/checkin/${encodeURIComponent(companyName)}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Company QR Code">
      <div className={styles.container}>
        <p className={styles.description}>
          Visitors can scan this code to begin their self check-in process.
        </p>

        <div className={styles.qrWrapper}>
          <QRCodeCanvas 
            value={checkInUrl}
            size={240}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin={true}
          />
        </div>

        <button className={styles.closeBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}
