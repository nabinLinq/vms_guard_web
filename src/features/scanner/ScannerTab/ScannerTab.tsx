import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { QrCameraView } from '../QrCameraView/QrCameraView';
import { EnterCodeKeypad } from '../EnterCodeKeypad/EnterCodeKeypad';
import { useToast } from '../../../hooks/useToast';
import * as visitsApi from '../../../api/visits';
import styles from './ScannerTab.module.css';

type Mode = 'SCAN' | 'CODE';

export function ScannerTab() {
  const { t } = useTranslation();
  const { show } = useToast();
  
  const [mode, setMode] = useState<Mode>('SCAN');
  const [isValidating, setIsValidating] = useState(false);
  const [lastScanned, setLastScanned] = useState('');

  const handleValidateCode = useCallback(async (code: string) => {
    // Prevent double scans of the same code within a short time
    if (isValidating || (mode === 'SCAN' && code === lastScanned)) return;
    
    setIsValidating(true);
    setLastScanned(code);

    try {
      const res = await visitsApi.validateScanCode(code);
      if (res.success) {
        show('Code validated successfully', 'success');
        // In a real flow, you might navigate to a details page or show a modal with visitor info
        // navigate(`/dashboard/visit/${code}`);
      } else {
        show(res.message || 'Invalid code', 'error');
      }
    } catch (err) {
      // In offline mode, the action is queued. We should show a generic success/queued message
      show('Validation queued offline', 'info');
    } finally {
      setIsValidating(false);
      // Reset last scanned after 3 seconds so they can scan again
      setTimeout(() => setLastScanned(''), 3000);
    }
  }, [isValidating, mode, lastScanned, show]);

  return (
    <div className={styles.container}>
      <div className={styles.segmentedControl}>
        <button 
          className={`${styles.segment} ${mode === 'SCAN' ? styles.active : ''}`}
          onClick={() => setMode('SCAN')}
        >
          {t('scanner.scan')}
        </button>
        <button 
          className={`${styles.segment} ${mode === 'CODE' ? styles.active : ''}`}
          onClick={() => setMode('CODE')}
        >
          {t('scanner.enterCode')}
        </button>
      </div>

      <div className={styles.contentArea}>
        {mode === 'SCAN' ? (
          <div className={styles.cameraContainer}>
            <div className={styles.scanHeader}>Scan QR to enter</div>
            <div className={styles.cameraWrapper}>
              <QrCameraView 
                isActive={mode === 'SCAN'} 
                onScan={handleValidateCode} 
              />
            </div>
          </div>
        ) : (
          <div className={styles.keypadWrapper}>
            <EnterCodeKeypad 
              onValidate={handleValidateCode}
              isLoading={isValidating}
            />
          </div>
        )}
      </div>
    </div>
  );
}
