import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let colorVar = 'var(--color-status-waiting)';
  let text = status;

  if (status === 'CHECKED_IN') {
    colorVar = 'var(--color-status-inside)';
    text = 'INSIDE';
  } else if (status === 'CHECKED_OUT') {
    colorVar = 'var(--color-status-out)';
    text = 'CHECKED OUT';
  }

  return (
    <div 
      className={styles.badge}
      style={{ 
        color: colorVar, 
        backgroundColor: `color-mix(in srgb, ${colorVar} 15%, transparent)`,
        borderColor: `color-mix(in srgb, ${colorVar} 50%, transparent)`
      }}
    >
      {text}
    </div>
  );
}
