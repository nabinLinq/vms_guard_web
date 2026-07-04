import { useState, useEffect } from 'react';
import { MapPin, MapPinOff, Loader2, CheckCircle2 } from 'lucide-react';
import { Modal } from '../../../components/Modal/Modal';
import { useAuthStore } from '../../../store/authStore';
import { useGuardSessionStore } from '../../../store/guardSessionStore';
import { ENV } from '../../../config/env';
import styles from './GuardCheckInModal.module.css';

// Haversine formula to calculate distance between two coordinates
function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Radius of the earth in m
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

type Step = 'IDLE' | 'LOCATING' | 'READY' | 'WARNING' | 'ERROR';

export function GuardCheckInModal() {
  const user = useAuthStore((state) => state.user);
  const { isCheckedIn, checkIn } = useGuardSessionStore();

  const [step, setStep] = useState<Step>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');
  const [distance, setDistance] = useState<number | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // If not checked in, immediately start locating
    if (!isCheckedIn && user && step === 'IDLE') {
      startLocating();
    }
  }, [isCheckedIn, user, step]);

  const startLocating = () => {
    if (!navigator.geolocation) {
      setStep('ERROR');
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setStep('LOCATING');
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        setCoords({ lat, lng });
        console.log(lat, lng, user)
        if (user?.workplaceLocation) {
          const dist = getDistanceFromLatLonInM(
            lat,
            lng,
            user.workplaceLocation.latitude,
            user.workplaceLocation.longitude
          );
          console.log(dist)
          setDistance(Math.round(dist));

          const maxRadius = user.workplaceLocation.guardRestrictRadius || ENV.GEOFENCE_RADIUS_M;
          console.log(maxRadius)
          if (dist <= maxRadius) {
            setStep('READY');
          } else {
            setStep('WARNING');
            setErrorMsg(`You are ${Math.round(dist)}m away from your post (Outside ${maxRadius}m range).`);
          }
        } else {
          // If no workplace location configured, allow check-in anyway
          setStep('READY');
        }
      },
      (error) => {
        setStep('ERROR');
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMsg('Location permission denied. Please enable it to check in.');
        } else {
          setErrorMsg('Failed to fetch your location. Make sure GPS is enabled.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleCheckIn = async () => {
    if (!coords) return;
    setStep('LOCATING'); // Use as a generic loading state here
    await checkIn(coords.lat, coords.lng);
    // Modal will unmount because isCheckedIn becomes true
  };

  // If already checked in, don't show the modal
  if (isCheckedIn || !user) return null;

  return (
    <Modal isOpen={true} title="Shift Check-In">
      <div className={styles.container}>

        {step === 'LOCATING' && (
          <div className={styles.stateContainer}>
            <Loader2 size={48} className={styles.spinner} color="var(--color-primary)" />
            <p className={styles.stateText}>Verifying your location...</p>
          </div>
        )}

        {step === 'ERROR' && (
          <div className={styles.stateContainer}>
            <div className={styles.iconCircleError}>
              <MapPinOff size={32} color="var(--color-status-out)" />
            </div>
            <p className={styles.errorText}>{errorMsg}</p>
            <button className={styles.retryBtn} onClick={startLocating}>
              Try Again
            </button>
          </div>
        )}

        {step === 'READY' && (
          <div className={styles.stateContainer}>
            <div className={styles.iconCircleSuccess}>
              <MapPin size={32} color="var(--color-status-inside)" />
            </div>
            <p className={styles.successText}>
              Location verified. {distance !== null ? `(${distance}m away)` : ''}
            </p>

            <div className={styles.infoCard}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Location:</span>
                <span className={styles.infoValue}>{user.locationName}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Shift:</span>
                <span className={styles.infoValue}>{user.shiftName}</span>
              </div>
            </div>

            <button className={styles.checkInBtn} onClick={handleCheckIn}>
              <CheckCircle2 size={20} />
              Check In Now
            </button>
          </div>
        )}

        {step === 'WARNING' && (
          <div className={styles.stateContainer}>
            <div className={styles.iconCircleWarning}>
              <MapPin size={32} color="var(--color-status-out)" />
            </div>
            <p className={styles.warningText}>
              {errorMsg}
            </p>

            <div className={styles.infoCard}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Location:</span>
                <span className={styles.infoValue}>{user.locationName}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Shift:</span>
                <span className={styles.infoValue}>{user.shiftName}</span>
              </div>
            </div>

            <button className={styles.checkInBtnWarning} onClick={handleCheckIn}>
              <CheckCircle2 size={20} />
              Check In Anyway
            </button>
          </div>
        )}

      </div>
    </Modal>
  );
}
