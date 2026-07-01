import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: number;
  color?: string;
}

export function Spinner({ size = 24, color = 'var(--color-primary)' }: SpinnerProps) {
  return (
    <div 
      className={styles.spinner} 
      style={{ width: size, height: size, borderColor: `${color} transparent transparent transparent` }} 
    />
  );
}
