import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Flashlight, ZapOff } from 'lucide-react';
import { QrCameraView } from '../QrCameraView/QrCameraView';
import { EnterCodeKeypad } from '../EnterCodeKeypad/EnterCodeKeypad';
import { useToast } from '../../../hooks/useToast';
import * as visitsApi from '../../../api/visits';
import styles from './ScannerPage.module.css';

type Mode = 'SCAN' | 'CODE';

export function ScannerPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { show } = useToast();
  
  const [mode, setMode] = useState<Mode>('SCAN');
  const [isValidating, setIsValidating] = useState(false);
  const [lastScanned, setLastScanned] = useState('');
  const [flashOn, setFlashOn] = useState(false);

  const handleValidateCode = useCallback(async (code: string) => {
    if (isValidating || (mode === 'SCAN' && code === lastScanned)) return;
    
    setIsValidating(true);
    setLastScanned(code);

    try {
      const res = await visitsApi.validateScanCode(code);
      if (res.success) {
        show('Code validated successfully', 'success');
        navigate('/dashboard'); // Go back to dashboard on success
      } else {
        show(res.message || 'Invalid code', 'error');
      }
    } catch (err) {
      show('Validation queued offline', 'info');
      navigate('/dashboard'); // Go back to dashboard on offline queue
    } finally {
      setIsValidating(false);
      setTimeout(() => setLastScanned(''), 3000);
    }
  }, [isValidating, mode, lastScanned, show, navigate]);

  return (
    <div className={styles.container}>
      {/* App Bar */}
      <header className={styles.appBar}>
        <button className={styles.iconBtn} onClick={() => navigate(-1)}>
          <ChevronLeft size={28} />
        </button>
        <h1 className={styles.title}>Scan or Enter Code</h1>
        <button 
          className={styles.iconBtn} 
          onClick={() => setFlashOn(!flashOn)}
          style={{ opacity: mode === 'SCAN' ? 1 : 0.3, pointerEvents: mode === 'SCAN' ? 'auto' : 'none' }}
        >
          {flashOn ? <Flashlight size={24} color="var(--color-status-waiting)" /> : <ZapOff size={24} />}
        </button>
      </header>

      <div className={styles.segmentedControl}>
        <button 
          className={`${styles.segment} ${mode === 'SCAN' ? styles.active : ''}`}
          onClick={() => setMode('SCAN')}
        >
          {t('scanner.scan', 'Scan Code')}
        </button>
        <button 
          className={`${styles.segment} ${mode === 'CODE' ? styles.active : ''}`}
          onClick={() => setMode('CODE')}
        >
          {t('scanner.enterCode', 'Enter Code')}
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
                flashOn={flashOn}
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
