import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { CameraOff } from 'lucide-react';
import styles from './QrCameraView.module.css';

interface QrCameraViewProps {
  onScan: (code: string) => void;
  isActive: boolean;
  flashOn?: boolean;
}

export function QrCameraView({ onScan, isActive, flashOn = false }: QrCameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    QrScanner.hasCamera()
      .then((has) => setHasCamera(has))
      .catch(() => setHasCamera(false));
  }, []);

  // Single effect: create scanner and start/stop based on isActive
  useEffect(() => {
    if (!videoRef.current || hasCamera !== true || !isActive) {
      // If not active, stop existing scanner
      if (scannerRef.current) {
        scannerRef.current.stop();
      }
      return;
    }

    // Create scanner if needed
    if (!scannerRef.current) {
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          onScanRef.current(result.data);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          returnDetailedScanResult: true,
          preferredCamera: 'environment', // Use back camera on phones
        }
      );
    }

    // Start scanning
    scannerRef.current.start().catch((err) => {
      setError('Could not access camera. Please check permissions.');
      console.error('QrScanner start error:', err);
    });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
    };
  }, [hasCamera, isActive]);

  // Effect to toggle flash
  useEffect(() => {
    if (!scannerRef.current) return;
    const scanner = scannerRef.current;
    (scanner.hasFlash() as unknown as Promise<boolean>).then((has) => {
      if (!has) return;
      if (flashOn) {
        scanner.turnFlashOn().catch(console.warn);
      } else {
        scanner.turnFlashOff().catch(console.warn);
      }
    }).catch(console.warn);
  }, [flashOn]);

  if (hasCamera === false || error) {
    return (
      <div className={styles.errorContainer}>
        <CameraOff size={48} color="var(--color-text-muted)" />
        <p className={styles.errorText}>
          {error || 'No camera detected on this device.'}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <video
        ref={videoRef}
        className={styles.video}
        playsInline
        muted
        autoPlay
      />
      <div className={styles.overlay}>
        <div className={styles.cutout}>
          <div className={`${styles.corner} ${styles.tl}`}></div>
          <div className={`${styles.corner} ${styles.tr}`}></div>
          <div className={`${styles.corner} ${styles.bl}`}></div>
          <div className={`${styles.corner} ${styles.br}`}></div>
          <div className={styles.scanLine}></div>
        </div>
      </div>
    </div>
  );
}
