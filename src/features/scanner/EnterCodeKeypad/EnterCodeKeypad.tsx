import { useState } from 'react';
import { Delete } from 'lucide-react';
import { Spinner } from '../../../components/Spinner/Spinner';
import styles from './EnterCodeKeypad.module.css';

interface EnterCodeKeypadProps {
  onValidate: (code: string) => Promise<void>;
  isLoading: boolean;
}

export function EnterCodeKeypad({ onValidate, isLoading }: EnterCodeKeypadProps) {
  const [code, setCode] = useState('');

  const handleKeyPress = (key: string) => {
    if (code.length < 6) {
      setCode(prev => prev + key);
    }
  };

  const handleDelete = () => {
    setCode(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (code.length >= 4) {
      onValidate(code);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.displayArea}>
        <div className={styles.codeDisplay}>
          {code || <span className={styles.placeholder}>Enter 4-6 digit code</span>}
        </div>
      </div>

      <div className={styles.keypad}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
          <button 
            key={num} 
            className={styles.key} 
            onClick={() => handleKeyPress(num)}
            disabled={isLoading}
          >
            {num}
          </button>
        ))}
        <button 
          className={styles.keyAction} 
          onClick={handleDelete}
          disabled={code.length === 0 || isLoading}
        >
          <Delete size={24} />
        </button>
        <button 
          className={styles.key} 
          onClick={() => handleKeyPress('0')}
          disabled={isLoading}
        >
          0
        </button>
        <button 
          className={`${styles.keyAction} ${styles.submitKey}`}
          onClick={handleSubmit}
          disabled={code.length < 4 || isLoading}
        >
          {isLoading ? <Spinner size={24} color="#fff" /> : 'OK'}
        </button>
      </div>
    </div>
  );
}
